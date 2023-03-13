<template>
	<!-- 地图控件页面 -->
	<div class="absolute bottom-0px right-0px z-999">
		<div v-if="showMapControl" class="w-36px h-200px bg-#000 p-4px rd-lt-4px rd-lb-4px pb-0 absolute right--2px bottom-40px">
			<a-tooltip placement="left" v-for="item in controls" :key="item">
				<template #title> {{ item.title }} </template>
				<div
					class="w-28px h-28px rd-4px f-c-c p-2px float-left mb-4px cursor-pointer hover-bg-$pt-chart-peacockblue"
					@click="item.click"
				>
					<SvgIcon :name="item.ico" :icon-style="{ width: '24px', height: '24px', fill: 'currentColor' }" />
				</div>
			</a-tooltip>
		</div>
		<div v-if="showBaseMap" class="w-196px h-58px bg-#000 absolute bottom-40px right-38px p-2px rd-4px">
			<ul class="w-100% h-100%">
				<li
					v-for="(item, index) in basemaps"
					:key="index"
					@click="selectBaseMap(index)"
					class="list-none w-60px h-50px m-2px inline-block rd-4px relative cursor-pointer text-12px c-$pt-text-color-stair-dark"
				>
					<img :src="getAssetsFileByPath(item.url)" alt="" />
					<span
						:class="indexDefault == index ? ' bg-$pt-chart-peacockblue' : 'bg-$pt-text-color-third-light bg-opacity-44%'"
						class="w-100% absolute bottom-2px f-c-c"
						>{{ item.value }}</span
					>
				</li>
			</ul>
		</div>
		<div class="w-43px h-36px f-c-c mt-2px cursor-pointer">
			<a-tooltip placement="left">
				<template v-if="showMapControl" #title> 收起 </template>
				<template v-else #title> 点击展开 </template>
				<div class="w-100% h-100%" @click="showControl">
					<SvgIcon name="showcontrol-map" :icon-style="{ width: '43px', height: '36px', fill: 'currentColor' }" />
				</div>
			</a-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import SvgIcon from "@/components/SvgIcon/index.vue";
import { getAssetsFileByPath } from "@/utils/util";
let showMapControl = ref(false);
let showBaseMap = ref(false);
let indexDefault = ref(0);
const basemaps = ref([
	{ value: "高清影像", url: "@/assets/images/layer-img1.png" },
	{ value: "标准影像", url: "@/assets/images/layer-img2.png" },
	{ value: "地图", url: "@/assets/images/layer-img3.png" }
]);
const controls = ref([
	{ title: "复位", ico: "reset-map", click: flyToHome },
	{ title: "正北", ico: "north-map", click: faceNorth },
	{ title: "正视", ico: "face-map", click: lookDown },
	{ title: "放大", ico: "zoomin-map", click: zoomIn },
	{ title: "缩小", ico: "zoomout-map", click: zoomOut },
	{ title: "底图", ico: "base-map", click: showBase }
]);
// 复位
function flyToHome() {
	const { map, Cesium } = window;
	map.viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(108.43506, 33.61816, Cesium.defaultValue(805360, 20000000)),
		orientation: {
			pitch: Cesium.Math.toRadians(-90),
			heading: Cesium.Math.toRadians(360),
			roll: Cesium.Math.toRadians(0.0)
		},
		duration: 2
	});
}
//正北
function faceNorth() {
	const { Cesium } = window;
	const map = window.map;
	// const map = window[this.mapId];
	const cameraView = map.getCameraView();
	console.log("heading", cameraView.heading);
	// 当不为0的时候，说明不是正北方向
	if (cameraView.heading) {
		const { lng, lat, alt } = cameraView;
		const center = getMapCurrentPoint2();
		const extentCenterPoint = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
		const lookAtPoint = Cesium.Cartesian3.fromDegrees(center[0], center[1], alt);
		const distance = Cesium.Cartesian3.distance(extentCenterPoint, lookAtPoint);
		console.log("distance", distance);
		const resultPoint = window.tudou3d.PointUtil.getPositionByDirectionAndLen(lookAtPoint, 90, distance);
		const distance2 = Cesium.Cartesian3.distance(resultPoint, lookAtPoint);
		console.log("distance2", distance2);
		const cartographic = Cesium.Cartographic.fromCartesian(resultPoint);
		const longitude = Cesium.Math.toDegrees(cartographic.longitude);
		const latitude = Cesium.Math.toDegrees(cartographic.latitude);
		cameraView.lng = longitude;
		cameraView.lat = latitude;
		cameraView.heading = 0;
		map.setCameraView(cameraView);
	}
}
// 获取地图当前中心点
function getMapCurrentPoint2() {
	const { map, Cesium } = window;
	let centerResult = map.camera.pickEllipsoid(
		new Cesium.Cartesian2(map.viewer.canvas.clientWidth / 2, map.viewer.canvas.clientHeight / 2)
	);
	let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
	let curLongitude = (curPosition.longitude * 180) / Math.PI;
	let curLatitude = (curPosition.latitude * 180) / Math.PI;
	return [curLongitude, curLatitude];
}
//正视
function lookDown() {
	const { map, Cesium } = window;
	// const map = window[this.mapId];
	const cameraView = map.getCameraView();
	if (cameraView.pitch !== -90) {
		const { lng, lat, alt } = cameraView;
		const center = getMapCurrentPoint2();
		const extentCenterPoint = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
		const lookAtPoint = Cesium.Cartesian3.fromDegrees(center[0], center[1], alt);
		const distance = Cesium.Cartesian3.distance(extentCenterPoint, lookAtPoint);
		cameraView.lng = center[0];
		cameraView.lat = center[1];
		cameraView.pitch = -90;
		cameraView.roll = 0;
		cameraView.alt = distance;
		map.setCameraView(cameraView);
	}
}
//放大
function zoomIn() {
	const height = window.map.viewer.camera.positionCartographic.height / 10;
	window.map.viewer.camera.zoomIn(height);
}
//缩小
function zoomOut() {
	const height = window.map.viewer.camera.positionCartographic.height / 10;
	window.map.viewer.camera.zoomOut(height);
}
// 展示底图
function showBase() {
	showBaseMap.value = !showBaseMap.value;
}
//选择底图
function selectBaseMap(val: number) {
	// 通过设置basemap的id来切换底图，离线标准影像-4,离线地图-5
	indexDefault.value = val;
	const { map } = window;
	if (val !== 0) {
		map.basemap = val + 3;
	}
	showBaseMap.value = false;
}
//展示控件
function showControl() {
	showMapControl.value = !showMapControl.value;
	showBaseMap.value = false;
}
</script>
