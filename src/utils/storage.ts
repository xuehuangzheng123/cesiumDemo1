import Cookies from "js-cookie";

import { decryptText, encryptText } from "./security";

interface Option {
	path: string;
	sameSite: string;
	domain?: string;
	expires?: Date;
}

class CookieStore {
	storageKey: string;
	encryptionPrefix: string;
	options: Option;
	constructor() {
		this.storageKey = "storage";
		this.encryptionPrefix = "data:;base64,";

		let opt: Option = {
			path: "/",
			sameSite: "Strict"
		};
		let domain = document.domain;
		//  see stackoverflow.com: a workaround for 'cookies not being set for localhost' is to simply not specify a domain attribute and let the browser use the default value
		let cookieDomain = /^[\d.]+$/.test(domain) ? domain : domain.replace(/^[a-z0-9-]+\./, "");
		if (cookieDomain !== "localhost") {
			opt.domain = cookieDomain;
		}
		this.options = opt;
	}
	get dataset() {
		try {
			return JSON.parse(Cookies.get(this.storageKey) || "{}");
		} catch (e) {
			Cookies.set(this.storageKey, "", { ...this.options, expires: new Date(0) });
			return {};
		}
	}
	set dataset(dataset) {
		let { options } = this;
		let { expires_time } = dataset;
		if (expires_time) {
			options.expires = new Date(+expires_time);
		}
		Cookies.set(this.storageKey, JSON.stringify(dataset), options);
		delete options.expires;
	}
	get(key: string) {
		let dataset = this.dataset;
		if (key === undefined) {
			return dataset;
		}
		if (Array.isArray(key)) {
			let keys = key;
			return keys.reduce((obj, k) => {
				obj[k] = this._get(dataset, k);
				return obj;
			}, {});
		}
		return this._get(dataset, key);
	}
	_get(dataset: any, key: string) {
		let value = dataset[key];
		if (value === undefined) {
			return value;
		}
		if (typeof value === "string" && value.startsWith(this.encryptionPrefix)) {
			let ciphertext = value.substring(this.encryptionPrefix.length);
			return JSON.parse(decryptText(ciphertext));
		}
		return JSON.parse(value);
	}
	set(key: any, value?: any, encrypted: boolean = false) {
		let dataset = this.dataset;
		if (key instanceof Object) {
			let obj = key;
			let encrypted2 = !!value;
			Object.keys(obj).forEach(k => {
				this._set(dataset, k, obj[k], encrypted2);
			});
		} else {
			this._set(dataset, key, value, encrypted);
		}
		this.dataset = dataset;
	}
	_set(dataset: any, key: string, value: any, encrypted: boolean) {
		let cleartext = JSON.stringify(value);
		if (encrypted && key !== "expires_time") {
			let cipertext = encryptText(cleartext); // cipertext is base64-encoded
			dataset[key] = this.encryptionPrefix + cipertext.replace(/=+$/, ""); // trailing '=' can be stripped
		} else {
			dataset[key] = cleartext;
		}
	}
	remove(key: string) {
		let dataset = this.dataset;
		let deleted = false;
		if (Array.isArray(key)) {
			key.forEach(k => {
				deleted = delete dataset[k];
			});
		} else {
			deleted = delete dataset[key];
		}
		if (deleted) {
			this.dataset = dataset;
		}
	}
	clear() {
		Cookies.remove(this.storageKey, this.options);
	}
	_getCookies() {
		return Cookies;
	}
	toJSON() {
		return this.dataset;
	}
}

class Store {
	storage: any;
	storageKey: string;
	constructor(s: any) {
		this.storage = s;
		this.storageKey = "potatoStorage";
	}
	get dataset() {
		return JSON.parse(this.storage.getItem(this.storageKey) || "null") || {};
	}
	set dataset(data) {
		this.storage.setItem(this.storageKey, JSON.stringify(data));
	}
	get(key: string) {
		const dataset = this.dataset;
		if (key === undefined) {
			return dataset;
		}
		if (Array.isArray(key)) {
			let keys = key;
			return keys.reduce((obj, k) => {
				obj[key] = dataset[k];
				return obj;
			}, {});
		}
		return dataset[key];
	}
	set(key: any, value: any) {
		if (arguments.length === 0 || key === undefined) {
			throw new Error("1 argument required, but only 0 present.");
		}
		let dataset = this.dataset;
		if (key === null && value instanceof Object) {
			// set(null,{}); for compatibility
			Object.assign(dataset, value);
		} else if (key instanceof Object) {
			//set({})
			Object.assign(dataset, key);
		} else {
			dataset[key] = value;
		}
		this.dataset = dataset;
	}
	remove(key: any) {
		const dataset = this.dataset;
		let deleted = false;
		if (Array.isArray(key)) {
			key.forEach(k => {
				deleted = delete dataset[k];
			});
		} else {
			deleted = delete dataset[key];
		}
		if (deleted) {
			this.dataset = dataset;
		}
	}
	clear() {
		this.storage.removeItem(this.storageKey);
	}
	toJSON() {
		return this.dataset;
	}
}

const storage = new CookieStore();
const local = new Store(window.sessionStorage);
const sessionStore = new Store(window.sessionStorage);
const store = new Store(window.localStorage);

function getLocalStore() {
	const config = store.get("setting");
	if (config && config.storage === "localStorage") {
		return store;
	}
	return local;
}

let localStore = getLocalStore();

function setSetting(config: any) {
	store.set("setting", config);
	localStore = getLocalStore();
}

export { storage as cookieStore, localStore, sessionStore, setSetting, storage };
