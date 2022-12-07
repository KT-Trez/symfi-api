import {ApiError as IApiError} from '../../gen/model/apiError';


export default class ApiError implements IApiError {
	code: number;
	messages: string[];
	type: IApiError.TypeEnum;

	constructor(code: number, message: string[], type: IApiError.TypeEnum) {
		this.code = code;
		this.messages = message;
		this.type = type;
	}
}
