import express from 'express';

export declare module Lib {
	export interface Config {
		cache: {
			path: string;
		}
		download: {
			useProxy: boolean
		}
		express: {
			port: number
		},
		sync: {
			IDLength: number;
			storeTimeoutMS: number;
		}
		workers: {
			maxCount: number
		}
	}

	export type CustomHandler = ((req: express.Request, res: express.Response) => void);

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
