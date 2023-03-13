<template>
	<!-- mapServer图例 -->
	<div id="legend">
		<!-- <div
			class="absolute bottom-49px right-24px z-1 w-214px cursor-pointer bg-$light-header-bg-color b-1px b-$light-border-color rd-8px"
			v-if="viewState && mapId !== 'mapRightTopLegend'"
			:id="mapId"
			:layer="layerItem"
		>
			<div class="h-32px f-b-c">
				<p class="pl-10px text-14px font-400 c-$gray-7">图例</p>
				<div class="w-20px h-20px cursor-pointer opacity-100% f-c-c" @click="closeLegend">
					<SvgIcon name="close" :icon-style="{ width: '12px', height: '12px', fill: 'currentColor' }" />
				</div>
			</div>
			<ul>
				<li
					v-for="(element, index) in legendDatalist"
					:class="
						index === 0 || index === legendDatalist.length - 1
							? 'relative w-100% pb-11px text-14px font-400 c-$gray-7'
							: 'f-ic w-100% pt-8px text-14px font-400 c-$gray-7'
					"
					:key="element.text"
					@click="legendView(element)"
				>
					<div class="inline-block">
						<SvgIcon
							v-if="element.status"
							class="ml-12px"
							name="element.styles.backgroundImage"
							:icon-style="{ width: '12px', height: '12px', fill: 'currentColor' }"
						/>
						<SvgIcon
							v-else
							class="ml-12px"
							name="close-legend"
							:icon-style="{ width: '12px', height: '12px', fill: 'currentColor' }"
						/>
					</div>
					<span class="ml-8px">{{ element.text }}</span>
				</li>
			</ul>
		</div> -->

		<!-- legend-list 代表右边-->
		<div
			v-show="!minimize"
			class="absolute bottom-49px right-24px z-1 w-214px cursor-pointer bg-$pt-bg-card-color-normal rd-8px"
			:class="
				clickDiv
					? 'absolute left-24px bottom-49px z-1 w-214px rd-8px'
					: '' || legendDatalist.length > 13
					? 'h-426px z-1 w-214px'
					: ''
			"
			v-if="viewState && mapId !== 'mapRightTopLegend'"
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
					<div class="ml-12px inline-block w-20px h-20px">
						<img class="w-100% h-100% f-ic" v-if="element.status === true" :src="element.styles.backgroundImage" alt="" />
						<SvgIcon v-else name="close-legend" :icon-style="{ width: '20px', height: '20px', fill: 'currentColor' }" />
					</div>
					<span class="ml-8px">{{ element.text }}</span>
				</li>
			</ul>
		</div>

		<!-- 坡度坡向 -->
		<div
			v-show="!minimize"
			class="absolute bottom-49px right-24px z-1 w-214px cursor-pointer bg-$pt-bg-card-color-normal rd-8px"
			:class="
				clickDiv
					? 'absolute left-24px bottom-49px z-1 w-214px rd-8px'
					: '' || legendDatalist.length > 13
					? 'h-426px z-1 w-214px'
					: ''
			"
			v-if="mapId === 'mapRightTopLegend' && analysisViewState"
		>
			<div class="h-32px f-b-c">
				<p class="pl-10px text-16px font-400 c-$gray-7 mb-0px">图例</p>
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
					<div class="ml-12px inline-block w-20px h-20px">
						<img class="w-100% h-100% f-ic" v-if="element.status === true" :style="{ background: element.color }" alt="" />
						<SvgIcon v-else name="close-legend" :icon-style="{ width: '20px', height: '20px', fill: 'currentColor' }" />
					</div>
					<span class="ml-8px">{{ element.text }}</span>
				</li>
			</ul>
		</div>
		<!-- 折叠后模块 -->
		<div
			:class="clickDiv ? 'left-20px' : 'right-52px'"
			v-if="viewState || analysisViewState"
			v-show="minimize"
			class="absolute bottom-1px right-52px z-1 w-44px h-36px rd-tl-8px rd-bl-8px text-center overflow-hidden bg-i-@/assets/images/minimizeBac.png cursor-pointer"
			@click="foldLegend(false)"
		>
			<p class="text-14px font-400 c-#fff c-opacity-94% lh-36px">图例</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, toRefs, watch } from "vue";

