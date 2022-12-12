export declare module Lib {
	export interface StartConfig {
		cachePath?: string;
		logLevel?: number;
		maxWorkersCount?: number;
		useLocal?: boolean;
		port: number;
	}

	export interface MediaInfo {
		channel: {
			id: string
			name: string
			url: string
		};
		description: string;
		id: string;
		metadata: {
			duration: {
				label: string;
				seconds: number;
			}
			published: string;
			thumbnails: Thumbnail[];
			views: {
				count: number;
				label: string;
			}
		};
		title: string;
	}

	export interface Thumbnail {
		height: number;
		url: string;
		width: number;
	}
}
