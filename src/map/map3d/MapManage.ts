const { tudou3d } = window;
export function mapManage() {
	return new MapManage();
}
export class MapManage {
	/**
	 * 初始化地球
	 * @param {*} options
	 * @returns
	 */
	initMap(options: any = {}) {
		const { id, mapOptions } = options;
		const map = new tudou3d.Map(id, mapOptions);
		this.addCameraGetLevel();
		map.viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度监测
		return map;
	}
	// 增加获取相机高度
	addCameraGetLevel() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		window.Cesium.Camera.prototype.getLevel = function () {
			// eslint-disable-next-line
			let { height } = this._positionCartographic;
			if (height === this.prevCameraHeight) {
				return this.level;
			}
			this.prevCameraHeight = height;
			// 角度
			const angle = window.Cesium.Math.toDegrees(this.pitch) + 90;
			// 弧度
			const radians = window.Cesium.Math.toRadians(angle);
			height = height / Math.cos(radians);
			this.level = self.altitudeToZoom(height);
			return this.level;
		};
	}
	// 根据高度获取地图层级
	altitudeToZoom(altitude: number) {
		const A = 40487.57;
		const B = 0.00007096758;
		const C = 91610.74;
		const D = -40467.74;
		return D + (A - D) / (1 + Math.pow(altitude / C, B));
	}
	/**
	 * 监控鼠标左键点击事件
	 */
	setLeftClick(options: any = {}) {
		const { map, callback, active = true, context } = options;
		const { viewer } = map;
		if (active) {
			map.on(
				tudou3d.EventType.click,
				(event: { position: any }) => {
					if (event.position) {
						const ray = viewer.camera.getPickRay(event.position);
						const cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
						const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
						const latitude = window.Cesium.Math.toDegrees(cartographic.latitude);
						const longitude = window.Cesium.Math.toDegrees(cartographic.longitude);
						const { height } = cartographic;
						callback &&
							callback({
								latitude,
								longitude,
								height
							});
					}
				},
				context
			);
		} else {
			map.off(tudou3d.EventType.click, callback, context);
		}
	}
	/** moveEnd监听 */
	moveEndEventListener(options: any = {}) {
		const { map, active = false, callback, context } = options;
		map.off(tudou3d.EventType.cameraMoveEnd, callback, context);
		if (active) {
			// eslint-disable-next-line
			map.on(tudou3d.EventType.cameraMoveEnd, callback, context);
		}
	}
	/**
	 *监控事件
	 * @param {*} options
	 */
	mapAddListener(options: any = {}) {
		const { type, active = false, callback } = options;
		if (active) {
			window.map.on(type, callback);
		} else {
			window.map.off(type, callback);
		}
	}
	/**
	 * 获取当前视口
	 * @param {*} options
	 */
	getExtent(options: any = {}) {
		const { map } = options;
		const viewerExtent = map.getExtent({
			formatNum: true
		});
		return viewerExtent;
	}
	/**
	 *
	 *是否添加右键菜单
	 * @param {*} [options={}]
	 * @memberof MapManage
	 */
	bindContextMenu(options: any = {}) {
		const { map, active = true } = options;
		if (!active) {
			map.unbindContextMenu();
		} else {
			const mapContextmenuItems = [
				{
					text: "透明度",
					callback() {
						const layers = map.getLayers();
						console.log("layers", layers);
					}
				},
				{
					text: "要素识别",
					callback() {
						const mpt = JSON.stringify(map.getCameraView());
						console.log(mpt);
					}
				}
			];
			map.bindContextMenu(mapContextmenuItems);
		}
	}
	/**
	 *下载图片
	 * @param {*} options
	 * @returns
	 */
	async expotMap(options: any = {}) {
		const { map } = options;
		// 从map对象里获取canvas
		const { canvas } = map;

		return new Promise(resolve => {
			canvas.toBlob((blob: BlobPart) => {
				// 以时间戳作为文件名 实时区分不同文件 按需求自己定义就好
				const filename = `${new Date().getTime()}.jpg`;
				// 转换canvas图片数据格式为formData
				const file = new File([blob], filename, { type: "image/jpg" });
				resolve({ file });
			});
		});
	}
}