import { mapCommon } from "@/components/Map/map3d/composables";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { Legend } from "@/map/map3d/Legend";
import { MapManage } from "@/map/map3d/MapManage";
import mittBus from "@/utils/mittBus";
const { addLayer, removeLayer } = mapCommon();
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
	color: string;
};
type analysisColorListType = {
	text: string;
	status: boolean;
	color: string;
};
let legend = new Legend() as any;
let mapManage = new MapManage();
let viewState = ref(false); // 图例显隐控制
let minimize = ref(false); // 图例折叠控制
let currentMap = ref<any>();
let clickDiv = ref(false);
let eyeShow = ref(true);
let analysisViewState = ref(false); // 坡度坡向图例显示控制变量
let legendDatalist = ref<Array<legendDataListType>>([]); // 全部图层地类
let analysisColorList = ref<Array<analysisColorListType>>([]);

// 没选择的地类
let uncheckedList = ref<any>([]);
let checkedList = ref<any>([]);
let styleId = ref("");
let serviceName = ref("");
let layerId = ref("");
let prevLevel = ref(-1);
let currentLayerId = ref("");
// let list = ref([]);
let currentOpacity = ref(1);
let halfSelect = ref(false);
// 赵西洋修改
let url = ref("");
let serviceType = ref("");
// 折叠位置
let minimizePosition = ref("right");
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

