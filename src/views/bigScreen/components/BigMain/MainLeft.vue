<template>
	<div class="pt-main-left pt28px pl20px" :class="{ 'pt-main-left--unfold': unfold }">
		<div v-show="!unfold" class="pt-card-list">
			<div class="pt-card pt-card-overview">
				<div class="pt-card-header">
					<span class="pt-name">{{ overview.name }}</span>
				</div>
				<div class="pt-card-body">
					<div class="pt-list">
						<div
							v-for="item in overview.list"
							class="pt-list-item w194px ml22px mt30px cursor-pointer"
							:key="item.key"
							@click="onSelect(item)"
						>
							<div class="pt-field">
								<span class="pt-icon align-middle"><i :class="`icon-qqdp-${item.icon}`" /></span>
								<span class="pt-label text-18px ml16px sle" :title="dTitle(item.label, 8)">{{ item.label }}</span>
							</div>
							<div class="pt-value mt16px" :class="{ 'pt-value--selected': item.selected }">
								<span class="pt-num sle text-32px color-#73CAED" :title="dTitle(item.num, 8)">{{ item.num }}</span>
								<span class="pt-unit text-18px ml16px">{{ item.unit }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-card pt-card-workparogress">
				<div class="pt-card-header">
					<span class="pt-name">{{ workProgress.name }}</span>
					<span class="pt-pagination">
						<span
							v-for="i in pageNum"
							class="pt-pagination-item"
							:class="{ 'pt-pagination-item--selected': workProgress.pageNo === i }"
							:key="`pi_${i}`"
							@click="onPageChange(i)"
							>{{ i }}</span
						>
					</span>
				</div>
				<div class="pt-card-body">
					<div class="pt-list">
						<div v-for="item in workProgress.list" class="pt-list-item w100%" :key="item.key">
							<div class="pt-desc pl14px">
								<span class="pt-label flex-1 sle" :title="item.label">{{ item.label }}</span>
								<span class="pt-percent color-#73CAED ml-$pt-spacer-sm">{{ +item.num * 100 }}%</span>
							</div>
							<div class="pt-progress pl14px mt8px">
								<a-progress :percent="+item.num * 100" :show-info="false" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="pt-toggle-btn" :class="{ 'pt-toggle-btn--unfold': unfold }" @click="unfold = !unfold"></div>
	</div>
</template>

<script setup lang="tsx" name="MainLeft">
import { computed, onBeforeMount, reactive, ref, watch } from "vue";

import { DataPreviewParams, getDataPreviewApi, getWorkProgressApi } from "@/api/modules/bigScreen";
import { BigScreenStore } from "@/stores/modules/bigScreen";

import { getDistrictLevel } from "../../helper";

const bigScreenStore = BigScreenStore();
const unfold = ref(false);

interface Item {
	key: number;
	icon: string;
	label: string;
	num: number | string;
	unit: string;
	selected: boolean;
}

interface Overview {
	name: string;
	list: Item[];
}
const overview = reactive<Overview>({
	name: "数据概览",
	list: [
		{
			key: 11,
			icon: "qqmj",
			label: "确权面积",
			num: "--",
			unit: "公顷",
			selected: false
		},
		{
			key: 12,
			icon: "qqsl",
			label: "确权数量",
			num: "--",
			unit: "个",
			selected: false
		},
		{
			key: 13,
			icon: "djsl",
			label: "登记数量",
			num: "--",
			unit: "个",
			selected: false
		},
		{
			key: 14,
			icon: "fzsl",
			label: "发证数量",
			num: "--",
			unit: "个",
			selected: false
		}
	]
});

interface WorkProgress {
	name: string;
	pageNo: number;
	pageSize: number;
	total: number;
	list: Omit<Item, "icon" | "unit" | "selected">[];
}
const workProgress = reactive<WorkProgress>({
	name: "工作进展",
	pageNo: 1,
	pageSize: 10,
	total: 18,
	list: []
});

const pageNum = computed(() => {
	let result = 1;
	const pageNumCeil = Math.ceil(workProgress.total / workProgress.pageSize);
	if (pageNumCeil > result) {
		result = 2;
	}

	return result;
});

let prevItem: Item | null = null;
const onSelect = (item: Item) => {
	if (prevItem) {
		if (prevItem !== item) {
			prevItem.selected = false;
		} else {
			item.selected = !item.selected;
			return;
		}
	}

	item.selected = true;
	prevItem = item;
};

const onPageChange = async (i: number) => {
	workProgress.pageNo = i;
	await reqWorkProgress();
};

async function reqOverview(apiParams: DataPreviewParams) {
	const { data } = await getDataPreviewApi(apiParams);
	const resData = data ?? [];
	const LABEL_TO_ICON: Record<string, string> = { 确权面积: "qqmj", 确权数量: "qqsl", 登记数量: "djsl", 发证数量: "fzsl" };
	overview.list = resData.map((i, key) => ({
		key,
		icon: LABEL_TO_ICON[i.label],
		label: i.label,
		num: i.num,
		unit: i.unit,
		selected: false
	}));
}
async function reqWorkProgress() {
	const { data } = await getWorkProgressApi({
		pageNo: workProgress.pageNo,
		pageSize: workProgress.pageSize,
		parentValue: "gzjz"
	});
	workProgress.total = data.total;
	const resList = data.list ?? [];
	workProgress.list = resList.map((v, k) => ({
		key: k,
		label: v.label,
		num: v.remark
	}));
}

watch(
	() => bigScreenStore.districtCode,
	newValue => {
		if (newValue) {
			const apiParams: Record<string, number | string> = {};
			const districtLevel = getDistrictLevel(newValue);
			if (!districtLevel) return;
			apiParams[`${districtLevel}Id`] = newValue;
			reqOverview(apiParams);
		}
	},
	{ immediate: true }
);

onBeforeMount(async () => {
	await reqWorkProgress();
});

const dTitle = (title: string | number, len: number) => {
	const title0 = title ?? "";
	const title1 = title0 + "";
	return title1.length > len ? title1 : "";
};
</script>

<style scoped lang="less">
.pt-main-left {
	width: 480px;
	height: 100%;
	transition: all 0.3s;
	&:hover {
		background: right top / contain no-repeat url("./imgs/hover-aside-bg.png");
	}
	&--unfold {
		width: 0;
		padding-left: 0;
	}

	.pt-card-list {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.pt-card {
		color: #c5dfff;

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
		.pt-list {
			display: flex;
			flex-wrap: wrap;
		}

		.pt-field {
			height: 26px;
			line-height: 26px;
		}
		.pt-icon {
			color: #296e8c;
			font-size: 26px;
		}
	}

	.pt-card-overview {
		.pt-label {
			display: inline-block;
			vertical-align: middle;
			max-width: 152px;
		}
		.pt-value {
			border: 1px solid transparent;
			text-align: center;
			line-height: 40px;
			height: 50px;

			.pt-num {
				display: inline-block;
				max-width: 130px;
			}

			&--selected {
				background: rgba(129, 81, 54, 0.2);
				border-color: rgba(255, 131, 55, 0.49);
				color: #ff8337;

				.pt-num {
					color: #ff8337;
				}
			}
		}
	}

	.pt-card-workparogress {
		flex: 1;
		min-height: 482px;
		overflow: hidden;
		.pt-pagination {
			font-size: 16px;
			color: #73caed;
		}

		.pt-pagination-item {
			padding: 7px;
			border-bottom: 3px solid transparent;
			cursor: pointer;

			&--selected {
				color: #c5dfff;
				border-bottom-color: #ff8337;
				transition: all 0.3s;
			}
			& ~ .pt-pagination-item {
				margin-left: 6px;
			}
		}

		.pt-card-body {
			height: calc(100% - 40px);
			padding: 32px 48px 32px 22px;
		}

		.pt-list {
			display: block;
			height: 100%;
			overflow-y: auto;
			padding-right: 8px;

			&::-webkit-scrollbar {
				background-color: inherit;
			}
		}

		.pt-list-item {
			& ~ .pt-list-item {
				margin-top: 36px;
			}
		}

		.pt-desc {
			background: left center / contain no-repeat url("./imgs/work-item-bg.png");
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}
	}

	.pt-toggle-btn {
		cursor: pointer;
		width: 21px;
		height: 57px;
		background: center / contain no-repeat none;
		position: absolute;
		right: 0;
		top: 402px;

		&--unfold {
			right: auto;
			background-image: url("./imgs/unfold-bg.png");
		}
	}
}
</style>

<style lang="less">
.pt-main-left {
	.pt-card-workparogress {
		.ant-progress-bg {
			background: linear-gradient(blue, pink);
			background: linear-gradient(to right, #415f81, #73caed);
		}

		.ant-progress-inner {
			&::before {
				display: block;
				content: "";
				width: 100%;
				height: 1px;
				background-color: #09435d;
				position: absolute;
				top: 50%;
			}
		}
	}
}
</style>
