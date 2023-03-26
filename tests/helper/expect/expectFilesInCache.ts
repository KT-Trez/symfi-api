import {expect} from 'chai';
import fs from 'fs';
import {Musicly_Server} from '../../../bundle/src/index';

export default function expectFilesInCache() {
	expect(fs.readdirSync(Musicly_Server.instance.config.cache.path).length).to.be.gt(0);
}
