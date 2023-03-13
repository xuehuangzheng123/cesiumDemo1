/**
 * 图例使用方法
 * @returns
 */
import axios from "axios";
import WKTGeojson from "terraformer-wkt-parser";

// import utils from '../utils/index';
export function legend() {
	// eslint-disable-next-line no-use-before-define
	return new Legend();
}
interface legendOptions {
	url: string;
	serviceName?: string;
	serverUrl?: string;
	str?: string;
	query?: string;
	level?: number;
	prevLevel?: number;
	styleId?: string;
	latitude?: string | number;
	longitude?: string | number;
	filter?: string;
	wkt?: string;
	serverName?: string;
	l?: number;
	bbox?: number[];
	filters?: any;
	filterStr?: string;
	display?: boolean;
	otherDisplay?: boolean;
	layerIds?: string[] | number[];
	control?: string;
}
interface LayerIdOptions extends legendOptions {
	layerId: string[];
}
function getParams(url: string) {
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
export class Legend {
	/**
	 *获取图例样式ID  对应mapserver的是styleId
	 * @param {*} options
	 */
	getStyleId(options: legendOptions) {
		const { url } = options;
		const { styleId } = getParams(url);
		return styleId;
	}
	/**
	 *获取服务名称  对应mapserver的是 serverName
	 * @param {*} optionslegendOptions
	 * @returns
	 */
	getServiceName(options: legendOptions) {
		const { url } = options;
		let serviceName = "";
		if (url) {
			const urlArray = url.split("/");
			for (let i = 0; i < urlArray.length - 1; i++) {
				if (urlArray[i] === "vmap") {
					serviceName = urlArray[i + 1];
					break;
				}
			}
		}
		return serviceName;
	}
	/**
	 * 获取图层id  对应mapserver中的layerName/图层id
	 */
	getlayerID(options: legendOptions) {
		const { url, serviceName, styleId } = options;
		let layerUrl = url.split("/vmap/")[0] + `/styleInfo/${serviceName}/${styleId}/layer.json`;
		layerUrl = layerUrl.replace("{s}", "0");
		return new Promise(resolve => {
			axios.get(layerUrl).then(data => {
				if (!data.data) {
					return;
				}
				let layerId: any = [];
				for (const i in data.data) {
					layerId.push(data.data[i].id);
				}
				resolve(layerId);
			});
		});
	}
	/**
	 *获取图层信息
	 * @param {*} options
	 */
	async getMapserverParams(options: legendOptions) {
		let { url } = options;
		url = url.replace("{s}", "0");
		const serviceName = await this.getServiceName({
			url
		});
		const styleId = this.getStyleId(options);
		if (serviceName) {
			const layerId = await this.getlayerID({
				url,
				serviceName,
				styleId
			});
			return {
				url,
				layerId,
				serviceName,
				styleId
			};
		}
	}

	/**
	 *获取图层元数据
	 * @param {*} options
	 */
	getLayerOriginFields(options: legendOptions) {
		let { serverUrl: url } = options;
		if (url) {
			url = url.replace("{s}", "0");
			return new Promise(resolve => {
				let baseUrl = url?.split("/mapserver/")[0] + "/mapserver";
				if (url) {
					this.getMapserverParams({
						url
					}).then((res: any) => {
						baseUrl = `${baseUrl}/${res.serviceName}/${res.layerId}/getInfo.json`;
						resolve(baseUrl);
					});
				}
			});
		}
	}
	// 获取图例
	getLegend(legendUrl: string) {
		let pathDepth = 1;
		return new Promise(resolve => {
			const orginUrl = legendUrl.replace("{s}", "0");
			axios.get(orginUrl).then(res => {
				const { data, status } = res;
				if (status === 200) {
					const map: any = {};
					const { legends } = data;
					legends.forEach((item: any) => {
						const maxPathDepth = item.path.split("_").length;
						if (item.path.split("_").length > pathDepth) {
							pathDepth = maxPathDepth;
						}
					});
					for (let i = 0; i < legends.length; i++) {
						const item = legends[i];
						const key: string = item.path.split("_")[pathDepth - 1];
						if (!key) {
							continue;
						}
						let { query } = item;
						if (query) {
							// 去掉首尾空格
							query = query.replace(/(^\s*)|(\s*$)/g, "");
							// 去除过滤条件尾部的and或or
							query = this.updateQuery(query);
						}
						let legendItem = map[key];
						if (!legendItem) {
							legendItem = {};
							legendItem.ico = item.ico;
							legendItem.path = item.path;
							if (query) {
								legendItem.query = " " + query;
							}
							map[key] = legendItem;
						} else {
							if (query) {
								if (legendItem.query) {
									legendItem.query = legendItem.query + " or " + query;
								} else {
									legendItem.query = " " + query;
								}
							}
						}
					}
					resolve(map);
				} else {
					console.log("图例资源请求失败");
				}
			});
		});
	}
	// 去除过滤条件尾部的and或or
	updateQuery(str: string) {
		const endTwo = str.substring(str.length - 2);
		const endThree = str.substring(str.length - 3);
		if (endTwo.toUpperCase() === "OR") {
			// eslint-disable-next-line no-param-reassign
			str = str.substring(0, str.length - 2);
		}
		if (endThree.toUpperCase() === "and") {
			// eslint-disable-next-line no-param-reassign
			str = str.substring(0, str.length - 3);
		}
		return str;
	}
	// 更新选择的图层
	async getFilterUrl(options: LayerIdOptions) {
		let { str, layerId, url } = options;
		url = url.replace("{s}", "0");
		if (!str) {
			// 当没有查询条件的时候就不显示图层
			return null;
		}
		const filter = {
			layers: [
				{
					color: null,
					display: true,
					filterStr: str,
					filters: {},
					id: layerId[0],
					idFilter: null
				}
			],
			order: [],
			otherDisplay: false
		};
		let control = JSON.stringify(filter);
		control = encodeURIComponent(control);
		const controlId = await this.getControlId({
			url,
			control
		});
		const resultUrl = url + "&controlId=" + controlId;
		return resultUrl;
	}
	// 获取拼接后的查询条件
	async getSql(options: LayerIdOptions) {
		let { str, layerId, url } = options;
		url = url.replace("{s}", "0");
		if (!str) {
			// 当没有查询条件的时候就不显示图层
			return "";
		}
		const filter = {
			layers: [
				{
					color: null,
					display: true,
					filterStr: str,
					filters: {},
					id: layerId[0],
					idFilter: null
				}
			],
			order: [],
			otherDisplay: false
		};
		let control = JSON.stringify(filter);
		control = encodeURIComponent(control);
		const controlId = await legend().getControlId({
			url,
			control
		});
		const sql = "&controlId=" + controlId;
		return sql;
	}
	/**
	 *获取高亮url
	 * @returns
	 */
	async getHightUrl(options: LayerIdOptions) {
		let { query, url, layerId } = options;
		url = url.replace("{s}", "0");
		const filter = {
			layers: [
				{
					color: {
						color: "red",
						opacity: 0.7
					},
					display: true,
					filterStr: query,
					filters: {},
					id: layerId[0],
					idFilter: null
				}
			],
			order: [],
			otherDisplay: false
		};
		let control = JSON.stringify(filter);
		control = encodeURIComponent(control);
		const controlId = await legend().getControlId({
			url,
			control
		});
		const resultUrl = url + "&controlId=" + controlId;
		return resultUrl;
	}
	/**
	 * 更新图例
	 */
	updateLegends(options: legendOptions) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		let { level, prevLevel, url, serviceName, styleId } = options;
		url = url.replace("{s}", "0");
		if (level) {
			level = level + 2;
			level = Math.round(level);
		}
		if (level !== prevLevel) {
			const legendUrl = `${url.split("/vmap/")[0]}/styleInfo/${serviceName}/${styleId}/` + level + "/legend.json";
			type obj = {
				name: string;
				ico: string;
				query: string;
				path: string;
			};
			const legend: Array<obj> = [];
			return new Promise(resolve => {
				self.getLegend(legendUrl).then((map: any) => {
					for (const i in map) {
						const obj = {
							name: i,
							ico: map[i].ico,
							query: map[i].query,
							path: map[i].path
						};
						legend.push(obj);
					}
					resolve(legend);
				});
			});
		}
	}
	/**
	 *查询坐标位置信息
	 get接口
	 * @param {*} options
	 */
	getSearchInfo(options: LayerIdOptions) {
		let { latitude, longitude, url, serviceName, layerId, filter = "" } = options;
		url = url.replace("{s}", "0");
		const baseUrl = `${url.split("/vmap/")[0]}/${serviceName}/${layerId[0]}/query?spatialFilter=POINT`;
		let hasOgcFid = false;
		let resultFilter = filter;
		if (filter && (filter.toLowerCase().includes("q_ogcfid_l_in") || filter.toLowerCase().includes("q_uid_l_in"))) {
			const filterArray = filter.split("and");
			filterArray.forEach(element => {
				if (element.indexOf("Q_ogcFid_L_IN") > -1 || element.indexOf("Q_uid_L_IN") > -1) {
					hasOgcFid = true;
				}
			});
			if (hasOgcFid) {
				resultFilter = "";
				filterArray.forEach(element => {
					if (!(element.indexOf("Q_ogcFid_L_IN") > -1 || element.indexOf("Q_uid_L_IN") > -1)) {
						if (resultFilter) {
							resultFilter = resultFilter + ` and ${element}`;
						} else {
							resultFilter = element;
						}
					}
				});
			}
		}
		const resultUrl = baseUrl + `(${longitude}  ${latitude})&withGeometry=true&filter=${resultFilter}`;
		return new Promise(resolve => {
			axios.get(resultUrl).then(res => {
				if (res.data.length > 0) {
					const { ogcFid, uid } = res.data[0];
					if (!hasOgcFid || filter.indexOf(ogcFid) > -1 || filter.indexOf(uid) > -1) {
						resolve(res);
					} else {
						resolve({ data: [] });
					}
				}
			});
		});
	}
	/**
	 *查询坐标位置信息
	 post接口
	 * @param {*} options
	 */
	getSearchInfo2(options: LayerIdOptions) {
		let { latitude, longitude, url, serviceName, layerId, filter } = options;
		url = url.replace("{s}", "0");
		const baseUrl = `${url.split("/vmap/")[0]}/${serviceName}/${layerId[0]}/query`;
		const params = {
			spatialFilter: `POINT(${longitude} ${latitude})`,
			withGeometry: "true",
			filter
		};
		return axios.post(baseUrl, params);
	}

	/**
	 * 获取Mapserver服务的要素数据
	 * @param {*} options
	 */
	async getWvecFeatureData(options: legendOptions) {
		let { url, wkt } = options;
		url = url.replace("{s}", "0");
		if (!url) return;
		const serviceName = await this.getServiceName({
			url
		});
		const styleId = await this.getStyleId({
			url
		});
		if (serviceName && styleId) {
			let layerId = (await this.getlayerID({
				url,
				serviceName,
				styleId
			})) as string[];
			const data = await legend().getPolygonSearchInfo({
				url,
				serviceName,
				layerId,
				wkt
			});
			if (data?.status === 200) {
				return this.FormatWvecFeatureData(data.data);
			}
		}
	}
	/**
	 * 格式化wvec数据
	 * @param {*} datas
	 * @returns
	 */
	FormatWvecFeatureData(datas: any[]) {
		const features: any[] = [];
		datas.forEach(data => {
			const { geom, ...attribute } = data;
			// eslint-disable-next-line
			const geometry = WKTGeojson.parse(geom);
			const feature = window.turf.feature(geometry);
			feature.properties = attribute;
			features.push(feature);
		});
		console.log("第一个geometry", features[0].geometry);
		const fc = window.turf.featureCollection(features);
		// const combined = window.turf.combine(fc);
		return fc;
	}

	/**
	 *查询多边形区域内信息
	 * @param {*} options
	 */
	async getPolygonSearchInfo(options: LayerIdOptions) {
		let { url, serviceName, wkt, layerId } = options;
		url = url.replace("{s}", "0");

		const baseUrl = `${url.split("/vmap/")[0]}/${serviceName}/${layerId[0]}/query?spatialFilter=`;
		const resultUrl = baseUrl + `${wkt}&withGeometry=true`;

		// const resultUrl = baseUrl + `${wkt}&withGeometry=true&filter=${filter}`;
		return axios.get(resultUrl);
	}

	/**
	 *获取图片
	 * @param {*} options
	 */
	getImage(options: legendOptions) {
		let { url, serverName, styleId, l = 10, bbox } = options;
		url = url.replace("{s}", "0");
		// eslint-disable-next-line
		if (bbox) {
			return `${url.split("/vmap/")[0]}/vmap/${serverName}/export?serverName=${serverName}&styleId=${styleId}&l=${l}&bbox=${
				bbox[0]
			},${bbox[1]},${bbox[2]},${bbox[3]}`;
		}
	}

	/**
	 *获取图片
	 * @param {*} options
	 */
	async getFilterImage(options: legendOptions) {
		let { filters, filterStr, display = true, otherDisplay = false, layerIds, url, serverName, styleId, l = 15, bbox } = options;
		url = url.replace("{s}", "0");
		type layersOptionsType = {
			display: boolean;
			filterStr: string | undefined;
			filters: any;
			id: string | number;
			otherDisplay: boolean;
			idFilter: any;
		};
		const layers: Array<layersOptionsType> = [];
		if (layerIds) {
			for (let index = 0; index < layerIds.length; index++) {
				const layerId = layerIds[index];
				const layersOptions = {
					display,
					filterStr,
					filters,
					id: layerId,
					otherDisplay,
					idFilter: null
				};
				layers.push(layersOptions);
			}
		}
		const filter = {
			layers,
			order: [],
			otherDisplay
		};
		console.log(filter);
		let control = JSON.stringify(filter);
		control = encodeURIComponent(control);
		const controlId = await legend().getControlId({
			url,
			control
		});
		if (bbox) {
			// eslint-disable-next-line
			const filterUrl = `${url.split("/vmap/")[0]}/vmap/${serverName}/export?styleId=${styleId}&l=${l}&bbox=${bbox[0]},${
				bbox[1]
			},${bbox[2]},${bbox[3]}&controlId=${controlId}`;
			return filterUrl;
		}
	}
	// 获取图例json
	// 里面包含颜色
	getLegendJson(options: LayerIdOptions) {
		let { url, layerId, styleId, level = 10 } = options;
		url = url.replace("{s}", "0");
		const legendUrl = `${url.split("/vmap/")[0]}/styleInfo/${layerId[0]}/${styleId}/${level}/legend.json`;
		axios.get(legendUrl);
	}

	/**
	 *获取提取可用的字段，只有提取到的字段在可以在筛选的时候使用
	 * @param {*} options
	 * @param {String} options.url 服务url
	 */
	async getMergeFields(options: legendOptions) {
		type mapserverParamsType = {
			url: string;
			layerId: string;
			serviceName: string;
			styleId: string;
		};
		let { url, serviceName } = (await this.getMapserverParams(options)) as mapserverParamsType;
		url = url.replace("{s}", "0");
		const layerUrl = url.split("/vmap/")[0] + `/serverInfo/${serviceName}.json`;
		const res = await axios.get(layerUrl);
		if (res.status === 200) {
			let { mergeFields } = res.data.info.utfGrid;
			mergeFields = mergeFields.split(",");
			console.log("mergeFields", mergeFields);
			return mergeFields;
		}
	}

	/**
	 * 获取图层详情
	 * @param {*} options
	 * @param {String} options.url 服务url
	 */
	async getServerInfo(options: legendOptions) {
		let { url, serviceName } = options;
		url = url.replace("{s}", "0");
		const layerUrl = url.split("/vmap/")[0] + `/serverInfo/${serviceName}.json`;
		const res = await axios.get(layerUrl);
		if (res.status === 200) {
			return res.data;
		}
	}
	/**
	 * 后去controlId，用于参数过长的情况
	 * @param {*} options
	 * @param {String} options.url 服务url
	 * @param {Object} options.control 服务control条件
	 */
	async getControlId(options: legendOptions) {
		let { control, url } = options;
		url = url.replace("{s}", "0");
		const serviceName = this.getServiceName({ url });
		const controlUrl = url.split("/vmap/")[0] + `/vmap/${serviceName}/setControl`;
		if (control) {
			const res = await axios.post(controlUrl, {
				control: decodeURIComponent(control)
			});
			if (res.status === 200) {
				const { id } = res.data;
				return id;
			}
		}
	}
}
