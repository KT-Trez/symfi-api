import {expect} from 'chai';
import {APIErrorType} from '../../../typings/enums.js';


export default function expectServerError(res: any, code: number, status: number, errorType: APIErrorType, errorsLength: number) {
	expect(res.status).to.eq(status);
	expect(res.body).to.have.property('code').to.be.a('number').eq(code);
	expect(res.body).to.have.property('messages').to.be.an('array').that.is.not.empty;
	expect(res.body).to.have.property('messages').to.have.lengthOf(errorsLength);
	expect(res.body).to.have.property('type').to.be.a('string').to.have.string(errorType);
}