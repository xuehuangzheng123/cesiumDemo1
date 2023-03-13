function btoaUrlSafe(s: string) {
	interface MapInterface {
		[key: string]: string;
	}
	let map: MapInterface = { "+": "-", "/": "_", "=": "" };
	return btoa(s).replace(/[+\x2F=]/g, c => map[c]);
}
export const getSafeRedirectUrl = (url: string = "") => {
	return btoaUrlSafe(url ? url : location.href);
};

// 登录url
export const getLoginUrl = (isRedirect: boolean = true) => {
	let domain = document.domain;
	//  see stackoverflow.com: a workaround for 'cookies not being set for localhost' is to simply not specify a domain attribute and let the browser use the default value
	let cookieDomain = /^[\d.]+$/.test(domain) ? domain : domain.replace(/^[a-z0-9-]+\./, "");
	return `${document.location.protocol}//${cookieDomain !== "localhost" ? "zrzy-sa." + cookieDomain : "localhost:30001"}/login${
		isRedirect ? "?redirect=" + getSafeRedirectUrl() : ""
	}`;
};
