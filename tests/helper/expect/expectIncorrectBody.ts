import {ApiErrorCode, ApiErrorType} from '../../../types/enums';
import expectServerError from './expectServerError';


export default function expectIncorrectBody(res: any) {
	expectServerError(res, ApiErrorCode.InvalidBody, 400, ApiErrorType.InvalidRequest);
}
