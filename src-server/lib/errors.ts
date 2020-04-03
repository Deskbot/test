import * as formidable from "formidable";
import * as consts from "../consts";

import { ContentPart } from "../types/ContentPart";

abstract class DeferredContentError extends Error {
	public readonly contentType: ContentPart;

	constructor(reason: string, contentType: ContentPart) {
		super(reason + " So the content was not downloaded.");
		this.contentType = contentType;
	}
}

export class AuthError extends Error {}

export class BadUrlError extends DeferredContentError {
	public readonly badUrl: string;
	constructor(contentType: ContentPart, url: string, message?: string) {
		super(message ?? "The url resource requested does not exist.", contentType);
		this.badUrl = url;
	}
}

export class BannedError extends Error {
	constructor() {
		super("You can't upload becuase you are banned.");
	}
}

export class CancelError extends Error {
	constructor(url: string) {
		super(`Download cancelled (${url}`);
	}
}

export class DownloadTooLargeError extends DeferredContentError {
	public readonly sizeLimit: string;

	constructor(contentType: ContentPart) {
		super(`The ${contentType.toString()} requested was too large (over ${consts.fileSizeLimStr}).`, contentType);
		this.sizeLimit = consts.fileSizeLimStr;
	}
}

export class DurationFindingError extends Error {

}

export class FileUploadError extends Error {
	public files: formidable.File[];

	constructor(message: string, files: formidable.File[]) {
		super(message);
		this.files = files;
	}
}

export class FormParseError extends Error {

	constructor(message: any) {
		super(message);
	}
}

export class UniqueError extends DeferredContentError {
	public readonly playedWithin: string;

	constructor(contentType: ContentPart) {
		let playedWithin;
		if (contentType === ContentPart.Music) {
			playedWithin = consts.musicPlayedWithin;
		} else {
			playedWithin = consts.imagePlayedWithin;
		}

		super(`The ${contentType} you gave has been played in the past ${playedWithin}.`, contentType);
		this.playedWithin = playedWithin;
	}
}

export class UnknownDownloadError extends DeferredContentError {
	constructor(message: string, contentType: ContentPart) {
		super(message, contentType);
	}
}

export class YTError extends Error {
	constructor(message: string) {
		super(message);
	}
}
