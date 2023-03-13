import { onBeforeMount, reactive, ref } from "vue";
import { TreeProps } from "ant-design-vue";
import { DataNode } from "ant-design-vue/lib/vc-tree/interface";

import { getCatalogTree } from "@/api/modules/catalog";
import { mapCommon } from "@/components/Map/map3d/composables";
import mittBus from "@/utils/mittBus";
import { filterNullProp } from "@/utils/util";

export const useSearchTree = (registrationUnitCatalogCode: string, changeData: any) => {
	const { addLayer, setLayerOpacity, setLayerShow } = mapCommon();
	const fieldNames = reactive({
		title: "name",
		key: "code"
	});
	const searchValue = ref("");
	const loading = ref(false);
	const treeData = ref<TreeProps["treeData"]>([]);
	const reqCatalogTree = async () => {
		loading.value = true;
		try {
			const apiParams = {
				parentCode: registrationUnitCatalogCode,
				name: searchValue.value
			};
			const { data } = await getCatalogTree(filterNullProp(apiParams));
			const list = data ?? [];
			treeData.value = addTreeAttr(list);
		} finally {
			loading.value = false;
		}
	};

	//增加tree属性
	function addTreeAttr(tree: any) {
		tree.forEach((item: any) => {
			if (item.children) {
				addTreeAttr(item.children);
			} else {
				item.isShow = true; //显隐
				item.opacity = 100; //透明度
			}
			if (item.nodeType === "2" && !item.children) {
				//叶子节点  拼接code
				item.code = item.parentCode + "-" + item.code;
			}
		});
		return tree;
	}

	const onSearch = async () => {
		await reqCatalogTree();
	};

	const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
		console.log("selected", selectedKeys, info);
		if (selectedKeys.length > 0) {
			changeData(selectedKeys[0] as string, !("children" in info.selectedNodes[0]));
		} else {
			changeData(selectedKeys[0] as string, false);
		}
	};

	onBeforeMount(async () => {
		await onSearch();
	});

	//选中
	const checkedKeys = ref<string[]>([]);
	const checkedNodes = ref<DataNode[]>([]);
	let checkedTree: (number | string)[];
	let menuLayer: (number | string)[] = [];
	const onCheck: TreeProps["onCheck"] = async (checkedKeys, info) => {
		checkedNodes.value = info.checkedNodes.filter(item => {
			return !item.children;
		});
		checkedTree = checkedNodes.value.reduce((total: any, pre) => {
			total.push(pre.code);
			return total;
		}, []);
		console.log(menuLayer, checkedTree);
		// const url =
		// 	"http://10.1.3.125:38080/geoserver/potato-qqywpt/wms?service=WMS&version=1.1.0&request=GetMap&layers=potato-qqywpt%3Adjdy_2023&bbox=109.746524509%2C38.24663917%2C109.790238351%2C38.2921328780001&width=737&height=768&srs=EPSG%3A4326&format=application/openlayers";
		const url =
			"http://10.1.3.91/mapserver/vmap/tddltb2020qsejtq/getMAP?x={TileCol}&y={TileRow}&l={TileMatrix}&styleId=qsid&ratio=1&tilesize=512";
		await addLayer({ map: window.map, id: checkedTree[0], url, serviceType: "wvec", flyTo: true });
		mittBus.emit("openLegend", {
			map: window.map,
			id: checkedTree[0],
			url,
			position: "right"
		});
		// if (checkedTree.length >= menuLayer.length) {
		// 	checkedTree.forEach(objTress => {
		// 		if (menuLayer.indexOf(objTress) == -1) {
		// 			menuLayer.push(objTress);
		// 			console.log("add", objTress);
		// 		}
		// 	});
		// } else {
		// 	menuLayer.forEach(objLayer => {
		// 		if (checkedTree.indexOf(objLayer) == -1) {
		// 			menuLayer.splice(menuLayer.indexOf(objLayer), 1);
		// 			console.log("delte", objLayer);
		//			mittBus.emit('closeLegend') // 关闭图例
		// 		}
		// 	});
		// }
	};
	//显隐
	const onOpenEye = (info: DataNode, visible: boolean) => {
		changeVisible(treeData.value, info, visible);
		function changeVisible(tree: any, node: DataNode, visible: boolean) {
			for (const data of tree) {
				if (data.id === node.id) data.isShow = visible;
				if (data.children) changeVisible(data.children, node, visible);
			}
		}
		setLayerShow({ map: window.map, id: info.code, show: info.isShow });
	};

	//透明度
	const onChangeTransparent = (info: DataNode, val: number) => {
		changeTransparent(treeData.value, info, val);
		function changeTransparent(tree: any, node: DataNode, val: number) {
			for (const data of tree) {
				if (data.id === node.id) data.opacity = val;
				if (data.children) changeTransparent(data.children, node, val);
			}
		}
		setLayerOpacity({ map: window.map, id: info.code, alpha: info.opacity / 100 });
	};

	return {
		searchValue,
		onSearch,
		fieldNames,
		loading,
		treeData,
		onSelect,
		checkedKeys,
		onCheck,
		checkedNodes,
		onOpenEye,
		onChangeTransparent
	};
};
