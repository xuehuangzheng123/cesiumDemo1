import { type Ref, onBeforeUnmount, onMounted } from "vue";
import * as echarts from "echarts";
import { LabelLayoutOptionCallbackParams } from "echarts";

import { useEcharts } from "@/hooks/useEcharts";

type StatItem = {
	label: string;
	num: number;
};
/* any 暂时的，后续替换 */
function processData(data: StatItem[]) {
	const processedData = data.map(i => {
		return {
			name: i.label,
			value: i.num,
			percent: 0
		};
	});
	const total = processedData.reduce((p, c) => p + c.value, 0);

	for (const item of processedData) {
		if (total === 0) {
			item.percent = 0;
		} else {
			item.percent = +((item.value / total) * 100).toFixed(2);
		}
	}
	return { processedData, total };
}

function processSeries(data: any, mainSeries: any) {
	return [
		{
			name: "外边框",
			type: "pie" as const,
			radius: ["90%"],
			height: "90%",
			center: ["50%", "55%"],
			zlevel: -1,
			silent: true,
			label: {
				show: false
			},
			labelLine: {
				show: false
			},
			itemStyle: {
				color: "rgba(0, 0, 0, 0)",
				borderWidth: 1,
				borderColor: "#426183"
			},
			data: [{ value: 0 }],
			tooltip: {
				show: false
			}
		},

		{
			name: "",
			type: "pie" as const,
			radius: ["50%", "80%"],
			height: "90%",
			center: ["50%", "55%"],
			zlevel: 1,
			silent: true,
			avoidLabelOverlap: false,
			label: {
				show: false,
				fontSize: 16,
				color: "#FF8337",
				formatter: "{d}%"
			},
			labelLine: {
				show: false,
				lineStyle: {
					color: "#899FB4"
				}
			},
			labelLayout(params: LabelLayoutOptionCallbackParams) {
				// console.log(313, params);
				if (!params.labelLinePoints) return {};
				return {
					labelLinePoints: [params.labelLinePoints[0], [130, 20], [138, 20]],
					x: 95,
					y: 20,
					dx: 42,
					dy: 2,
					align: "left"
				};
			},
			data,
			...mainSeries
		},

		{
			name: "内边框",
			type: "pie" as const,
			radius: ["65%"],
			height: "90%",
			center: ["50%", "55%"],
			zlevel: 2,
			silent: true,
			label: {
				show: false
			},
			labelLine: {
				show: false
			},
			itemStyle: {
				color: "rgba(0, 0, 0, 0)",
				borderWidth: 1,
				borderColor: "#F2F8FF",
				borderType: "dashed" as const
			},
			data: [{ value: 0 }],
			tooltip: {
				show: false
			}
		}
	];
}

function combineChartOption(data: any, total: number, option: echarts.EChartsOption = {}) {
	const { legend, mainSeries, ...other } = option;
	return {
		tooltip: {
			trigger: "item" as const
		},
		legend: {
			top: "middle",
			right: "0",
			width: 120,
			textStyle: {
				color: "#C5DFFF"
			},
			...legend
		},
		title: {
			text: "总数",
			subtext: total + "",
			textStyle: {
				fontSize: 0
			},
			subtextStyle: {
				fontSize: 20,
				color: "#C5DFFF",
				width: 80,
				overflow: "truncate"
			},
			left: "center",
			top: "center"
		},
		series: processSeries(data, mainSeries),
		...other
	};
}

function doDataOption(data: StatItem[], option: echarts.EChartsOption = {}) {
	const { processedData, total } = processData(data);
	const chartOption = combineChartOption(processedData, total, option);
	return { chartOption, processedData };
}

export const usePieChart = (elRef: Ref<HTMLElement | null>) => {
	let myChart: echarts.ECharts | null = null;
	const chartOption: echarts.EChartsOption = doDataOption([]);
	let chartData: { name: string; value: number; percent: number }[] = [];

	const setChartData = (data: StatItem[], option: echarts.EChartsOption = {}) => {
		if (!myChart) return;
		const { chartOption, processedData } = doDataOption(data, option);
		chartData = processedData;
		myChart.setOption(chartOption, { notMerge: true });
	};

	const getChartData = () => {
		return chartData;
	};

	const setChartOption = (seriesData: any[], option: echarts.EChartsOption = {}) => {
		if (!myChart) return;
		const total = seriesData.reduce((p, c) => p + c.value, 0);
		const chartOption = combineChartOption(seriesData, total, option);
		chartData = seriesData;
		myChart.setOption(chartOption, { notMerge: true });
	};

	onMounted(async () => {
		if (!elRef.value) return;
		myChart = echarts.init(elRef.value);
		useEcharts(myChart, chartOption);
	});

	onBeforeUnmount(() => {
		if (!myChart) return;
		myChart.dispose();
		myChart = null;
	});

	return { setChartData, getChartData, setChartOption };
};
