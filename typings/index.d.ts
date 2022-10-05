export declare module Musicly {
	export interface PlaylistData {
		id: string;
		isFavourite: boolean;
		order: number;
	}

	export interface PlaylistMetadata {
		id: string;
		cover: {
			name: string;
			uri: string | undefined;
		},
		flags: {
			hasCover: boolean;
		},
		name: string;
		order: number;
		songsCount: number;
	}

	export interface SavedSongMetadata extends SongMetadata {
		musicly: {
			cover: {
				color: string;
				name: string;
				uri: string | undefined;
			},
			file: {
				path: string | undefined;
				size: number | undefined;
			},
			flags: {
				hasCover: boolean;
				isDownloaded: boolean;
				isFavourite: boolean;
			},
			playlists: PlaylistData[];
			wasPlayed: number;
		}
	}

	export interface SongMetadata {
		channel: {
			id: string;
			name: string;
			url: string;
		}
		description: string;
		id: string;
		metadata: {
			badges: [];
			duration: {
				accessibility_label: string;
				seconds: number;
				simple_text: string;
			}
			owner_badges: string[];
			published: string;
			short_view_count_text: {
				accessibility_label: string;
				simple_text: string;
			}
			thumbnails: {
				height: number;
				url: string;
				width: number;
			}[];
			view_count: string;
		}
		title: string;
		url: string;
	}

	export interface SyncEntry {
		playLists: PlaylistMetadata[];
		songsList: SavedSongMetadata[];
		timer: NodeJS.Timer;
	}
}