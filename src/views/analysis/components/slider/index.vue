<template>
	<div class="slider-wrapper">
		<a-slider
			v-model:value="sValue"
			:tooltipVisible="false"
			:min="props.min"
			:max="props.max"
			@change="onChangeSlider"
		></a-slider>
		<div>{{ sValue }}{{ props.type }}</div>
	</div>
</template>

<script setup lang="tsx" name="Slider">
import { computed } from "vue";

interface Props {
	value?: number;
	min?: number;
	max?: number;
	type?: string;
}
const props = withDefaults(defineProps<Props>(), {
	value: 0,
	min: 0,
	max: 0,
	type: "%"
});

const sValue = computed({
	get() {
		return props.value;
	},
	set(value: number) {
		emit("update:value", value);
	}
});

const onChangeSlider = (value: number) => {
	emit("change", value);
};

const emit = defineEmits<{
	(e: "update:value", value: number): void;
	(e: "change", value: number): void;
}>();
</script>

<style lang="less" scoped>
.slider-wrapper {
	display: flex;
	align-items: center;
	height: 24px;
	.ant-slider {
		width: 70%;
	}
}
</style>
<style lang="less">
.slider-wrapper {
	.ant-slider {
		margin: 14px 9px 10px;
		.ant-slider-rail {
			background: var(--white-5);
			border-radius: 0;
		}
		.ant-slider-track {
			background: #58a3ff;
		}
		.ant-slider-handle {
			width: 8px;
			height: 8px;
			margin-top: -2px;
			background: linear-gradient(180deg, #6bcffe, #2c8aff);
			border-radius: 50%;
		}
	}
}
</style>