mittBus.on("closeLegend", () => {
	if (serviceType.value.toUpperCase() === "WVEC") {
		resetParams();
		if (currentMap.value) {
			moveEndEventListener(false);
		}
		mittBus.emit("legendViewState", false); // 添加图例
	}
});
mittBus.on("openLegend", (ele: any) => {
	minimize.value = false; // 默认展开不折叠
	eyeShow.value = true;
	resetParams();
	// 没有url啥都查不到
	if (ele.url) {
		// 获取serviceType
		serviceType.value = ele.url.indexOf("mapserver") > -1 ? "WVEC" : "WMS";
		if (serviceType.value.toUpperCase() === "WVEC") {
			openLegend(ele);
		}
	} else {
		// this.$store.commit("business/setIsFeatureInfo", false);
	}
});
// 外部筛选条件刷新
mittBus.on("updateLegend", ele => {
	if (serviceType.value.toUpperCase() === "WVEC") {
		updateLegend(ele);
	}
});
// 右侧面板打开图例折叠
mittBus.on("foldLegend", (ele: any) => {
	if (serviceType.value.toUpperCase() === "WVEC") {
		foldLegend(ele);
	}
});
// 兼容坡度坡向的图例
mittBus.on("analysisResultLegend", ele => {
	// 坡度坡向分析结果图例
	openSlopeLegend(ele);
	minimizePosition.value = "left";
});
let server: any = computed(() => {
	const { ogsServers, year: itselfYear } = layerItem.value || {};
	return (ogsServers || []).find((item: any) => item.year === (year.value || itselfYear));
});
watch(
	() => server,
	(val, oldval) => {
		// 先删除旧值，再添加新值。顺序不可颠倒
		if (oldval) {
			// this.legendDatalist = [];
			if (mapId.value !== "mapRightTopLegend" || source.value === "SplitScreen") {
				legendDatalist.value = [];
				viewState.value = false;
				// mittBus.emit("legendViewState", false); // 添加图例
			}
		}

		if (val && ["wvec"].includes(val.serviceType.toLowerCase())) {
			// 只有这两种类型存在图例
			if (mapId.value !== "mapRightTopLegend" || source.value === "SplitScreen") {
				resetParams();
				let splitMap = window[mapId.value.replace("Legend", "")];
				if (mapId.value.replace("Legend", "") === "mapRightTop") {
					// 主地图map
					splitMap = window.map;
				}
				// mittBus.emit("legendViewState", true); // 添加图例
				serviceType.value = "WVEC";
				openLegend({
					map: splitMap,
					id: val.id,
					url: val.url,
					show: true
				});
			}
		}
	}
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
		clickFun({ uncheckedList: legendDatalist.value, checkedList: [] });
		halfSelect.value = false;
	}
}
// function addLegend(item: any) {
// 	if (mapId.value === "mapRightTopLegend") {
// 		// 主屏图例-测试-start
// 		legendDatalist.value = [];
// 		if (serviceType.value.toUpperCase() === "WVEC") {
// 			viewState.value = true;
// 			uncheckedList.value = [];
// 			getLegend();
// 			moveEndEventListener();
// 			mittBus.emit("legendViewState", true); // 添加图例
// 			mittBus.emit("splitScreenState", true); // 分屏状态
// 			currentLayerId.value = item.id;
// 		}
// 		// 主屏图例-测试-end
// 	} else {
// 		currentLayerId.value = item.id;
// 		if (mapId.value !== "mapRightTopLegend") {
// 			legendDatalist.value = [];
// 		}
// 		if (serviceType.value.toUpperCase() === "WVEC") {
// 			viewState.value = true;
// 			uncheckedList.value = [];
// 			getLegend();
// 			moveEndEventListener();
// 			mittBus.emit("legendViewState", true); // 添加图例
// 			mittBus.emit("splitScreenState", true); // 分屏状态
// 			currentLayerId.value = item.id;
// 		}
// 	}
// }
// 获取sql条件
function getLegendSql(options: any) {
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
				sql = sql + " or" + queryStr;
			}
		}
	}
	return sql;
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
async function getLayerSQL(options: any) {
	const { checkedList, uncheckedList } = options;
	// 图例筛选sql
	const legendSQL = getLegendSql({ checkedList, uncheckedList });
	// 图层自带sql
	let layerSQL = layerOptions.value.userData.filterStr;
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
		let newSQL: string = "";
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
function clickFun(res: any) {
	const { uncheckedList: uList, checkedList: cList } = res;
	uncheckedList.value = uList;
	checkedList.value = cList;
	updataLayer({ checkedList: checkedList.value, uncheckedList: uncheckedList.value });
}
async function updataLayer(options: any = {}) {
	const { checkedList = [], uncheckedList = [] } = options;
	const { zIndex } = layerOptions.value;
	// 图例总开关显示是关闭的
	currentOpacity.value = getLayerOpacity({
		map: currentMap.value,
		id: currentLayerId.value
	});
	// }
	removeLayer({
		map: currentMap.value,
		id: currentLayerId.value
	});
	const sql = await getLayerSQL({ checkedList, uncheckedList });
	console.log("打印图例过滤条件", sql);
	addLayer({
		// 添加图层
		map: currentMap.value,
		id: currentLayerId.value,
		serviceType: serviceType.value,
		url: url.value,
		flyTo: false,
		alpha: currentOpacity.value,
		filterStr: sql,
		zIndex
	});
}
async function getLegend() {
	// const { url, styleId, serviceName, prevLevel } = this;
	const level = getCameraLevel({
		map: currentMap.value
	});
	if (url.value) {
		const res = await legend.getServerInfo({
			url: url.value,
			serviceName: serviceName.value
		});
		console.log("加载mapserver图例", res);
		// 更新图例
		legend
			.updateLegends({
				level,
				prevLevel: prevLevel.value,
				url: url.value,
				serviceName: serviceName.value,
				styleId: styleId.value
			})
			.then((legend: any) => {
				// prevLevel.value = level;
				const list = legendItemFilter({ legend }) || [];
				if (list.length === 0) {
					viewState.value = false;
				}
				legendDatalist.value = list; // 获取到图例数据
			});
	}
}
// 筛选图例显示的子项
function legendItemFilter(options: any) {
	const { legend } = options;
	// const { filterNames } = this;
	const list: any = [];
	legend.forEach((item: any) => {
		const { path, name, ico, query } = item;
		const legendItem = {
			text: name,
			// 判断当前状态是啥状态
			status: getLayerStatus(name),
			styles: {
				backgroundColor: "rgba(0,0,0,0)",
				backgroundImage: `${ico}`
			},
			textStyles: {
				cursor: "pointer"
			},
			selfData: { query }
		};
		if (filterNames.value.length > 0) {
			filterNames.value.forEach(name => {
				if (path.indexOf(name) > -1) {
					list.push(legendItem);
				}
			});
		} else {
			list.push(legendItem);
		}
	});
	return list;
}
// 鼠标滑动回调函数
function endEventBack() {
	const level = getCameraLevel({
		map: currentMap.value
	});
	if (prevLevel.value !== level.value) {
		getLegend();
	}
}
// 缩放地图更新图例
function moveEndEventListener(active: boolean = true) {
	mapManage.moveEndEventListener({
		map: currentMap.value,
		active,
		callback: endEventBack
	});
}
function legendView(element: legendDataListType) {
	const uncheckedList: any = [];
	const checkedList: any = [];
	// 单击某一个改变眼睛图片
	legendDatalist.value.forEach(item => {
		if (element.text === item.text) {
			item.status = !item.status;
		}
	});
	// 点击的没点击分别push进新数组
	legendDatalist.value.forEach(item => {
		if (item.status === true) {
			checkedList.push(item);
		} else if (item.status === false) {
			uncheckedList.push(item);
		}
	});
	clickFun({ uncheckedList, checkedList });
	// 手动单选控制全选
	if (checkedList.length > 0) {
		eyeShow.value = true;
	}
	if (uncheckedList.length === legendDatalist.value.length) {
		eyeShow.value = false;
	}
}
// async function closeLegend() {
// 	// const { serviceType, url, currentOpacity, currentMap, currentLayerId } = this;
// 	const { zIndex, userData } = layerOptions.value;
// 	viewState.value = false;
// 	currentOpacity.value = getLayerOpacity({
// 		map: currentMap.value,
// 		id: currentLayerId.value
// 	});
// 	removeLayer({
// 		map: currentMap.value,
// 		id: currentLayerId.value
// 	});

// 	checkedList.value = [];
// 	const sql = await getLayerSQL({
// 		checkedList: []
// 	});
// 	addLayer({
// 		// 添加图层
// 		map: currentMap.value,
// 		id: currentLayerId.value,
// 		zIndex,
// 		serviceType: serviceType.value,
// 		url: url.value,
// 		flyTo: false,
// 		// layer: "",
// 		alpha: currentOpacity.value,
// 		filterStr: sql,
// 		userData
// 	});
// }
// 重新拉取图例数据重置变量
function resetParams() {
	legendDatalist.value = [];
	analysisColorList.value = [];
	uncheckedList.value = [];
	currentLayerId.value = "";
	url.value = "";
	// 获取serviceType
	serviceType.value = "";
	viewState.value = false;
	// 坡度图例关闭
	analysisViewState.value = false;
	position.value = "right";
	filterNames.value = [];
	splitUserData.value = [];
	legendFilter.value = "";
}
// 获取图层的信息，保存下只获取一次
async function getLayerParams() {
	const data = await legend.getMapserverParams({
		url: url.value
	});
	styleId.value = data.styleId;
	layerId.value = data.layerId;
	serviceName.value = data.serviceName;
	layerOptions.value = JSON.parse(JSON.stringify(currentMap.value.getLayerById(currentLayerId.value)));
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

	await getLayerParams();
	await getLegend();
	moveEndEventListener();
	mittBus.emit("legendViewState", true);
}
// 更新外部筛选条件
async function updateLegend(options: any) {
	const { id, legendFilter: lFilter, splitUserData: sData = [], show } = options;
	if (id && legendFilter) {
		currentLayerId.value = id;
		legendFilter.value = lFilter;
		splitUserData.value = sData;
		updataLayer({ checkedList: checkedList.value, uncheckedList: uncheckedList.value });
	}
	if (typeof show === "boolean") {
		viewState.value = show;
	}
}
// 坡度坡向特殊图例
function openSlopeLegend(options: any) {
	clickDiv.value = true;
	const { coloList, map } = options;
	analysisViewState.value = true;
	currentMap.value = map;
	coloList.map((item: any) => {
		item.status = true;
		item.color = `rgba(${item.rgbValue},1)`;
		item.text = item.minValue + "-" + item.maxValue;
	});
	analysisColorList.value = coloList;
	serviceType.value = "wvec";
}
// 折叠面板
function foldLegend(options: boolean) {
	minimize.value = options;
}
function getCameraLevel(options: any) {
	const { map } = options;
	const level = map.viewer.scene.camera.getLevel();
	return level;
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
