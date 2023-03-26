import {ApiErrorCode, ApiErrorType} from '../../../typings/enums';
import expectServerError from './expectServerError';


export default function expectIncorrectQuery(res: any) {
	expectServerError(res, ApiErrorCode.InvalidQuery, 400, ApiErrorType.InvalidRequest);
}
