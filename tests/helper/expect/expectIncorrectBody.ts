import {ApiErrorCode, ApiErrorType} from '../../../typings/enums';
import expectServerError from './expectServerError';


export default function expectIncorrectBody(res: any) {
	expectServerError(res, ApiErrorCode.InvalidBody, 400, ApiErrorType.InvalidRequest);
}
