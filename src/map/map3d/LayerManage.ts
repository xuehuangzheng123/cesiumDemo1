import { getWimgESPG } from "@/api/modules/map";
import mapConfig from "@/assets/json/mapConfig.json";

import { checkLonLat, NormalizeBbox } from "../untils";
const { tudou3d } = window;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let terrainLayerId: string;
export function layerManage() {
	return new LayerManage();
}
export class LayerManage {
	/**
	 * 包含四种格式的添加
	 * @param {*} options
	 */
	addLayer(options: any) {
		const {
			map,
			id,
			url,
			bbox,
			zIndex,
			show = true,
			flyTo = true,
			layer = "",
			alpha,
			serviceType,
			height,
			params,
			layers,
			userData = {}
		} = options;
		console.log("addLayer", options);
		if (!map || !url || !serviceType) {
			return false;
		}
		switch (serviceType.toUpperCase()) {
			case "WVEC":
				this.addWvecLayer({
					// 添加图层
					map,
					id,
					url,
					bbox,
					flyTo,
					layer,
					show,
					alpha,
					zIndex,
					userData
				});
				break;
			case "WVECLABEL":
				this.addWvecLabelLayer({
					// 添加图层
					map,
					id,
					url,
					bbox,
					flyTo,
					layer,
					show,
					alpha,
					zIndex,
					userData
				});
				break;
			case "TMS":
				this.addTmsLayer({
					// 添加图层
					map,
					id,
					url,
					flyTo,
					layer,
					show,
					alpha,
					zIndex
				});
				break;
			case "3DTILES":
				this.add3dtiles({
					// 添加图层
					map,
					id,
					url,
					height: +height,
					flyTo,
					show,
					alpha,
					zIndex
				});
				break;
			case "WMS":
				this.addWmsLayer({
					// 添加图层
					map,
					id,
					url,

					flyTo,
					layers,
					show,
					bbox,
					zIndex,
					alpha,
					params,
					userData
				});
				break;
			case "WMTS":
				this.addWmtsLayer({
					map,
					id,
					url,

					flyTo,
					bbox,
					layer,
					layers,
					show,
					zIndex,
					alpha,
					userData
				});
				break;
			case "TERRAIN":
				this.addTerrLayer({
					id,
					map,
					url,
					show
				});
				break;
			// case "WIMG":
			// 	this.addWimgLayer({
			// 		id,
			// 		map,
			// 		url,
			// 		show
			// 	});
			// 	break;
			default:
				break;
		}
	}
	addWvecLayer(options: any) {
		// eslint-disable-next-line no-unused-vars
		const { map, url, layer, flyTo = true, show = true, id, alpha = 1, bbox, publishType, userData = {} } = options;
		let newbbox = bbox && bbox === "" ? null : bbox;
		newbbox = newbbox === "" ? null : newbbox;
		if (newbbox && !this.checkRectangle(newbbox)) {
			console.log("bbox数值不合法");
			return;
		}
		// eslint-disable-next-line valid-typeof
		if (newbbox && typeof newbbox === "object" && newbbox.maxx !== undefined) {
			newbbox = NormalizeBbox(newbbox);
		}
		let zIndex = options.zIndex || 0;
		if (isNaN(options.zIndex)) {
			zIndex = this.getTopLayerZindex({ map });
		}
		console.log("addWvecLayer", options);

		const tileLayer = new tudou3d.layer.WmtsLayer({
			name: "wvec",
			zIndex,
			id,
			url,
			layer,
			style: "",
			show,
			flyTo,
			bbox: newbbox,
			crs: "EPSG:4326",
			format: "image/png",
			subdomains: ["0", "1", "2", "3", "4", "5", "6"],
			tileMatrixLabels: [
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"11",
				"12",
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"20",
				"21",
				"22"
			], // 会替换tileMatrix参数 config.json中时直接写数组值
			tileMatrixSetID: "EPSG:4326",
			alpha,
			publishType,
			userData
		});
		map.addLayer(tileLayer);
	}
	addWvecLabelLayer(options: any) {
		const { CustomMap, Cesium } = window;
		// eslint-disable-next-line no-unused-vars
		const {
			map,
			url,
			// eslint-disable-next-line
			flyTo = true,
			// eslint-disable-next-line
			show = true,
			// eslint-disable-next-line
			id,
			// eslint-disable-next-line
			alpha = 1,
			bbox,
			// eslint-disable-next-line
			userData = {}
		} = options;
		let newbbox = bbox && bbox === "" ? null : bbox;
		newbbox = newbbox === "" ? null : newbbox;
		if (newbbox && !this.checkRectangle(newbbox)) {
			console.log("bbox数值不合法");
			return;
		}
		// eslint-disable-next-line valid-typeof
		if (newbbox && typeof newbbox === "object" && newbbox.maxx !== undefined) {
			newbbox = NormalizeBbox(newbbox);
		}
		let zIndex = options.zIndex || 0;
		if (isNaN(options.zIndex)) {
			zIndex = this.getTopLayerZindex({ map });
		}
		console.log("addWvecLayer", options);
		const labelLayer = new CustomMap.LabelTileServiceImageryProvider(map.viewer, {
			zIndex,
			url,
			tilingScheme: new Cesium.GeographicTilingScheme(),
			tileMatrixLabels: [
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"11",
				"12",
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"20",
				"21",
				"22"
			],
			maximumLevel: 18,
			tileWidth: 512,
			tileHeight: 512,
			needDecode: true,
			// show: false,
			// dataType: 'binary',
			defaultHeight: 5000,
			fontName: "微软雅黑",
			glyphUrl: "lib/mapserver/fonts/{fontstack}/{range}.pbf"
		});
		labelLayer.id = id;
		labelLayer.name = "wvecLabel";
		map.imageryLayers.addImageryProvider(labelLayer);
	}
	addWmsLayer(options: any) {
		const { map, url, layers, bbox, show = true, id, flyTo = true, alpha = 1, params = {}, userData = {}, publishType } = options;
		const parameters = {
			transparent: "true",
			format: "image/png",
			tiled: true
		};
		if (params) {
			// eslint-disable-next-line
			Object.assign(parameters, params);
		}

		if (!layers) {
			return;
		}
		if (bbox && !this.checkRectangle(bbox)) {
			console.log("bbox数值不合法");
			return;
		}
		let newBoox = bbox;
		// eslint-disable-next-line valid-typeof
		if (bbox && "maxy" in bbox) {
			newBoox = NormalizeBbox(bbox);
		}
		let zIndex = options.zIndex || 0;
		if (isNaN(options.zIndex)) {
			zIndex = this.getTopLayerZindex({ map });
		}
		const wmsLayer = new window.tudou3d.layer.WmsLayer({
			name: "wms",
			id,
			zIndex,
			url,
			layers: decodeURIComponent(layers),
			show,
			flyTo,
			bbox: newBoox,
			crs: "EPSG:4326",
			getCapabilities: false,
			parameters,
			alpha,
			userData,
			publishType
		});
		map.addLayer(wmsLayer);
	}
	addTmsLayer(options: any) {
		// eslint-disable-next-line no-unused-vars
		const { map, url, show = true, id, flyTo = true, alpha = 1 } = options;
		let zIndex = options.zIndex || 0;
		if (isNaN(options.zIndex)) {
			zIndex = this.getTopLayerZindex({ map });
		}
		const tmsLayer = new window.tudou3d.layer.TmsLayer({
			name: "tms",
			id,
			zIndex,
			url,
			show,
			flyTo,
			alpha
		});
		map.addLayer(tmsLayer);
	}
	addWmtsLayer(options: any) {
		const { map, url, flyTo = true, layer, layers, show = true, id, alpha = 1, bbox, params = {}, publishType, zIndex } = options;
		// const layer = 'datagaea:td_dltb_2020_721266143';
		if (!layer && !layers) {
			return;
		}
		const newLayer = layer || layers;
		const parameters = {
			transparent: "true",
			format: "image/png"
		};
		if (params) {
			// eslint-disable-next-line
			Object.assign(parameters, params);
		}
		// const zIndex = 0;
		const tileLayer = new window.tudou3d.layer.WmtsLayer({
			name: "wmts",
			bbox,
			zIndex,
			id,
			url,
			layer: newLayer,
			getCapabilities: false,
			show,
			flyTo,
			parameters,
			crs: "EPSG:4326",
			format: "image/png",
			tileMatrixSetID: "EPSG:4326",
			style: "",
			tilingScheme: new window.Cesium.GeographicTilingScheme(),
			subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
			// eslint-disable-next-line
			tileMatrixLabels: [
				"EPSG:4326:0",
				"EPSG:4326:1",
				"EPSG:4326:2",
				"EPSG:4326:3",
				"EPSG:4326:4",
				"EPSG:4326:5",
				"EPSG:4326:6",
				"EPSG:4326:7",
				"EPSG:4326:8",
				"EPSG:4326:9",
				"EPSG:4326:10",
				"EPSG:4326:11",
				"EPSG:4326:12",
				"EPSG:4326:13",
				"EPSG:4326:14",
				"EPSG:4326:15",
				"EPSG:4326:16",
				"EPSG:4326:17",
				"EPSG:4326:18",
				"EPSG:4326:19",
				"EPSG:4326:20",
				"EPSG:4326:21"
			],
			alpha,
			publishType
		});
		map.addLayer(tileLayer);
	}
	add3dtiles(options: any) {
		// eslint-disable-next-line no-unused-vars
		const { map, id, url, flyTo = true, height, alpha = 1 } = options;
		const tiles3dLayer = new window.tudou3d.layer.TilesetLayer({
			name: "tileset",
			id,
			url,
			flyTo,
			// position: {
			//   alt: height,
			// },
			height, // 模型基础高度
			alpha
		});

		if (flyTo) {
			tiles3dLayer.on(window.tudou3d.EventType.load, () => {
				this.setFlyTo({
					map,
					id
				});
			});
		}
		map.addLayer(tiles3dLayer);

		tiles3dLayer.tileset.readyPromise.then((tileset: any) => {
			const cartographic = window.Cesium.Cartographic.fromCartesian(tiles3dLayer.boundingSphere.center);
			const surface = window.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
			const offset = window.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
			const translation = window.Cesium.Cartesian3.subtract(offset, surface, new window.Cesium.Cartesian3());
			tileset.modelMatrix = window.Cesium.Matrix4.fromTranslation(translation);
		});
	}
	addTerrLayer(options: any) {
		const { map, id, url } = options;
		let newUrl = url;
		if (url.toString().includes("/layer.json")) {
			newUrl = url.toString().split("/layer.json")[0];
		} else {
			newUrl = url;
		}
		terrainLayerId = id;
		// 切换地形的时候，所有图层都隐藏，切换完成后再加载
		this.terrainChange({
			map,
			show: false
		});
		// let newUrl = 'https://mapdata.i-tudou.com/mapdata/terrain2/layer.json';
		//  newUrl = 'https://mapdata.i-tudou.com/mapdata/terrain2/';

		map.viewer.scene.terrainProvider = new window.Cesium.CesiumTerrainProvider({
			url: newUrl
		});
		// 切换地形的时候，所有图层都隐藏，切换完成后再显示
		setTimeout(() => {
			this.terrainChange({
				map,
				show: true
			});
		}, 1000);
	}
	// 地形切换事件处理
	terrainChange(options: any) {
		const { map, show } = options;
		map.getLayers().forEach((itemLayer: any) => {
			itemLayer.show = show;
		});
	}
	async addWimgLayer(options: any) {
		let { map, url } = options;
		let zIndex = options.zIndex || 0;
		if (isNaN(options.zIndex)) {
			zIndex = this.getTopLayerZindex({ map });
		}
		url = url[url.length - 1] === "/" ? url : url + "/";
		const urlStringToArr = url.split("/");
		const imgServeId = urlStringToArr[urlStringToArr.length - 2];
		const {
			data: { gridTreeName }
		} = await getWimgESPG({ id: imgServeId });
		let crs = "EPSG:4490";
		if (gridTreeName.includes("tdt_meter")) {
			crs = "EPSG:3857";
		} else if (gridTreeName.includes("tdt_degree")) {
			crs = "EPSG:4490";
		}
		const newUrl = `${url}{z}/{x}/{y}/getMap?tilesize=256`;
		Object.assign(options, {
			zIndex,
			name: "wimg",
			url: newUrl,
			crs
		});
		const tmsLayer = new window.tudou3d.layer.XyzLayer(options);
		map.addLayer(tmsLayer);
		return tmsLayer;
	}
	removeLayer(options: any) {
		const { map, id, state, hasDestroy } = options;
		const labelLayer = (map.imageryLayers._layers.filter((item: any) => item.id === id) || [])[0];
		if (labelLayer && labelLayer.name === "wvecLabel") {
			map.imageryLayers.remove(labelLayer, true);
			labelLayer._imageryProvider.destroy();
			return;
		}
		const layer = map.getLayerById(id);
		const undergroundLayer = map.getLayerById(id + "_underground"); // 查询是否有地下图层
		if (id === terrainLayerId) {
			// 切换地形的时候，所有图层都隐藏，切换完成后再显示
			this.terrainChange({
				map,
				show: false
			});
			const { url } = mapConfig.terrain;
			map.viewer.scene.terrainProvider = new window.Cesium.CesiumTerrainProvider({
				url
			});
			// 切换地形的时候，所有图层都隐藏，切换完成后再显示
			setTimeout(() => {
				this.terrainChange({
					map,
					show: true
				});
			}, 1000);
		} else if (layer) {
			map.removeLayer(layer, hasDestroy);
		} else {
			console.log(`id为${id}图层未找到`);
		}
		undergroundLayer && map.removeLayer(undergroundLayer, hasDestroy); // 删除地下图层
		// ///////////////////////////////////////
		const alllayer = this.getAllCustomLayer({
			map,
			filter: ["wvec", "wms"]
		});
		// 处理穿透查询的情况
		if (!state) {
			alllayer.forEach((layer: any) => {
				const layerId = layer.options.id.toString();
				if (layerId.includes("-crossMark") && layerId.includes(id.toString())) {
					map.removeLayer(layer);
				}
			});
		}
	}
	//  获取所有业务图层
	//  需要查询哪种类型，传入哪种类型即可
	getAllCustomLayer(options: any) {
		const { map, filter = ["wvec", "wmts", "tms", "wms", "tileset", "wfs", "wvecwfs"] } = options;
		const layers = map.getLayers();
		const customLayers = layers.filter((item: any) => {
			if (filter.includes(item.name)) {
				return item;
			}
		});
		return customLayers;
	}
	// 校验范围
	private checkRectangle(rectangle: any) {
		if (Array.isArray(rectangle)) {
			const { lonResult: lon1, latResult: lat1 } = checkLonLat({
				longitude: rectangle[2],
				latitude: rectangle[3]
			});
			const { lonResult: lon2, latResult: lat2 } = checkLonLat({
				longitude: rectangle[0],
				latitude: rectangle[1]
			});
			if (lon1 && lon2 && lat1 && lat2) {
				return true;
			}
			return false;
		} else if (Object.keys(rectangle).length > 0) {
			const { lonResult: lon1, latResult: lat1 } = checkLonLat({
				longitude: rectangle.minx || rectangle.xmin,
				latitude: rectangle.miny || rectangle.ymin
			});
			const { lonResult: lon2, latResult: lat2 } = checkLonLat({
				longitude: rectangle.maxx || rectangle.xmax,
				latitude: rectangle.maxy || rectangle.ymax
			});
			if (lon1 && lon2 && lat1 && lat2) {
				return true;
			}
			return false;
		}
		return false;
	}
	// 获取最顶层图层Zindex
	getTopLayerZindex(options: any) {
		const { map } = options;
		const layer = this.getTopLayer({ map });
		if (layer) {
			return layer.zIndex + 1;
		}
		return 0;
	}
	// 获取顶层图层'wvec' 'wmts', 'tms', 'wms' 模型不涉及叠加顺序
	getTopLayer(options: any) {
		const { map } = options;
		const layers = map.getLayers();
		const customLayers = layers.filter((item: any) => {
			if (["wvec", "wmts", "tms", "wms"].includes(item.name)) {
				return item;
			}
		});
		let topIndex = -1;
		let topZindex = -1;
		customLayers.forEach((item: any, index: number) => {
			if (item.hasZIndex) {
				if (topZindex < item.zIndex) {
					topZindex = item.zIndex;
					topIndex = index;
				}
			}
		});
		if (topIndex > -1) {
			return customLayers[topIndex];
		}
		return null;
	}
	// 设置定位到目标图层
	setFlyTo(options: any) {
		const { map, id } = options;
		const layer = map.getLayerById(id);
		if (layer && layer.type === "tileset") {
			if (layer.tileset.boundingSphere) {
				map.camera.flyToBoundingSphere(layer.tileset.boundingSphere, {
					offset: new window.Cesium.HeadingPitchRange(6, -0.6, layer.tileset.boundingSphere.radius * 2.5)
				});
			} else {
				map.flyToPoint(layer.position, {
					radius: layer.tileset.boundingSphere.radius * 2,
					heading: 3.1,
					pitch: -45,
					roll: 0
				});
			}
		} else if (layer) {
			layer.flyTo();
		} else {
			console.log("图层未添加");
		}
	}
	// 显隐图层
	setLayerShow(options: any) {
		const { map, id, show = true } = options;
		const layer = map.getLayerById(id);
		if (layer) {
			layer.show = show;
		} else {
			console.log(`id为${id}图层未找到`);
		}
		return layer;
	}
	// 设置透明度
	setLayerOpacity(options: any) {
		const { map, id, alpha = 1 } = options;
		const layer = map.getLayerById(id);
		if (layer) {
			layer.setOpacity(alpha);
			layer.opacity = alpha;
		} else {
			console.log("id为" + id + "的图层没找到");
		}
	}
	// 获取图层透明度
	getLayerOpacity(options: any) {
		const { map, id } = options;
		const layer = map.getLayerById(id);
		if (layer) {
			return layer.opacity;
		}
		console.log(`id为${id}图层未找到`);

		return 1;
	}
	// 设置所有业务图层透明度
	setAllLayerOpacity(options: any) {
		const { map, alpha = 1 } = options;
		const layers = map.getLayers();
		const customLayers = layers.filter((item: any) => {
			if (["wvec", "wmts", "tms", "wms", "tileset"].includes(item.name)) {
				return item;
			}
		});
		customLayers.forEach((item: any) => {
			item.setOpacity(alpha);
			item.opacity = alpha;
		});
	}
}
