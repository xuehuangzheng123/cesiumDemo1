<template>
	<!-- geoserver图例 -->
	<div id="geoserver-legend">
		<!-- <div
			class="absolute bottom-49px right-24px z-1 w-214px cursor-pointer bg-#fff rd-8px rd-8px"
			v-if="viewState && mapId !== 'mapRightTop'"
		> -->
		<!-- <div class="h-32px f-b-c bg-$pt-bg-card-color-normal rd-8px">
				<p class="pl-10px text-14px font-400 c-$gray-7 f-c-c">图例</p>
				<div class="w-20px h-20px cursor-pointer opacity-100% f-c-c" @click="closeLegend">
					<SvgIcon name="close" :icon-style="{ width: '12px', height: '12px', fill: 'currentColor' }" />
				</div>
			</div>
			<ul>
				<li
					v-for="(element, index) in legendDatalist"
					class="f-ic w-100% pt-8px text-14px font-400 c-$gray-7"
					:class="
						index === 0 || index === legendDatalist.length - 1
							? 'relative w-100% pb-11px text-14px font-400 c-$gray-7'
							: 'f-ic w-100% pt-8px text-14px font-400 c-$gray-7'
					"
					:key="element.text"
					@click="legendView(element)"
				>
					<span v-if="element.status === true" :style="element.styles" />
					<SvgIcon
						v-else
						class="ml-12px inline-block"
						name="close-legend"
						:icon-style="{ width: '12px', height: '12px', fill: 'currentColor' }"
					/>
					<span class="ml-8px">{{ element.text }}</span>
				</li>
			</ul>
		</div> -->
		<div
			class="absolute bottom-49px right-24px z-1 w-214px cursor-pointer bg-$pt-bg-card-color-normal rd-8px"
			v-show="!minimize"
			:class="
				clickDiv
					? 'absolute left-24px bottom-49px z-1 w-214px rd-8px'
					: '' || legendDatalist.length > 13
					? 'h-426px z-1 w-214px'
					: ''
			"
			v-if="viewState && mapId !== 'mapRightTop'"
		>
			<div class="h-32px f-b-c">
				<p class="pl-10px text-16px font-400 c-$gray-7 mb-0px">图例</p>
				<div class="m-y-0px m-x-11px">
					<!-- 眼睛 -->
					<img
						class="opacity-100% w-20px h-20px mr-16px"
						src="@/assets/images/eyeYes.png"
						width="12px"
						height="12px"
						alt=""
						v-show="eyeShow"
						@click="onChange"
					/>
					<img
						class="opacity-100% w-20px h-20px mr-16px"
						src="@/assets/images/eyeNo.png"
						width="12px"
						height="12px"
						alt=""
						v-show="!eyeShow"
						@click="onChange"
					/>
					<!-- 收起 -->
					<img
						class="w-20px h-20px cursor-pointer opacity-100%"
						src="@/assets/images/minimize.png"
						width="12px"
						height="12px"
						alt=""
						@click="foldLegend(true)"
					/>
				</div>
			</div>
			<ul
				class="m-0px rd-bl-8px rd-br-8px"
				:class="
					legendDatalist.length > 13
						? 'h-[calc(425px-32px)] overflow-y-auto'
						: 'bg-#fff' && legendDatalist.length > 0
						? 'p-y-7px bg-#fff'
						: '!h-0px'
				"
			>
				<li
					v-for="element in legendDatalist"
					class="f-ic w-100% p-y-4px text-16px font-400 c-$gray-7"
					:key="element.text"
					@click="legendView(element)"
				>
					<img v-if="element.status === true" class="ml-12px inline-block !w-16px !h-16px" :style="element.styles" alt="" />
					<SvgIcon
						v-else
						class="ml-12px inline-block"
						name="close-legend"
						:icon-style="{ width: '16px', height: '16px', fill: 'currentColor' }"
					/>
					<span class="ml-8px">{{ element.text }}</span>
				</li>
			</ul>
		</div>
		<!-- 折叠后模块 -->
		<div
			:class="clickDiv ? 'left-20px' : 'right-52px'"
			v-if="viewState"
			v-show="minimize"
			class="absolute bottom-1px right-52px z-1 w-44px h-36px rd-tl-8px rd-bl-8px text-center overflow-hidden bg-i-@/assets/images/minimizeBac.png cursor-pointer"
			@click="foldLegend(false)"
		>
			<p class="text-14px font-400 c-#fff c-opacity-94% lh-36px">图例</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import axios from "axios";

