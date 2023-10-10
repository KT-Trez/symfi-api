import {ApiErrorCode, ApiErrorType} from '../../../types/enums';
import expectServerError from './expectServerError';


export default function expectIncorrectPath(res: any) {
	expectServerError(res, ApiErrorCode.InvalidPath, 400, ApiErrorType.InvalidRequest);
}
