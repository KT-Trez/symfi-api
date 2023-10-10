import {ApiErrorType} from '../../types/enums';


export default class ApiError {
	code: number;
	messages: string[];
	type: ApiErrorType;

	constructor(code: number, message: string[], type: ApiErrorType) {
		this.code = code;
		this.messages = message;
		this.type = type;
	}
}
