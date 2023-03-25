import {APIErrorType} from '../../../typings/enums.js';
import expectServerError from './expectServerError.js';


export function expectIncorrectParams(res: any, additionalErrorsCount?: number) {
	expectServerError(res, 400, 400, APIErrorType.InvalidRequest, 1 + (additionalErrorsCount ?? 0));
}