import { mapCommon } from "@/components/Map/map3d/composables";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { LayerManage } from "@/map/map3d/LayerManage";
import mittBus from "@/utils/mittBus";
const { addLayer, removeLayer } = mapCommon();
let minimize = ref(false); // 图例折叠控制
mittBus.on("updateLegend", ele => {
	if (serviceType.value.toUpperCase() === "WMS") {
		updateLegend(ele);
	}
});
// 右侧面板打开图例折叠
mittBus.on("foldLegend", (ele: any) => {
	if (serviceType.value.toUpperCase() === "WMS") {
		foldLegend(ele);
	}
});
mittBus.on("openLegend", (ele: any) => {
	minimize.value = false; // 默认展开不折叠
	console.log(ele);
	resetParams();
	// 没有url啥都查不到
	if (ele.url) {
		// 获取serviceType
		serviceType.value = ele.url.indexOf("geoserver") > -1 ? "WMS" : "WVEC";
		if (serviceType.value.toUpperCase() === "WMS") {
			openLegend(ele);
		}
	} else {
		// this.$store.commit("business/setIsFeatureInfo", false);
	}
});
const layerM: any = new LayerManage();
const props = defineProps({
	mapId: {
		type: String,
		required: true
	},
	layerItem: {
		type: Object,
		default: null
	},
	year: {
		type: [String, Number],
		default: ""
	},
	source: {
		type: String,
		default: ""
	}
});
const { mapId, layerItem, year, source } = toRefs(props);
type legendDataListType = {
	text: string;
	status: boolean;
	styles: any;
};
type analysisColorList = {
	text: string;
	status: boolean;
	color: string;
};
// let legend = new Legend() as any;
// let mapManage = new MapManage();
let viewState = ref(false); // 图例显隐控制

let currentMap = ref<any>();
let clickDiv = ref(false);
let eyeShow = ref(true);
// let analysisViewState = ref(false); // 坡度坡向图例显示控制变量
let legendDatalist = ref<Array<legendDataListType>>([]); // 全部图层地类
let analysisColorList = ref<Array<analysisColorList>>([]);

// 没选择的地类
let uncheckedList = ref<any>([]);
let checkedList = ref<any>([]);
// let styleId = ref("");
// let serviceName = ref("");
// let layerId = ref("");
// let prevLevel = ref(-1);
let currentLayerId = ref("");
// let list = ref([]);
let currentOpacity = ref(1);
let halfSelect = ref(false);
// 赵西洋修改
let url = ref("");
let serviceType = ref("");
// 折叠位置
// let minimizePosition = ref("right");
// 默认图例在右侧
let position = ref("right");
// 筛选地类名称数组
let filterNames = ref([]);
// userData中不需要图例是使用的筛选条件（目前只有年度信息使用）
let splitUserData = ref([]);
// 更新图例筛选条件
let legendFilter = ref("");
// 图例打开时保存图层原始信息
let layerOptions = ref<any>({});
let legendJson = ref<any>({});
mittBus.on("closeLegend", () => {
	if (serviceType.value.toUpperCase() === "WMS") {
		resetParams();
		mittBus.emit("legendViewState", false); // 添加图例
	}
});

