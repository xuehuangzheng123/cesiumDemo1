<template>
	<div class="pt-main-right pt28px pr20px" :class="{ 'pt-main-right--unfold': unfold }">
		<div v-show="!unfold" class="pt-card-list ml20px">
			<div class="pt-card">
				<div class="pt-card-header">
					<span class="pt-name">业务审核</span>
					<span class="pt-actions"> </span>
				</div>

				<div class="pt-card-body flex items-center">
					<div class="h100% flex-1" ref="auditChartRef"></div>
					<div class="pt-card-info h100% flex-1 flex flex-col">
						<div v-for="(val, key) in chunk(auditLegend.list, 2)" class="flex pt-legend-item-outer" :key="`lio_${key}`">
							<div
								v-for="(item, index) in val"
								class="w-60px cursor-pointer ml40px"
								:class="{ 'opacity-80': item.selected }"
								:key="`lii_${index}`"
								@click="onToggleLegend(item, auditLegend.list, 'audit')"
							>
								<div class="border-l-2px pl12px" :style="{ borderColor: item.color }">
									<div class="pt-legend-label sle" :title="dTitle(item.name, 3)">{{ item.name }}</div>
									<div class="pt-legend-num sle" :title="dTitle(item.value, 4)">{{ item.value }}</div>
								</div>

								<div class="pt-legend-percent">{{ item.percent }}%</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-card">
				<div class="pt-card-header">
					<span class="pt-name">确权统计</span>
					<span class="pt-actions">
						<a-tabs v-model:activeKey="tabs.value" class="h100%" :tabBarGutter="20">
							<a-tab-pane v-for="item in tabs.list" :key="item.key" :tab="item.label"></a-tab-pane>
						</a-tabs>
					</span>
				</div>
				<div class="pt-card-body flex items-center">
					<div class="h100% flex-1" ref="statChartRef"></div>
					<div class="pt-card-info h100% flex-1 flex flex-col">
						<div v-for="(val, key) in chunk(statLegend.list, 2)" class="flex pt-legend-item-outer1" :key="`lio_${key}`">
							<div
								v-for="(item, index) in val"
								class="flex-1 cursor-pointer ml26px"
								:class="{ 'opacity-80': item.selected }"
								:key="`lii_${index}`"
								@click="onToggleLegend(item, statLegend.list, 'stat')"
							>
								<div class="flex items-center">
									<span class="inline-block w8px h8px rounded-50% mr8px" :style="{ backgroundColor: item.color }" />
									<div class="pt-legend-label sle w50px text-12px" :title="dTitle(item.name, 4)">{{ item.name }}</div>
								</div>

								<div class="pt-legend-num sle w50px text-16px ml16px" :title="dTitle(item.value, 4)">{{ item.value }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-card">
				<div class="pt-card-header">
					<span class="pt-name">资金拨付</span>
					<span class="pt-actions"> </span>
				</div>

				<div class="pt-card-body flex items-center">
					<div class="h100% flex-1" ref="payChartRef"></div>
					<div class="pt-card-info h100% flex-1 flex flex-col justify-between">
						<div class="pt-series-item text-right">
							<div class="pt-chart-num text-20px font-bold color-#3AB2A9">{{ payInfo.ybfValue }}</div>
							<div class="pt-item-label text-18px">已拨付</div>
						</div>

						<div class="pt-series">
							<div class="pt-ser">
								<div class="pt-ser-label">总金额</div>
								<div class="pt-chart-num mt7px">{{ payInfo.zjeValue }}</div>
							</div>
							<div class="pt-ser">
								<div class="pt-ser-label">未拨付</div>
								<div class="pt-chart-num">{{ payInfo.wbfValue }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="pt-toggle-btn" :class="{ 'pt-toggle-btn--unfold': unfold }" @click="unfold = !unfold"></div>
	</div>
</template>

<script setup lang="tsx" name="MainRight">
import { onMounted, reactive, ref, watch } from "vue";
import { chunk } from "lodash";

import { DataPreviewParams, geFundPayApi, getBizAuditApi, getQqStatApi } from "@/api/modules/bigScreen";
import { BigScreenStore } from "@/stores/modules/bigScreen";

import { usePieChart } from "./usePieChart";

import { getDistrictLevel } from "../../helper";

const bigScreenStore = BigScreenStore();

const unfold = ref(false);
const tabs = reactive({
	value: "1" as const,
	list: [
		{
			key: "1",
			label: "单元类型",
			value: "dylx"
		},
		{
			key: "2",
			label: "权属统计",
			value: "qstj"
		}
	]
});

const payInfo = reactive<Record<string, any>>({
	ybfValue: 0,
	wbfValue: 0,
	zjeValue: 0
});

const auditChartRef = ref<HTMLElement | null>(null);
const auditOption = {
	legend: { show: false },
	mainSeries: {
		name: "业务审批",
		color: ["#2470A9", "#33BFCF", "#E2A45A", "#D4DBE8"]
	}
};
type Legend = {
	name: string;
	value: number;
	percent: number;
	color: string;
	selected: boolean;
	label: Record<string, any>;
	labelLine: Record<string, any>;
};
const auditLegend = reactive<{ value: string; list: Legend[] }>({
	value: "",
	list: []
});
const { setChartData: setAuditData, getChartData: getAuditData, setChartOption: setAuditOption } = usePieChart(auditChartRef);

const statChartRef = ref<HTMLElement | null>(null);
const statOption = {
	legend: { show: false },
	mainSeries: {
		name: "确权统计",
		color: ["#3DB1FF", "#4EE9FF", "#B1FF9E", "#47E9A1", "#3DAAB7", "#F0BF74", "#D7A6CD", "#975BC5"]
	}
};
const statLegend = reactive<{ value: string; list: Legend[] }>({
	value: "",
	list: []
});
const { setChartData: setStatData, getChartData: getStatData, setChartOption: setStatOption } = usePieChart(statChartRef);

const payChartRef = ref<HTMLElement | null>(null);
const payOption = {
	legend: { show: false },
	mainSeries: {
		name: "资金拨付",
		color: ["#5AD8A6", "#2470A9"]
	}
};
const { setChartData: setPayData, getChartData: getPayData, setChartOption: setPayOption } = usePieChart(payChartRef);

async function reqAuditData(apiParams: DataPreviewParams) {
	const { data } = await getBizAuditApi(apiParams);
	const resData = data ?? [];
	setAuditData(resData, auditOption);
	const listData = getAuditData().map((v, k) => {
		return {
			...v,
			color: auditOption.mainSeries.color[k % 4],
			selected: false,
			label: { show: false },
			labelLine: { show: false }
		};
	});
	auditLegend.list = listData;
}
async function reqStatData(apiParams: DataPreviewParams) {
	const { data } = await getQqStatApi({ type: tabs.value, ...apiParams });
	const resData = data ?? [];
	setStatData(resData, statOption);
	const listData = getStatData().map((v, k) => {
		return {
			...v,
			color: statOption.mainSeries.color[k % 8],
			selected: false,
			label: { show: false },
			labelLine: { show: false }
		};
	});
	statLegend.list = listData;
}
async function reqPayData() {
	const { data } = await geFundPayApi({ parentValue: "zjbf" });
	const resList = data.list ?? [];
	resList.forEach(i => {
		payInfo[`${i.value}Value`] = i.remark;
	});

	const didData = resList.filter(i => i.value !== "zje").map(i => ({ label: i.label, num: +i.remark }));
	setPayData(didData, payOption);
	const listData = getPayData().map((v, k) => {
		let result = false;
		if (v.name === "已拨付") result = true;
		return {
			...v,
			color: statOption.mainSeries.color[k % 8],
			selected: result,
			label: { show: result },
			labelLine: { show: result }
		};
	});

	setPayOption(listData, payOption);
}

const onToggleLegend = (legend: Legend, list: Legend[], type: "audit" | "stat") => {
	list.forEach((item: Legend) => {
		if (item === legend) {
			item.selected = !legend.selected;
			item.label = { show: legend.selected };
			item.labelLine = { show: legend.selected };
		} else {
			item.selected = false;
			item.label = { show: false };
			item.labelLine = { show: false };
		}
	});
	switch (type) {
		case "audit":
			setAuditOption(list, auditOption);
			break;
		case "stat":
			setStatOption(list, statOption);
			break;
	}
};

watch(
	() => bigScreenStore.districtCode,
	newValue => {
		if (newValue) {
			const apiParams: Record<string, number | string> = {};
			const districtLevel = getDistrictLevel(newValue);
			if (!districtLevel) return;
			apiParams[`${districtLevel}Id`] = newValue;
			reqAuditData(apiParams);
		}
	},
	{ immediate: true }
);
watch(
	() => [bigScreenStore.districtCode, tabs.value],
	([districtCode]) => {
		if (districtCode) {
			const apiParams: Record<string, number | string> = {};
			const districtLevel = getDistrictLevel(districtCode);
			if (!districtLevel) return;
			apiParams[`${districtLevel}Id`] = districtCode;
			reqStatData(apiParams);
		}
	},
	{ immediate: true }
);

const dTitle = (title: string = "", len: number) => {
	const title1 = title + "";
	return title1.length > len ? title : "";
};

onMounted(async () => {
	await reqPayData();
});
</script>

<style scoped lang="less">
.pt-main-right {
	width: 500px;
	height: 100%;
	transition: all 0.3s;
	&:hover {
		background: left top / contain no-repeat url("./imgs/hover-aside-right-bg.png");
	}
	&--unfold {
		width: 0;
		padding-right: 0;
	}

	.pt-card-list {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.pt-card {
		color: #c5dfff;
		flex: 1;
		min-height: 258px;
		display: flex;
		flex-direction: column;

		& ~ .pt-card {
			margin-top: 27px;
		}
	}

	.pt-card-header {
		background: left center / contain no-repeat url("./imgs/title-bg.png");
		height: 40px;
		padding-left: 26px;
		padding-right: 60px;
		line-height: 40px;
		display: flex;
		justify-content: space-between;

		.pt-name {
			font-size: 22px;
			font-family: PangMenZhengDao;
		}
	}

	.pt-card-body {
		flex: 1;
		padding: 26px 48px 26px 22px;
		overflow: hidden;
	}
	.pt-toggle-btn {
		cursor: pointer;
		width: 21px;
		height: 57px;
		background: center / contain no-repeat none;
		position: absolute;
		left: 0;
		top: 402px;

		&--unfold {
			left: auto;
			right: 0;
			background-image: url("./imgs/unfold-right-bg.png");
		}
	}

	.pt-card-info {
		overflow-y: auto;
		&::-webkit-scrollbar {
			background-color: inherit;
		}
		.pt-chart-num {
			font-family: DINPro-Bold;
		}

		.pt-ser {
			display: flex;
			align-items: center;
			font-size: 16px;
			.pt-chart-num {
				margin-left: 21px;
				// background: center / auto no-repeat url("./imgs/chartnum-bg.png");
				border: 1px solid #5e8da5;
				border-radius: 8px;
				padding: 0 7px;
			}

			& ~ .pt-ser {
				margin-top: 10px;
			}
		}
	}

	.pt-legend-item-outer {
		& ~ .pt-legend-item-outer {
			margin-top: 36px;
		}
	}
	.pt-legend-item-outer1 {
		& ~ .pt-legend-item-outer1 {
			margin-top: 15px;
		}
	}

	.pt-legend-num {
		font-size: 18px;
		font-weight: bold;
		color: #72c8eb;
	}

	.pt-legend-percent {
		font-size: 18px;
		padding-left: 14px;
	}
}
</style>

<style lang="less">
.pt-main-right {
	.ant-tabs .ant-tabs-tab {
		padding: 0;
	}

	.ant-tabs-nav {
		height: 100%;
	}

	.ant-tabs-bottom > .ant-tabs-nav:before,
	.ant-tabs-bottom > div > .ant-tabs-nav:before,
	.ant-tabs-top > .ant-tabs-nav:before,
	.ant-tabs-top > div > .ant-tabs-nav:before {
		border-color: transparent;
	}

	.ant-tabs.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-ink-bar,
	.ant-tabs.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-ink-bar,
	.ant-tabs.ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar,
	.ant-tabs.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-ink-bar {
		background-color: #ff8337;
		margin-left: 26px !important;
		width: 32px !important;
	}

	.ant-tabs .ant-tabs-tab:hover {
		color: #73caed;
	}

	.ant-tabs {
		color: #73caed;
	}

	.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
		color: #c5dfff;
	}
}
</style>
