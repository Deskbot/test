import { ProgressQueue } from "../lib/ProgressQueue";
import { MakeOnce } from "../lib/utils/MakeOnce";

export const ProgressQueueServiceGetter = new (class extends MakeOnce<ProgressQueue> {
	make(): ProgressQueue {
		const service = new ProgressQueue();
		service.startTransmitting();
		return service;
	}
})();
