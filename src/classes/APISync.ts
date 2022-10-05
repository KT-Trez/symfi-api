import APISuccess from './APISuccess.js';


export default class APISync extends APISuccess {
	uid: string;

	constructor(success: boolean, uid: string) {
		super(success);
		this.uid = uid;
	}
}