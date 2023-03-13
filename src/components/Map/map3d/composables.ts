import { onMounted } from "vue";

import { LayerManage } from "@/map/map3d/LayerManage";
import { Legend } from "@/map/map3d/Legend";
import { setLayerStyle } from "@/map/map3d/SetLayerStyle";
import { dealGeoserverUrl, NormalizeBbox } from "@/map/untils";

import { MapMethods } from "./interface/index";

export const mapCommon = () => {
	let layerManage: any;
	let legend: any;
	onMounted(() => {
		layerManage = new LayerManage();
		// highLayer = new HighLayer();
		legend = new Legend();
	});
	const addLayer: MapMethods.AddLayerFunItf = async options => {
		let {
			map,
			url,
			id,
			show = true,
			alpha = 1,
			flyTo = false,
			serviceType,
			bbox,
			height = 0,
			layerInfo,
			zIndex,
			filterStr,
			userData = {},
			parameters
		} = options;
		userData.filterStr = filterStr;
		const params = parameters || {};
		if (filterStr) {
			params.cql_filter = filterStr;
		}
		if (serviceType.toLowerCase() === "wms") {
			userData.orginalUrl = url;
			let { url: baseUrl, bbox, layers } = dealGeoserverUrl(url, serviceType);
			if (!layers) {
				bbox = options.bbox;
				layers = options.layers;
			}
			layerManage.addLayer({
				zIndex,
				map,
				url: baseUrl,
				serviceType,
				flyTo,
				show,
				id,
				bbox,
				layers,
				alpha,
				params,
				userData
			});
		} else if (serviceType.toLowerCase() === "wvec") {
			userData.orginalUrl = url;
			if (url.includes("controlId")) {
				userData.orginalUrl = url.split("/controlId")[0];
			}
			let layerIds = [];
			if (!layerInfo) {
				const { layerId } = await legend.getMapserverParams({
					url
				});
				layerIds = layerId;
			} else {
				layerIds = layerInfo ? layerInfo.map((v: any) => v.name) : [];
			}
			let styleOptions = await setLayerStyle().mapServeStyle({
				url,
				layerIds,
				filterStr
			});
			let baseUrl = styleOptions.url;

			if (!baseUrl.includes("mapserver{s}")) {
				baseUrl = "http://mapserver{s}.tudoucloud.com:8083/mapserver/vmap" + baseUrl.split("mapserver/vmap")[1];
			}
			// 需要判断是不是标注图层
			const serviceName = legend.getServiceName({ url });
			const data = await legend.getServerInfo({ url, serviceName });
			// console.log(data);
			const { labels } = data.info;
			if (labels && labels[Object.keys(labels)[0]].labelType === "point") {
				baseUrl = baseUrl
					.replace("vmap", "label")
					.replace("getMAP", "getData")
					.replace("getMap", "getData")
					.replace("TileCol", "x")
					.replace("TileRow", "y")
					.replace("TileMatrix", "z");
				// 图层为标注图层
				await layerManage.addLayer({
					zIndex,
					map,
					url: baseUrl,
					serviceType: "wvecLabel",
					bbox: NormalizeBbox(bbox),
					show,
					alpha,
					flyTo,
					id,
					params,
					userData
				});
			} else {
				// 其他瓦片图层
				await layerManage.addLayer({
					zIndex,
					map,
					url: baseUrl,
					serviceType,
					bbox: NormalizeBbox(bbox),
					show,
					alpha,
					flyTo,
					id,
					params,
					userData
				});
			}
		} else if (serviceType.toLowerCase() === "tms") {
			layerManage.addLayer({
				map,
				url,
				show,
				bbox: NormalizeBbox(bbox),
				id,
				flyTo,
				alpha,
				serviceType,
				zIndex
			});
		} else if (serviceType.toLowerCase() === "wmts") {
			let {
				url: baseUrl,
				bbox,
				layers
				// layer,
			} = dealGeoserverUrl(url, serviceType);
			if (!baseUrl) {
				baseUrl = options.url;
				// eslint-disable-next-line
				bbox = options.bbox;
				// eslint-disable-next-line
				layers = options.layers;
				// eslint-disable-next-line
				// layer = options.layer;
			}

			layerManage.addLayer({
				map,
				url: baseUrl,
				show,
				id,
				flyTo,
				alpha,
				bbox,
				layers,
				// layer,
				userData,
				serviceType,
				zIndex
			});
		} else if (serviceType.toLowerCase() === "terrain" || serviceType.toLowerCase() === "terr") {
			layerManage.addLayer({
				map,
				id,
				flyTo,
				url,
				show,
				serviceType: "terrain"
			});
		} else if (serviceType.toLowerCase() === "wimg") {
			layerManage.addLayer({
				id,
				map,
				url,
				flyTo,
				bbox: NormalizeBbox(bbox),
				show,
				serviceType,
				zIndex
			});
		} else if (serviceType.toLowerCase() === "3dtiles") {
			layerManage.addLayer({
				map,
				id,
				url,
				height: +height,
				flyTo,
				show,
				alpha,
				zIndex,
				serviceType
			});
		}
	};
	const removeLayer: MapMethods.RemoveLayerItf = options => {
		const { id, map, hasDestroy } = options;
		if (map.getLayerById(id)) {
			layerManage.removeLayer({
				map,
				id,
				hasDestroy
			});
		} else {
			console.log(`图层${id}不存在`);
		}
	};
	const setLayerOpacity: MapMethods.LayerOpacityItf = options => {
		layerManage.setLayerOpacity(options);
	};
	const setLayerShow: MapMethods.LayerShowItf = options => {
		layerManage.setLayerShow(options);
	};
	return {
		addLayer,
		removeLayer,
		setLayerOpacity,
		setLayerShow
	};
};
