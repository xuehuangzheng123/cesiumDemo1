<template>
	<a-tree-select
		v-if="treeData?.length"
		v-model:value="currentAreaCode"
		v-model:searchValue="searchValue"
		show-search
		:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
		placeholder="请选择行政区划"
		allow-clear
		tree-default-expand-all
		treeNodeFilterProp="name"
		:tree-data="treeData"
		:field-names="{
			children: 'children',
			label: 'name',
			value: 'id'
		}"
		:dropdownMatchSelectWidth="false"
		@change="change"
	>
		<template #title="{ name }">
			<template v-for="(fragment, i) in name.toString().split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))">
				<span class="color-$pt-primary-color-normal" v-if="fragment === searchValue" :key="i"> {{ fragment }} </span>
				<template v-else>{{ fragment }}</template>
			</template>
		</template>
	</a-tree-select>
</template>
<script setup lang="ts" name="SelectArea">
import { nextTick, onMounted, ref } from "vue";
import type { TreeSelectProps } from "ant-design-vue";
import axios from "axios";
import Qs from "qs";

import { getAreaServerApi, getAreaTreeDataApi } from "@/api/modules/map";

const emit = defineEmits<{
	(event: "change", value: string | number): void;
}>();

const currentAreaCode = ref<string>("610000");
const searchValue = ref("");
const treeData = ref<TreeSelectProps["treeData"]>([]);
const change = (value: string) => {
	// console.log("change:", value);
	if (window.map.getLayer("wmsLayer") !== undefined) {
		window.map.removeLayer(window.map.getLayer("wmsLayer"));
	}
	if (window.map.getLayer("geoJsonLayer") !== undefined) {
		window.map.removeLayer(window.map.getLayer("geoJsonLayer"));
	}
	if (value === "610000") {
		addWmsLayer(value);
	} else if (value) {
		addGeoJsonLayer(value);
	}
	emit("change", value);
};

const formatUrl = async () => {
	const { data: serviceData } = await getAreaServerApi({
		catalogCode: "xzq"
	});
	const urlArr = serviceData.url.split("?");
	const { layers } = Qs.parse(urlArr[1]);
	return {
		url: urlArr[0],
		layers
	};
};

const addWmsLayer = async (code: string) => {
	const { url, layers } = await formatUrl();
	const layer = new window.tudou3d.layer.WmsLayer({
		id: "wmsLayer",
		url,
		flyTo: true,
		crs: "EPSG:4326",
		getCapabilities: false,
		zIndex: 99,
		layers,
		bbox: [105.48711369684, 31.706752103327, 111.241909061154, 39.5852387150948],
		parameters: {
			transparent: "true",
			format: "image/png",
			tiled: true,
			cql_filter: "xzqdm=" + code
		}
	});
	window.map.addLayer(layer);
};

const addGeoJsonLayer = async (code: string) => {
	const { url, layers } = await formatUrl();
	let { data } = await axios.get(url.replace("wms", "wfs"), {
		params: {
			service: "wfs",
			request: "GetFeature",
			version: "1.1.0",
			typename: layers,
			outputFormat: "json",
			cql_filter: "xzqdm=" + code
		}
	});
	let geoJsonData = {
		type: "Feature",
		geometry: null
	};
	if (data) {
		geoJsonData.geometry = data.features[0]?.geometry ?? null;
	}
	if (!geoJsonData.geometry) return console.log("geometry数据为空");
	const layer = new window.tudou3d.layer.GeoJsonLayer({
		id: "geoJsonLayer",
		crs: "EPSG:4326",
		data: geoJsonData,
		flyTo: true,
		symbol: {
			styleOptions: {
				clampToGround: true,
				outline: true,
				outlineColor: "#00FFFF",
				outlineOpacity: 1,
				outlineWidth: 4,
				fill: false
			}
		}
	});
	window.map.addLayer(layer);
};

onMounted(() => {
	emit("change", currentAreaCode.value);
	getAreaTreeDataApi({ parentCode: 100000 }).then((res: any) => {
		if (res.data) {
			treeData.value = res.data;
			if (treeData.value?.length) {
				nextTick(() => {
					addWmsLayer(currentAreaCode.value);
				});
			}
		}
	});
});
</script>
<style scoped lang="less"></style>
