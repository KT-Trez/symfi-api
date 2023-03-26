import {ApiErrorCode, ApiErrorType} from '../../../typings/enums.js';
import expectServerError from './expectServerError.js';


export default function expectNoResource(res: any) {
	expectServerError(res, ApiErrorCode.NoResource, 404, ApiErrorType.NoResource, 1);
}
