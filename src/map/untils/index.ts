export function NormalizeBbox(bbox: any) {
	let newBbox: any;
	if (bbox) {
		if (Array.isArray(bbox)) {
			newBbox = bbox;
		} else if (typeof bbox === "string") {
			const currentBbox = JSON.parse(bbox);
			if (Array.isArray(currentBbox)) {
				newBbox = currentBbox;
			} else {
				newBbox = [
					parseFloat(currentBbox.minx),
					parseFloat(currentBbox.miny),
					parseFloat(currentBbox.maxx),
					parseFloat(currentBbox.maxy)
				];
			}
		}
	} else {
		newBbox = null;
	}
	return newBbox;
}
// 校验经纬度直是否合法
export function checkLonLat(options: any) {
	const { longitude, latitude } = options;
	let lonResult = false;
	let latResult = false;
	const regLon = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/;
	if (longitude && regLon.test((+longitude).toFixed(10))) {
		lonResult = true;
	} else {
		lonResult = false;
	}
	const regLat = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/;
	if (latitude && regLat.test((+latitude).toFixed(10))) {
		latResult = true;
	} else {
		latResult = false;
	}
	return { lonResult, latResult };
}
// 解析url提取有用参数
export function dealGeoserverUrl(geoserverUrl: string, type: string = "wms") {
	try {
		if (geoserverUrl) {
			const baseUrl = decodeUrl(geoserverUrl);
			const bboxParam = baseUrl.match(/&bbox=(\S*?)&/);
			let bbox = bboxParam ? bboxParam[1].split(",").map(Number) : [];
			let layers = getQueryVariable(baseUrl, "layers");
			const version = getQueryVariable(baseUrl, "version");
			const srs = getQueryVariable(baseUrl, "srs");
			const width = getQueryVariable(baseUrl, "width");
			const height = getQueryVariable(baseUrl, "height");
			let url = baseUrl.split("?")[0];
			if (type.toLowerCase() === "wms") {
			} else if (type.toLowerCase() === "wmts") {
				//  url = geoserverUrl.split('geoserver')[0] + 'geoserver/gwc/service/wmts';
				layers = getQueryVariable(baseUrl, "layer");
				if (bbox.filter(i => !!i).length === 0) {
					bbox = [];
				}
			}
			if (bbox.length != 0) {
				return {
					bbox,
					layers,
					url,
					version,
					srs,
					width,
					height
				};
			}
		}
		return {};
	} catch (error) {
		return {};
	}
}
// url中特殊字符转义为原始字符
export function decodeUrl(url: string) {
	return decodeURIComponent(url);
}
// url解析
export function getQueryVariable(url: string, variable: string) {
	if (url) {
		const query = url.substring(1);
		const vars = query.split("&");
		for (let i = 0; i < vars.length; i++) {
			const pair = vars[i].split("=");
			if (pair[0].toLowerCase() === variable.toLowerCase()) {
				return pair[1];
			}
		}
	}
	return "";
}

/**
 * 获取url中的参数
 * @param {*} url
 * @param {*} variable
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getParams(url: string, variable?: boolean) {
	const params: any = [];
	let h;
	if (url) {
		const hash = url.slice(url.indexOf("?") + 1).split("&");
		for (let i = 0; i < hash.length; i++) {
			h = hash[i].split("="); //
			params[h[0]] = h[1];
		}
	}
	return params;
}
export function decideDistrictLevel(districtCode: any) {
	let data: any;
	if (districtCode.length >= 12) {
		data = {
			level: 5,
			type: "village"
		}; // 村级
	} else if (districtCode.length > 8) {
		data = {
			level: 4,
			type: "town"
		}; // 街道
	} else if (districtCode.match(/^\d{2}0000$/)) {
		data = {
			level: 1,
			type: "province"
		}; // 省级
	} else if (districtCode.match(/^\d{4}00$/)) {
		data = {
			level: 2,
			type: "city"
		}; // 市级
	} else {
		data = {
			level: 3,
			type: "county"
		}; // 县级
	}

	return data;
}
