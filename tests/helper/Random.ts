import crypto from 'crypto';


export default class Random {
	public static deleteProperties(object: object, quantity: number) {
		let keys = Object.keys(object);
		for (let i = 0; i < quantity; i++) { // @ts-ignore
			delete object[keys[this.getIntInclusive(0, keys.length - 1)]];
			keys = Object.keys(object);
		}
		return object;
	}

	public static getBuffer() {
		return crypto.randomBytes(32);
	}

	public static getRandomID() {
		return new Date().getTime() + Math.round(Math.random() * 1000).toString();
	}

	public static getIntInclusive(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public static getString(length: number) {
		let result = '';
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charsLength = chars.length;
		for (let i = 0; i < length; i++)
			result += chars.charAt(Math.floor(Math.random() * charsLength));
		return result;
	}
}