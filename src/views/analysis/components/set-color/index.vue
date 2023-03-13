<template>
	<div class="set-color-wrapper">
		<a-input class="w-120px! h-32px!" v-model:value="inputValue" />
		<div class="color-block">
			<color-picker
				:class="{ 'no-color-button': showNoColorStyle && !props.value }"
				type="hex"
				:value="hexValue"
				@change="onChangeColorPicker"
			></color-picker>
		</div>
	</div>
</template>

<script setup lang="ts" name="SetColor">
import { computed, onMounted, watch } from "vue";

import ColorPicker from "../color-picker/index.vue";
interface Props {
	value?: string;
	dom?: any;
	showNoColorStyle?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	value: "",
	dom: () => {
		return {};
	},
	showNoColorStyle: false
});

const inputValue = computed({
	get() {
		return props.value;
	},
	set(value: string) {
		hexValue.value = value;
		emit("update:value", value);
	}
});
const hexValue = computed({
	get() {
		return props.value;
	},
	set(value: string) {
		emit("update:value", value);
	}
});
onMounted(() => {
	if (props.showNoColorStyle && !props.value) {
		// hexValue.value = "#364c70";
	}
});

watch(
	() => hexValue.value,
	(newVal: any): void => {
		if (newVal) {
			if (props.showNoColorStyle && !props.value && hexValue.value === "#364c70") {
				return;
			}
		}
	}
);
const emit = defineEmits<{
	(e: "update:value", value: string): void;
}>();

const onChangeColorPicker = (val: any) => {
	hexValue.value = val;
	inputValue.value = val;
	emit("update:value", val);
};
</script>

<style lang="less" scoped>
.set-color-wrapper {
	display: flex;
	align-items: center;
	.color-block {
		width: 24px;
		height: 24px;
		border: 1px solid #364c70;
		margin-left: 6px;
		.no-color-button {
			&:before {
				content: "";
				height: 14px;
				width: 2px;
				background: #f51819;
				display: block;
				transform: skew(-45deg, 0deg);
				position: relative;
				left: 8px;
			}
		}
	}
}
</style>
<style lang="less">
.set-color-wrapper {
	.ant-input {
		flex: 1;
	}
}
.has-error .ant-input,
.has-error .ant-input:hover {
	background-color: rgba(7, 10, 26, 0.84);
	border-color: #3a5376 !important;
}
.has-error .ant-input:focus,
.has-error .ant-input:active {
	box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
}
</style>
