export default class APIError {
	code: number;
	messages: string[];
	type: string;

	constructor(code: number, message: string[], type: string) {
		this.code = code;
		this.messages = message;
		this.type = type;
	}
}