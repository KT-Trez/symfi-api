import moment from 'moment/moment';


export default class Time {
	public static createTimestamp(time: number, unit: 'hours' | 'minutes' | 'seconds' | 'milliseconds') {
		switch (unit) {
			case 'seconds':
				time *= 1000;
				break;
			case 'minutes':
				time *= 1000 * 60;
				break;
			case 'hours':
				time *= 1000 * 60 * 60;
				break;
		}

		if (time < 3600000)
			return moment.utc(time).format('mm:ss');
		else
			return moment.utc(time).format('HH:mm:ss');
	}
}
