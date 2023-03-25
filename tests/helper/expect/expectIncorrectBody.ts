import {APIErrorType} from '../../../typings/enums.js';
import expectServerError from './expectServerError.js';


export default function expectIncorrectBody(res: any, incorrectBodyErrorsQuantity: number) {
	expectServerError(res, 400, 400, APIErrorType.InvalidRequest, incorrectBodyErrorsQuantity);
}