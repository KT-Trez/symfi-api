import {APIErrorType} from '../../../typings/enums.js';
import expectServerError from './expectServerError.js';


export default function expectNoResource(res: any) {
	expectServerError(res, 404, 404, APIErrorType.NoResource, 1);
}