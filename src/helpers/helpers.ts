import $ from 'jquery';
import showNotification from '../components/extras/showNotification';
export function test() {
	return null;
}

export function getOS() {
	const { userAgent } = window.navigator;
	const { platform } = window.navigator;
	const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
	const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
	const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
	let os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'MacOS';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'Windows';
	} else if (/Android/.test(userAgent)) {
		os = 'Android';
	} else if (!os && /Linux/.test(platform)) {
		os = 'Linux';
	}

	// @ts-ignore
	document.documentElement.setAttribute('os', os);
	return os;
}
export const GetQueryParam = (key: string) => {
	const query = window.location.search.replace('?', '');
	const params = query.split('&');
	for (let i = 0; i < params.length; i++) {
		const paramPart = params[i].split('=');
		if (paramPart[0] === key) {
			return paramPart[1];
		}
	}
	return null;
}

export const hasNotch = () => {
	/**
	 * For storybook test
	 */
	const storybook = window.location !== window.parent.location;
	// @ts-ignore
	const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
	const aspect = window.screen.width / window.screen.height;
	const aspectFrame = window.innerWidth / window.innerHeight;
	return (
		(iPhone && aspect.toFixed(3) === '0.462') ||
		(storybook && aspectFrame.toFixed(3) === '0.462')
	);
};

export const mergeRefs = (refs: any[]) => {
	return (value: any) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref != null) {
				ref.current = value;
			}
		});
	};
};

export const randomColor = () => {
	const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	const color = Math.floor(Math.random() * colors.length);

	return colors[color];
};

export const priceFormat = (price: number) => {
	return price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});
};

export const average = (array: any[]) => array.reduce((a, b) => a + b) / array.length;

export const percent = (value1: number, value2: number) =>
	Number(((value1 / value2 - 1) * 100).toFixed(2));

export const getFirstLetter = (text: string, letterCount = 2): string =>
	// @ts-ignore
	text
		.toUpperCase()
		.match(/\b(\w)/g)
		.join('')
		.substring(0, letterCount);

export const debounce = (func: (arg0: any) => void, wait = 1000) => {
	let timeout: string | number | NodeJS.Timeout | undefined;

	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			// @ts-ignore
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export const CONSTANT = {
	ResponseStatus: <any>{
		ERROR: 'error',
		SUCCESS: 'success',
		UNAUTHORIZED: 'unauthorized'
	},
	RowPerPage: [15, 30, 50],
	RequestHeaderDefault: <any>{
		'Content-Type': 'application/json',
		'Authorization': (localStorage.getItem('userToken') === '' || localStorage.getItem('userToken') === null) ? '' : localStorage.getItem('userToken')
	},
	HOST_API_URL : 'http://103.149.28.63:5478/api',
	HOST_URL: 'http://103.149.28.63:5478',
	//HOST_API_URL: 'http://localhost:62300/api',
	//HOST_URL: 'http://localhost:62300',
	NUMBER: {
		ROW_PER_PAGE: 15
	}
}
export function GetObjectProperty(obj: any, prop: string, defaultValue: string | any | number | null = '') {
	try {
		if (obj === '' || obj === null || typeof obj === 'undefined') return defaultValue;
		if (obj[prop] === '' || obj[prop] === null || typeof obj[prop] === 'undefined') return defaultValue;
		return obj[prop];
	}
	catch (err) { }
	return defaultValue;
}
export function removeVietnameseTones(str: string) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");
	// Some system encode vietnamese combining accent as individual utf-8 characters
	// Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	// Remove extra spaces
	// Bỏ các khoảng trắng liền nhau
	str = str.replace(/ + /g, " ");
	str = str.trim();
	// Remove punctuations
	// Bỏ dấu câu, kí tự đặc biệt
	str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
	return str;
}

export function CheckErrorResponse(model: any) {
	if (GetObjectProperty(model, 'status') === CONSTANT.ResponseStatus.UNAUTHORIZED) {
		localStorage.removeItem('userToken');
		showNotification('Waring', 'Token expired. You had login again to continue.', 'danger');
		window.location.href = '/';
		return false;
	} else if (GetObjectProperty(model, 'status') === CONSTANT.ResponseStatus.ERROR) {
		if (GetObjectProperty(model, 'message') !== '') showNotification('Waring', GetObjectProperty(model, 'message'), 'danger');
		return false;
	}
	return true;
}

