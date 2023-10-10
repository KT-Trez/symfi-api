import {expect} from 'chai';
import fs from 'fs';
import {Musicly_Server} from '../../../bundle/src/index';

export default function expectMusicInCache(musicIDs: string[]) {
	const cacheContent = fs.readdirSync(Musicly_Server.instance.config.cache.path);
	expect(cacheContent.length).to.be.gt(0);
	for (const musicID of musicIDs)
		expect(cacheContent.includes(musicID));
}
