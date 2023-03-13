<template>
	<div class="pt-big-header">
		<SelectArea class="pt-district w120 absolute left-26% top-20%" :allow-clear="false" @change="onChangeArea"></SelectArea>

		<div class="pt-tabs">
			<a-radio-group v-model:value="tabs.value">
				<a-radio-button v-for="item in tabs.list" :value="item.value" :key="item.key">{{ item.label }}</a-radio-button>
			</a-radio-group>
		</div>

		<div class="pt-actions">
			<div
				v-for="item in actions.list"
				:key="item.key"
				class="pt-action-item"
				:class="{ 'pt-action-item--selected': item.selected }"
				@click="onSelect(item)"
			>
				<div class="pt-icon"><i :class="`icon-qqdp-${item.value}`" /></div>
				<div class="pt-text">{{ item.label }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx" name="BigHeader">
import { reactive } from "vue";

import SelectArea from "@/components/Map/map3d/selectArea.vue";
import { BigScreenStore } from "@/stores/modules/bigScreen";

type Item = {
	key: string;
	value: string;
	label: string;
};
type ActionItem = Item & { icon: string; selected: boolean };
type Options<E = {}> = {
	value: string;
	list: (Item & E)[];
};
const tabs = reactive<Options>({
	value: "zlkb",
	list: [
		{
			key: "zlkb",
			value: "zlkb",
			label: "总览看板"
		},
		{
			key: "qqcg",
			value: "qqcg",
			label: "确权成果"
		},
		{
			key: "gzjz",
			value: "gzjz",
			label: "工作进展"
		},
		{
			key: "ywsp",
			value: "ywsp",
			label: "业务审批"
		},
		{
			key: "fwjg",
			value: "fwjg",
			label: "服务监管"
		}
	]
});

const actions = reactive<Options<{ icon: string; selected: boolean }>>({
	value: "",
	list: [
		{
			key: "lc",
			value: "lc",
			label: "量测",
			icon: "",
			selected: false
		},
		{
			key: "sjz",
			value: "sjz",
			label: "时间轴",
			icon: "",
			selected: false
		},
		{
			key: "jt",
			value: "jt",
			label: "截图",
			icon: "",
			selected: false
		},
		{
			key: "fx",
			value: "fx",
			label: "分析",
			icon: "",
			selected: false
		},
		{
			key: "gd",
			value: "gd",
			label: "更多",
			icon: "",
			selected: false
		}
	]
});

let prevItem: ActionItem | null = null;
const onSelect = (item: ActionItem) => {
	if (prevItem) {
		if (prevItem !== item) {
			prevItem.selected = false;
		} else {
			// item.selected = true;
		}
	}

	item.selected = true;
	prevItem = item;
};

const onChangeArea = (value: string | number) => {
	const bigScreenStore = BigScreenStore();
	bigScreenStore.setDistrictCode(value);
};
</script>

<style scoped lang="less">
.pt-big-header {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	background: center / contain no-repeat url("./imgs/header-bg.png"),
		left center / 960px 82px no-repeat url("./imgs/header-left-bg.png"),
		right center / 960px 82px no-repeat url("./imgs/header-right-bg.png");

	.ant-radio-button-wrapper {
		background: center / contain no-repeat url("./imgs/radio-btn-bg.png");
		color: #73caed;
		font-size: 20px;
		padding: 0 10px;
		line-height: 28px;
		border-color: transparent;

		& ~ .ant-radio-button-wrapper {
			margin-left: 30px;
		}
	}

	:deep(.pt-district) {
		.ant-select-selector {
			background-color: transparent;
			color: #c5dfff;
			border: none;
			font-size: 18px;
		}
	}

	.pt-actions {
		position: absolute;
		display: flex;
		top: 10%;
		right: 14%;
	}

	.pt-action-item {
		text-align: center;
		cursor: pointer;
		& ~ .pt-action-item {
			margin-left: 26px;
		}
		&--selected {
			color: #ff8337;
		}
		.pt-icon {
			background: center / contain no-repeat url("./imgs/action-bg.png");
			font-size: 20px;
			width: 36px;
			height: 30px;
			line-height: 30px;
		}
	}
}
</style>

<style lang="less">
.pt-big-header {
	.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:not(
			[class*=" ant-radio-button-wrapper-disabled"]
		).ant-radio-button-wrapper:first-child,
	.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
		border-color: transparent;
		color: #c5dfff;
		background-image: url("./imgs/radio-btn-selected-bg.png");
	}

	.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
		display: none;
	}
}
</style>
