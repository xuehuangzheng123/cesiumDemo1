<template>
	<a-popover v-model:visible="visible" trigger="click" overlayClassName="color-picker-panel" placement="leftTop">
		<template #content>
			<div class="color-wrap">
				<CloseOutlined class="color-close" @click="visible = false" />
				<div class="color-board">
					<Saturation :hsv-h="hsvH" :hsv-s="hsvS" :hsv-v="hsvV" @change="SVChanged" />
				</div>
				<div class="color-hue">
					<div class="selected-color" :style="{ background: bgColor }"></div>
					<div class="hue">
						<Hue :hsv-h="hsvH" @change="hChanged" />
					</div>
				</div>
				<div class="color-rgb" v-if="type === 'rgb'">
					<div>
						<p class="value">{{ rgba.r }}</p>
						<p class="ke">R</p>
					</div>
					<div>
						<p class="value">{{ rgba.g }}</p>
						<p class="ke">G</p>
					</div>
					<div>
						<p class="value">{{ rgba.b }}</p>
						<p class="ke">B</p>
					</div>
				</div>
				<div v-if="type === 'hex'" class="color-hex">
					<div class="title">Hex</div>
					<div class="value">{{ bgColor }}</div>
				</div>
			</div>
		</template>
		<slot>
			<button class="color-btn" :style="{ background: bgColor }"></button>
		</slot>
	</a-popover>
</template>

<script setup lang="tsx" name="colorPicker">
import { computed, ref, watch } from "vue";
import tinycolor from "tinycolor2";

import { CloseOutlined } from "@ant-design/icons-vue";

import Hue from "./Hue.vue";
import Saturation from "./Saturation.vue";

interface Props {
	value?: any;
	type?: string;
}
const props = withDefaults(defineProps<Props>(), {
	value: () => {
		return { r: 0, g: 0, b: 0, a: 1 };
	},
	type: () => "rgb"
});

const visible = ref<boolean>(false);
const hsvH = ref<number>(0);
const hsvS = ref<number>(0);
const hsvV = ref<number>(0);

const rgba = computed(() => tinycolor({ h: hsvH.value, s: hsvS.value, v: hsvV.value, a: 1 }).toRgb());
const bgColor = computed(() => tinycolor({ h: hsvH.value, s: hsvS.value, v: hsvV.value, a: 1 }).toHexString());

const init = () => {
	let str = `rgb(${props.value})`;
	if (props.type === "hex") str = `${props.value}`;
	const { h, s, v } = tinycolor(str).toHsv();

	hsvH.value = h;
	hsvS.value = s;
	hsvV.value = v;
};
init();
const SVChanged = (data: any) => {
	const { s, v } = data;
	hsvS.value = s;
	hsvV.value = v;
	emit("change", bgColor.value);
};
const hChanged = (h: any) => {
	hsvH.value = h;
	console.log(h);
	emit("change", bgColor.value);
};

watch(
	() => [rgba.value, props.value],
	(newVal: any): void => {
		if (newVal[0]) {
			// const { r, g, b } = newVal[0];
			// let value = `${r},${g},${b}`;
			// 十六进制类型时，响应十六进制code
			// if (props.type === "hex") value = bgColor.value;
			// emit("change", value);
		}

		if (newVal[1]) {
			let str = `rgb(${props.value})`;
			if (props.type === "hex") str = `${props.value}`;
			if (tinycolor(str).isValid()) {
				const { h, s, v } = tinycolor(str).toHsv();
				hsvH.value = h;
				hsvS.value = s;
				hsvV.value = v;
			}
		}
	}
);

const emit = defineEmits<{
	(e: "change", value: string): void;
}>();
</script>

<style lang="less">
.color-picker-panel {
	.ant-popover-arrow {
		display: none;
	}
	.ant-popover-inner-content {
		padding: 0;
	}
}
.force-left--50 {
	left: 50px !important;
}
</style>
<style lang="less" scoped>
.color-btn {
	width: 22px;
	height: 22px;
	border: none;
	outline: none;
}
.color-wrap {
	position: relative;
	width: 160px;
	padding: 20px 5px 10px 5px;
	background: var(--light-body-bg-color);
	border: 1px solid var(--light-border-color);
	.color-close {
		position: absolute;
		top: 2px;
		right: 5px;
		color: #6d7a90;
	}
	.color-board {
		position: relative;
		height: 88px;
		overflow: hidden;
	}
	.color-hue {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 5px;
		> .selected-color {
			width: 16px;
			height: 16px;
			border-radius: 50%;
		}
		> .hue {
			position: relative;
			flex: 1;
			height: 10px;
			margin-left: 10px;
		}
	}
	.color-rgb {
		display: flex;
		justify-content: space-between;
		padding: 0 5px;
		color: var(--gray-8);
		> div {
			text-align: center;
			> .value {
				width: 36px;
				border: 1px solid var(--light-border-color);
			}
		}
	}
	.color-hex {
		display: flex;
		.title {
			color: var(--gray-8);
		}
		.value {
			width: 100%;
			border: 1px solid var(--gray-8);
			text-align: left;
			margin-left: 10px;
			padding-left: 6px;
			color: var(--gray-8);
		}
	}
}
</style>
<style lang="less">
.color-picker-panel {
	.ant-popover-inner {
		border: 1px solid var(--light-border-color);
	}
}
</style>
