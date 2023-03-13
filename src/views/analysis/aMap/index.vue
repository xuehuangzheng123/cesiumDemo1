<template>
	<div class="a-map h100% overflow-hidden">
		<Map3d class="map3d" :mapId="mapId"></Map3d>
		<div v-loading="loading" class="w-327px min-h-300 bg-#fff mr-12 b-rd-4 search-tree absolute top-16px left-16px">
			<SearchTree
				v-model:search-value="searchValue"
				v-model:checked-keys="checkedKeys"
				:tree-data="treeData"
				:field-names="fieldNames"
				:tree-has-action="false"
				:checkable="true"
				:treeHasEye="true"
				placeholder="请输入编目名称 "
				@search="onSearch"
				@select="onSelect"
				@check="onCheck"
				@open-eye="onOpenEye"
				@change-transparent="onChangeTransparent"
			/>
		</div>
		<SetStyles :code="catalogInfo.tableName" />
		<MapControl />
		<Legend mapId="mapLeftTopLegend" :year="2020" :source="''"> </Legend>
		<!-- geoserver图例 -->
		<GeoserverLegend mapId="mapLeftTop" :year="2020" :source="''"></GeoserverLegend>
		<SelectArea class="top-16px right-16px absolute w300"></SelectArea>
	</div>
</template>

<script setup lang="tsx" name="aMap">
import { reactive, ref } from "vue";

import Map3d from "@/components/Map/map3d/index.vue";
// import mittBus from "@/utils/mittBus";
import MapControl from "@/components/Map/map3d/mapControl.vue";
import SelectArea from "@/components/Map/map3d/selectArea.vue";
import SearchTree from "@/components/SearchTree/index.vue";
import GeoserverLegend from "@/views/analysis/components/map/Legend/legend/geoserverLegend.vue";
import Legend from "@/views/analysis/components/map/Legend/legend/index.vue";

import { useSearchTree } from "./data/useSearchTree";

import SetStyles from "../components/SetStyles/index.vue";

// zhfxxt dj
const registrationUnitCatalogCode = "zhfxxt";
let catalogInfo = reactive({
	tableName: "",
	isLeaf: true // true 代表是叶子节点，可以请求数据
});
const changeData = (tbName: string, isLeaf: boolean) => {
	catalogInfo.tableName = tbName;
	catalogInfo.isLeaf = isLeaf;
	console.log("点击数据：", tbName);
};
const mapId = ref("mapLeftTop");
const { loading, searchValue, onSearch, fieldNames, treeData, onSelect, checkedKeys, onCheck, onOpenEye, onChangeTransparent } =
	useSearchTree(registrationUnitCatalogCode, changeData);
</script>
<style scoped lang="less">
.a-map {
	position: relative;
	.search-tree {
		:deep(.pt-tree) {
			z-index: 10;
		}
	}
}
.map3d {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 0;
}
</style>