let server: any = computed(() => {
	const { ogsServers, year: itselfYear } = layerItem.value || {};
	return (ogsServers || []).find((item: any) => item.year === (year.value || itselfYear));
});
watch(
	() => legendJson.value,
	(nValue: any) => {
		if (Object.keys(nValue).length > 0) {
			addLegend(nValue);
		}
	},
	{ immediate: true }
);
watch(
	() => server.value,
	(val, oldval) => {
		// 先删除旧值，再添加新值。顺序不可颠倒
		if (oldval) {
			// this.legendDatalist = [];
			if (mapId.value !== "mapRightTopLegend" || source.value === "SplitScreen") {
				legendDatalist.value = [];
				viewState.value = false;
				mittBus.emit("legendViewState", false); // 添加图例
			}
		}

		if (val && ["wms"].includes(val.serviceType.toLowerCase())) {
			// 只有这两种类型存在图例
			if (mapId.value !== "mapRightTop" || source.value === "SplitScreen") {
				resetParams();
				let splitMap = window[mapId.value];
				if (mapId.value === "mapRightTop") {
					// 主地图map
					splitMap = window.map;
				}
				mittBus.emit("legendViewState", true); // 添加图例
				currentLayerId.value = val.id;
				serviceType.value = "WMS";
				openLegend({
					map: splitMap,
					id: val.id,
					url: val.url,
					show: true
				});
			}
		}
	},
	{ immediate: true }
);
function onChange() {
	eyeShow.value = !eyeShow.value;
	// 先获取图层数据，否则会删除
	if (eyeShow.value) {
		legendDatalist.value.forEach(item => {
			item.status = true;
		});
		clickFun({ uncheckedList: [], checkedList: legendDatalist.value });
	} else {
		legendDatalist.value.forEach(item => {
			item.status = false;
		});
		// this.selectLayer([], this.legendDatalist);
		clickFun({ uncheckedList: legendDatalist.value, checkedList: [] });
		halfSelect.value = false;
	}
}
// 筛选图例显示的子项
function legendItemFilter(options: any) {
	const { legend } = options;
	// const { filterNames } = this;
	const list: any[] = [];
	if (legend.length > 0) {
		legend.forEach((item: any) => {
			if (filterNames.value.length > 0) {
				filterNames.value.forEach(name => {
					if (item.title.indexOf(name) > -1) {
						list.push(item);
					}
				});
			} else {
				list.push(item);
			}
		});
	}
	return list;
}
function addLegend(item: any) {
	const list = legendItemFilter({ legend: item.rules });
	getLegend(list);
}
// 获取当前图例的状态
function getLayerStatus(text: string) {
	for (let index = 0; index < uncheckedList.value.length; index++) {
		const layer = uncheckedList.value[index];
		// 如果位未选中的图层
		if (text === layer.text) {
			return false;
		}
	}
	// 如果为选中的图层
	return true;
}
function addLayerType(options: any) {
	// const { url, serviceType, currentLayerId, currentMap } = this;
	const { filterStr } = options;
	// 延庆
	if (options.name === "wfs") {
		if (options.parameters.cql_filter) {
			options.url = options.url + options.parameters.cql_filter;
		}
		layerM.addGeojsonLayer({
			...options,
			// 添加图层
			map: currentMap.value,
			flyTo: false
		});
		return;
	}
	addLayer({
		map: currentMap.value,
		id: currentLayerId.value,
		alpha: currentOpacity.value,
		flyTo: false,
		url: url.value,
		serviceType: serviceType.value,
		filterStr
		// 添加图层
	});
}
function clickFun(res: any) {
	uncheckedList.value = res.uncheckedList;
	checkedList.value = res.checkedList;
	updataLayer();
}
async function updataLayer() {
	// 图例总开关显示是关闭的
	currentOpacity.value = getLayerOpacity({
		map: currentMap.value,
		id: currentLayerId.value
	});
	removeLayer({
		map: currentMap.value,
		id: currentLayerId.value
	});

	const sql = await getLayerSQL({ checkedList: checkedList.value, uncheckedList: uncheckedList.value });
	addLayerType({
		filterStr: sql
	});
}
function getLegend(legend: any) {
	const list: any[] = [];
	legend.forEach((item: any) => {
		if (item.title) {
			let border = "rgba(255,255,255,0)";
			let backgroundColor = "rgba(255,255,255,0)";
			item.symbolizers.forEach((symbolizer: any) => {
				const { Line, Polygon } = symbolizer;
				if (Polygon && Polygon.fill) {
					backgroundColor = Polygon.fill;
				} else if (Line && Line.stroke) {
					border = `1px solid ${Line.stroke}`;
				}
			});

			list.push({
				text: item.title,
				// 判断当前状态是啥状态
				status: getLayerStatus(item.title),
				styles: {
					//    border: 1px solid rgb(0 0 255);
					backgroundColor,
					border,
					width: "12px",
					height: "12px",
					display: "inline-block",
					backgroundImage: item.symbolizers[0].Point ? `url(${item.symbolizers[0].Point.url})` : null,
					backgroundSize: "100% 100%"
				},
				textStyles: {
					cursor: "pointer"
				},
				selfData: {
					query: item.filter ? item.filter.replaceAll("\[", "").replaceAll("\]", "") : null
				}
			});
		}
	});
	legendDatalist.value = list; // 获取到图例数据
}
// 鼠标滑动回调函数
function legendView(element: legendDataListType) {
	console.log(element);
	const uncheckedList: any[] = [];
	const checkedList: any[] = [];
	legendDatalist.value.forEach(item => {
		if (element.text === item.text) {
			item.status = !item.status;
		}
	});
	legendDatalist.value.forEach(item => {
		if (item.status === true) {
			checkedList.push(item);
		} else if (item.status === false) {
			uncheckedList.push(item);
		}
	});
	// if (uncheckedList.length > 0) {
	//   switchChecked.value = false;
	// } else {
	//   this.switchChecked = true;
	// }
	if (checkedList.length > 0 && uncheckedList.length > 0) {
		halfSelect.value = true;
	} else {
		halfSelect.value = false;
	}
	clickFun({ uncheckedList, checkedList });
}
// async function closeLegend() {
// 	viewState.value = false;
// 	currentOpacity.value = getLayerOpacity({
// 		map: currentMap.value,
// 		id: currentLayerId.value
// 	});
// 	removeLayer({
// 		map: currentMap.value,
// 		id: currentLayerId.value
// 	});
// 	layerOptions.value.options.alpha = currentOpacity.value;
// 	checkedList.value = [];
// 	const sql = await getLayerSQL({
// 		checkedList: []
// 	});
// 	addLayerType({ filterStr: sql });
// }
function getLegendJson() {
	const { url, wmsUrl, layers, name, parameters = {} } = layerOptions.value.options;
	if (name === "wms") {
		getLegends({
			baseUrl: url,
			layer: layers,
			style: parameters.styles || parameters.styles,
			serviceType: name
		}).then((res: any) => {
			const { data } = res;
			if (data.Legend) {
				legendJson.value = data.Legend[0];
				if (legendJson.value.length === 0) {
					viewState.value = false;
				}
			}
		});
	}
	if (name === "wfs") {
		getLegends({
			baseUrl: wmsUrl,
			layer: layers,
			style: parameters.styles || parameters.styles,
			serviceType: "wms"
		}).then((res: any) => {
			const { data } = res;
			legendJson.value = data.Legend[0];
			if (legendJson.value.length === 0) {
				viewState.value = false;
			}
		});
	}
}
function normalizeSQL(sql: string) {
	if (!sql) return sql;
	const newSql = sql.split(" ");
	// 获取非空数组
	if (newSql.length) {
		let tempSql = "";
		for (let i = newSql.length - 1; i >= 0; i--) {
			const ns = newSql[i];
			if (!ns) continue;
			if (ns.trim().toUpperCase() === "AND" || ns.trim().toUpperCase() === "OR") {
				if (i === newSql.length - 1) {
					tempSql = newSql.slice(0, i).join(" ");
					return tempSql;
				}
				const tempSql1 = newSql.slice(i + 1, newSql.length).join("");
				if (tempSql1 && tempSql1.trim() === "") {
					tempSql = newSql.slice(0, i).join(" ");
					return tempSql;
				}
				return sql;
			}
		}
		return sql;
	}
	return sql;
}
// 获取最终的sql
// 所有sql处理逻辑都在这里处理
async function getLayerSQL(options: any) {
	const { checkedList, uncheckedList } = options;
	// const { legendFilter, splitUserData } = this;
	// 图例筛选sql
	const legendSQL = getLegendSql({ checkedList, uncheckedList });
	// 图层自带sql
	let layerSQL = layerOptions.value.options.userData.filterStr;
	if (layerSQL && splitUserData.value.length > 0) {
		// 去掉重复字段
		const removeIndexs: number[] = [];
		const layerSQLs = layerSQL.split(" ");
		splitUserData.value.forEach(item => {
			layerSQLs.forEach((item2: string, index2: number) => {
				if (item2.includes(item)) {
					removeIndexs.push(index2);
				}
			});
		});
		let newSQL = "";
		layerSQLs.forEach((item: string, index: number) => {
			if (!removeIndexs.includes(index) && item.indexOf("=") > -1) {
				if (newSQL) {
					newSQL = newSQL + " and " + item;
				} else {
					newSQL = item;
				}
			}
		});
		layerSQL = newSQL;
	}
	let resultSQL = null;
	if (legendSQL) {
		// 当存在or的时候才加括号
		resultSQL = legendSQL.toLowerCase().indexOf("or") > -1 ? `(${legendSQL})` : legendSQL;
	}
	if (resultSQL && layerSQL) {
		resultSQL = resultSQL + ` and ${layerSQL}`;
	} else if (layerSQL) {
		resultSQL = layerSQL;
	}
	// 外部传入的筛选条件
	if (resultSQL && legendFilter.value) {
		// 当存在or的时候才加括号
		const legendFilterSQL = legendFilter.value.toLowerCase().indexOf("or") > -1 ? `(${legendFilter.value})` : legendFilter.value;
		resultSQL = resultSQL + ` and ${legendFilterSQL}`;
	} else if (legendFilter.value) {
		resultSQL = legendFilter.value;
	}
	return resultSQL;
}
// 获取sql条件
function getLegendSql(options: any = {}) {
	const { checkedList = [], uncheckedList = [] } = options;
	// 当图例没有筛选时，就是不需要筛选条件
	let sql = "";
	// 图例全部关闭的情况
	if (checkedList.length === 0 && uncheckedList.length > 0) {
		sql = "false";
	} else if (checkedList.length > 0 && uncheckedList.length > 0) {
		// 当存在筛选时
		for (let index = 0; index < checkedList.length; index++) {
			const item = checkedList[index];
			if (sql === "") {
				sql = normalizeSQL(item.selfData.query);
			} else {
				const queryStr = normalizeSQL(item.selfData.query);
				sql = sql + " or " + queryStr;
			}
		}
	}
	return sql;
}
// 打开图例处理
async function openLegend(options: any = {}) {
	const { map, id, show = true, filterNames: fNames = [], splitUserData: sData = [], position: pos } = options;
	currentMap.value = map;
	viewState.value = show;
	currentLayerId.value = id;
	splitUserData.value = sData;
	filterNames.value = fNames;
	position.value = pos;
	// 这里判断图例现在左边还是右边
	if (position.value === "right") {
		clickDiv.value = false;
	} else {
		clickDiv.value = true;
	}
	url.value = options.url;

	layerOptions.value = currentMap.value.getLayerById(currentLayerId.value);
	// url.value += `?service=wms&layers=${layerOptions.value.options.layers}&bbox=${layerOptions.value.options.bbox}`;
	await getLegendJson();
	// mittBus.emit("legendViewState", true);
}
// 重新拉取图例数据重置变量
function resetParams() {
	legendDatalist.value = [];
	uncheckedList.value = [];
	currentLayerId.value = "";
	url.value = "";
	// 获取serviceType
	serviceType.value = "";
	viewState.value = false;
	position.value = "right";
	filterNames.value = [];
	splitUserData.value = [];
	legendFilter.value = "";
}
// 折叠面板
function foldLegend(options: boolean) {
	minimize.value = options;
}
// 更新外部筛选条件
async function updateLegend(options: any) {
	const { id, legendFilter: lFilter, splitUserData: sData = [], show } = options;
	if (id && legendFilter) {
		currentLayerId.value = id;
		legendFilter.value = lFilter;
		splitUserData.value = sData;
		updataLayer();
	}
	if (typeof show === "boolean") {
		viewState.value = show;
	}
}
function getLayerOpacity(options: any = {}) {
	const { map, id } = options;
	const layer = map.getLayerById(id);
	if (layer) {
		return layer.opacity;
	}
	console.log(`id为${id}图层未找到`);

	return 1;
}
function getLegends(options: any) {
	const { baseUrl } = options;
	const params = Object.assign(options, {
		request: "GetLegendGraphic",
		version: "1.0.0",
		format: "application/json"
	});
	return axios.get(baseUrl, { params });
}
onMounted(() => {});
onUnmounted(() => {
	mittBus.off("closeLegend");
	mittBus.off("openLegend");
	mittBus.off("updateLegend");
	mittBus.off("foldLegend");
	mittBus.off("analysisResultLegend");
});
</script>

<!-- <style lang="scss">
#legend {
	.ant-switch-small::after {
		width: 9px;
		height: 9px;
	}

	.ant-switch {
		background-color: #6d7a90;
	}

	.ant-switch-checked {
		background-color: #58a3ff;
	}
}
</style> -->
