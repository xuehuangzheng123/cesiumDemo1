import { onBeforeMount, reactive, ref } from "vue";
import { TreeProps } from "ant-design-vue";
import { DataNode } from "ant-design-vue/lib/vc-tree/interface";

import { getCatalogTree } from "@/api/modules/catalog";
import { getAreaServerApi } from "@/api/modules/map";
import { mapCommon } from "@/components/Map/map3d/composables";
import mittBus from "@/utils/mittBus";
import { filterNullProp } from "@/utils/util";

export const useSearchTree = (registrationUnitCatalogCode: string, changeData: any) => {
	const { setLayerOpacity, setLayerShow, addLayer, removeLayer } = mapCommon();
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

			console.log(treeData.value, "treeData.value");
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
			// changeData(selectedKeys[0] as string, !("children" in info.selectedNodes[0]));
			changeData(info.node.code, !("children" in info.selectedNodes[0]));
		} else {
			// changeData(selectedKeys[0] as string, false);
			changeData(info.node.code, false);
		}
	};

	onBeforeMount(async () => {
		await onSearch();
	});

	//选中
	const checkedKeys = ref<string[]>([]);
	const checkedNodes = ref<DataNode[]>([]);
	let checkedTree: string[];
	let menuLayer: string[] = [];
	const onCheck: TreeProps["onCheck"] = async (checkedKeys, info) => {
		checkedNodes.value = info.checkedNodes.filter(item => {
			return !item.children;
		});
		checkedTree = checkedNodes.value.reduce((total: any, pre) => {
			total.push(pre.code);
			return total;
		}, []);
		layerChange();
	};
	// 记录图层增删
	const layerChange = async () => {
		if (checkedTree.length > menuLayer.length) {
			for (let addId of checkedTree) {
				if (menuLayer.indexOf(addId) == -1) {
					console.log("add", addId);
					await menusLayer(addId);
				}
			}
		} else {
			menuLayer.forEach(delId => {
				if (checkedTree.indexOf(delId) == -1) {
					console.log("delte", delId);
					removeLayer({ map: window.map, id: delId });
				}
			});
		}
		menuLayer = JSON.parse(JSON.stringify(checkedTree));
		console.log(menuLayer, checkedTree);
		if (menuLayer.length === 0) {
			mittBus.emit("closeLegend");
		} else {
			const id = menuLayer[menuLayer.length - 1];
			const url = window.map.getLayerById(id).options.userData.orginalUrl;
			mittBus.emit("openLegend", {
				map: window.map,
				id,
				url,
				show: true,
				position: "right"
			});
		}
	};
	const menusLayer = async (addId: string) => {
		const params = {
			catalogCode: addId.split("-")[0],
			year: addId.split("-")[1]
		};
		await getAreaServerApi(params).then(res => {
			addLayer({ map: window.map, id: addId, url: res.data.url, serviceType: "wms", flyTo: true });
		});
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