export async function SendPostRequest(url: string, model: any | null = null): Promise<any> {
	try {
		let rq = await fetch(CONSTANT.HOST_API_URL + url, {
			method: 'post',
			headers: CONSTANT.RequestHeaderDefault,
			body: JSON.stringify(model)
		});
		let rs = await rq.json();
		return rs;
	}
	catch (ex) { return null; }
}
export async function SendGetRequest(url: string): Promise<any | null> {
	try {
		let rq = await fetch(CONSTANT.HOST_API_URL + url, {
			method: 'get',
			headers: CONSTANT.RequestHeaderDefault
		});
		let rs = await rq.json();
		return rs;
	}
	catch (ex) { return null; }
}
export function DateStringFormat({ stringDate, currentFormat = 'yyyy/mm/dd', newFormat = 'dd/mm/yyyy' }: { stringDate: any, currentFormat?: string | 'yyyy/mm/dd', newFormat: string }) {
	if (stringDate === '' || stringDate === null || typeof stringDate === 'undefined') return '';
	if (typeof stringDate === 'object') {
		newFormat = newFormat.replace('dd', (stringDate.getDate() > 9 ? stringDate.getDate() + '' : '0' + stringDate.getDate()));
		newFormat = newFormat.replace('mm', (stringDate.getMonth() + 1 > 9 ? (stringDate.getMonth() + 1) + '' : '0' + (stringDate.getMonth() + 1)));
		newFormat = newFormat.replace('yyyy', stringDate.getFullYear() + '');
		newFormat = newFormat.replace('hh', stringDate.getHours() > 9 ? stringDate.getHours() + '' : '0' + stringDate.getHours());
		newFormat = newFormat.replace('mi', stringDate.getMinutes() > 9 ? stringDate.getMinutes() + '' : '0' + stringDate.getMinutes());
		newFormat = newFormat.replace('ss', stringDate.getSeconds() > 9 ? stringDate.getSeconds() + '' : '0' + stringDate.getSeconds());
		return newFormat;
	}

	const stringDatePart = stringDate.split(/[-\/._,\\+=!@#$%ˆ&* :a-zA-Z]/g);
	const currentFormatPart = currentFormat.split(/[-\/._,\\+=!@#$%ˆ&* :]/g);
	for (var i = 0; i < stringDatePart.length; i++) {
		if (currentFormatPart[i] === 'dd') newFormat = newFormat.replace('dd', stringDatePart[i].length < 2 ? '0' + stringDatePart[i] : stringDatePart[i]);
		if (currentFormatPart[i] === 'mm') newFormat = newFormat.replace('mm', stringDatePart[i].length < 2 ? '0' + stringDatePart[i] : stringDatePart[i]);
		if (currentFormatPart[i] === 'yyyy') newFormat = newFormat.replace('yyyy', stringDatePart[i]);
		if (currentFormatPart[i] === 'hh') newFormat = newFormat.replace('hh', stringDatePart[i].length < 2 ? '0' + stringDatePart[i] : stringDatePart[i]);
		if (currentFormatPart[i] === 'mi') newFormat = newFormat.replace('mi', stringDatePart[i].length < 2 ? '0' + stringDatePart[i] : stringDatePart[i]);
		if (currentFormatPart[i] === 'ss') newFormat = newFormat.replace('ss', stringDatePart[i].length < 2 ? '0' + stringDatePart[i] : stringDatePart[i]);
	}
	return newFormat;
}

export const ToggleDropdown = (e: any) => {
	const dropdown = $(e.target).closest('.dropup');
	if ($(dropdown).hasClass('open')) {
		$(dropdown).removeClass('open');
		$(dropdown).find('ul').css('display', 'none');
	}
	else {
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		$(dropdown).addClass('open');
		$(dropdown).find('ul').css('display', 'flex');
	}

}
export  const CloseAllDropup = (e: any) => {
	if ($(e.target).closest('.dropup').length <= 0) {
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
	}
}