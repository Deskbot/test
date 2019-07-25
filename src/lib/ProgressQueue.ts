/*
 * percentages are 0 to 1
 */

import { EventEmitter } from 'events';

import * as consts from './consts.js';
import * as opt from '../../options.js';
import * as utils from './utils.js';

import { QuickValuesMap } from './QuickValuesMap.js';

export class ProgressQueue extends EventEmitter {
	private idFactory;
	private lastQueueLength;
	private queues;
	private totalContents;
	private transmitIntervalId;

	constructor(idFactory) {
		super();

		this.idFactory = idFactory;
		this.lastQueueLength = {};
		this.queues = {}; // userId -> QuickValuesMap<contentId, progress item>
		this.totalContents = 0;
		this.transmitIntervalId = null;
	}

	add(userId, contentId, title?) {
		if (!this.queues[userId]) {
			this.queues[userId] = new QuickValuesMap();
		}

		const newItem = {
			contentId,
			percent: 0,
			title: title || '',
			unprepared: true,
			userId
		};

		this.queues[userId].set(contentId, newItem);
		this.totalContents++;

		this.transmitToUserMaybe(userId);
		this.maybeItemIsPrepared(newItem);
	}

	addAutoUpdate(userId, contentId, func) {
		const item = this.findQueueItem(userId, contentId);
		if (item) item.autoUpdate = func;
	}

	addCancelFunc(userId, contentId, func) {
		const item = this.findQueueItem(userId, contentId);
		if (item) {
			item.cancellable = true;
			item.cancelFunc = func;
		}
	}

	autoUpdateQueue(queueMap) {
		for (let item of queueMap.valuesQuick()) {
			if (item.autoUpdate) item.autoUpdate();
		}
	}

	cancel(userId, contentId) {
		const item = this.findQueueItem(userId, contentId);
		if (item && item.cancelFunc) {
			const success = item.cancelFunc();
			if (success) this.finished(userId, contentId);
			return success;
		}
	}

	createUpdater(userId, contentId) {
		//find the target queue item
		const targetItem = this.findQueueItem(userId, contentId);

		if (targetItem) {
			//hold on to the reference
			return (percent) => {
				targetItem.percent = percent * consts.maxPercentBeforeFinished;
			};
		} else {
			return utils.doNothing;
		}
	}

	deleteQueueItem(item) {
		const queueMap = this.queues[item.userId];

		queueMap.delete(item.contentId);
		this.totalContents--;
	}

	findQueueItem(userId, contentId) {
		const queueMap = this.queues[userId];

		if (!queueMap) return;

		return queueMap.get(contentId);
	}

	finished(userId, contentId) {
		this.deleteQueueItem(this.findQueueItem(userId, contentId));
		this.emit('delete', userId, contentId);
	}

	finishedWithError(userId, contentId, error) {
		this.deleteQueueItem(this.findQueueItem(userId, contentId));
		this.emit('error', userId, contentId, error);
	}

	getQueue(userId) {
		const queueMap = this.queues[userId];

		if (queueMap) return queueMap.valuesQuick();
		return;
	}

	/* emits a 'prepared' event when the item has all the data needed
	 * for Clippy to talk to the user about the item by name
	 */
	maybeItemIsPrepared(item) {
		if (item.unprepared && item.title && !item.titleIsTemp) {
			delete item.unprepared;
			delete item.titleIsTemp;
			this.emit('prepared', item.userId, item);
		}
	}

	setTitle(userId, contentId, title, temporary=false) {
		const item = this.findQueueItem(userId, contentId);
		item.title = title;
		item.titleIsTemp = temporary;

		this.maybeItemIsPrepared(item); // might have just gained all the data needed

		this.transmitToUserMaybe(userId);
	}

	startTransmitting() {
		this.transmitIntervalId = setInterval(this.transmit.bind(this), opt.dlPercentUpdateFreq);
	}

	stopTransmitting() {
		clearInterval(this.transmitIntervalId);
		this.transmitIntervalId = null;
	}

	transmit() {
		if (this.totalContents === 0) return;

		for (let userId in this.queues) {
			this.transmitToUserMaybe(userId);
		}
	}

	transmitToUserMaybe(userId) {
		const queueMap = this.queues[userId];
		const queueLength = queueMap.size;

		if (queueLength > 0 || this.lastQueueLength[userId] > 0) {
			this.autoUpdateQueue(queueMap);
			this.emit('list', userId, queueMap.valuesQuick());
			this.lastQueueLength[userId] = queueLength;
		}
	}
}