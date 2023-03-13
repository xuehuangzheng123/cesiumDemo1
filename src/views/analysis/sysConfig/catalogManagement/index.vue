<template>
	<div class="catalog-management h100% overflow-hidden">
		<Map3d class="map3d" :mapId="mapId"></Map3d>
		<div v-loading="loading" class="w-327px min-h-300 bg-#fff mr-12 b-rd-4 search-tree absolute top-16px left-16px">
			<SearchTree
				v-model:search-value="searchValue"
				v-model:checked-keys="checkedKeys"
				:tree-data="treeData"
				:field-names="fieldNames"
				:checkable="true"
				:treeHasEye="true"
				:tree-has-config="true"
				placeholder="请输入编目名称 "
				@search="onSearch"
				@select="onSelect"
				@check="onCheck"
				@open-eye="onOpenEye"
				@change-transparent="onChangeTransparent"
			/>
		</div>
		<SetAttr />
	</div>
</template>
<script setup lang="tsx" name="catalogManagement">
import { reactive, ref } from "vue";

import Map3d from "@/components/Map/map3d/index.vue";
import SearchTree from "@/components/SearchTree/index.vue";

import { useSearchTree } from "./data/useSearchTree";

import SetAttr from "../../components/setAttr/index.vue";

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
.catalog-management {
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
