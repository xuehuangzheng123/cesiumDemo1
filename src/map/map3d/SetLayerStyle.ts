// 设置服务样式
import { legend } from "./Legend";
export function setLayerStyle() {
	return new SetLayerStyle();
}
export class SetLayerStyle {
	async setStyle(options: any) {
		const { serviceType, originalOptions } = options;

		switch (serviceType.toUpperCase()) {
			case "WVEC":
				let mapserverParams = await legend().getMapserverParams({ url: originalOptions.url });
				return this.mapServeStyle({ url: originalOptions.url, layerIds: mapserverParams?.layerId, ...options });
			case "WMS":
			case "WMTS":
				return this.geoServeStyle(options);
			default:
				break;
		}
	}
	async mapServeStyle(options: any) {
		const {
			url,
			color,
			stroke,
			layerIds,
			strokeOpacity,
			strokeColor,
			strokeWidth,
			opacity,
			filterStr,
			originalOptions = {}
		} = options;
		const layers: any = [];
		layerIds.forEach((item: any) => {
			const layersOptions: any = {
				filterStr,
				id: item,
				idFilter: null,
				display: true
			};
			if (color || strokeColor || strokeWidth || strokeOpacity || opacity || stroke) {
				layersOptions.color = {
					color,
					strokeColor,
					strokeWidth,
					strokeOpacity,
					opacity: opacity === 0 ? 0.00001 : opacity,
					stroke
				};
			}
			layers.push(layersOptions);
		});
		const filter = {
			layers,
			order: []
		};

		let control = JSON.stringify(filter);
		control = encodeURIComponent(control);
		const controlId = await legend().getControlId({
			url,
			control
		});
		const styUrl = url + "&controlId=" + controlId;
		const newOptions = JSON.parse(JSON.stringify(originalOptions));
		newOptions.url = styUrl;
		return { url: styUrl, mergeOptions: newOptions };
	}
	geoServeStyle(options: any) {
		if (options.opacity > 1) {
			options.opacity = options.opacity / 100;
		}
		if (options.strokeOpacity > 1) {
			options.strokeOpacity = options.strokeOpacity / 100;
		}
		const {
			// eslint-disable-next-line
			color: fill_env,
			// eslint-disable-next-line
			opacity: fillOpacity_env,
			// eslint-disable-next-line
			strokeColor: stroke_env,
			// eslint-disable-next-line
			strokeWidth: strokeWidth_env,
			// eslint-disable-next-line
			strokeOpacity: strokeOpacity_env,
			// eslint-disable-next-line no-unused-vars, camelcase
			filterStr: cql_filter
		} = options;
		let env = "";
		// eslint-disable-next-line camelcase
		if (fill_env) {
			// eslint-disable-next-line camelcase
			env += `fill_env:${fill_env};`;
		}
		// eslint-disable-next-line camelcase
		env += `fillOpacity_env:${fillOpacity_env};`;
		// eslint-disable-next-line camelcase
		env += `strokeWidth_env:${strokeWidth_env};`;
		// eslint-disable-next-line camelcase
		env += `strokeOpacity_env:${strokeOpacity_env};`;
		// eslint-disable-next-line camelcase
		if (stroke_env) {
			// eslint-disable-next-line camelcase
			env += `stroke_env:${stroke_env};`;
		}
		const params: any = {};
		params.env = env;
		// eslint-disable-next-line camelcase
		// 就离谱,写成空字符串也不行！！！！！undefined不行！！！
		if (cql_filter) {
			params.cql_filter = cql_filter;
		}
		const newOptions = JSON.parse(JSON.stringify(options.originalOptions));
		newOptions.parameters = params;
		return { parameters: params, url: options.originalOptions.userData.orginalUrl, mergeOptions: newOptions };
	}
}
