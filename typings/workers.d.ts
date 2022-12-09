export declare namespace Workers {
	namespace WorkerData {
		interface DownloadAudio {
			videoID: string;
		}
	}

	namespace ParentPort {
		interface DownloadAudio {
			error?: Error;
			path?: string;
			type: 'end' | 'error';
		}
	}
}