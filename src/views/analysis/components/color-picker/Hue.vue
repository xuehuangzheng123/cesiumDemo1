<template>
	<div class="jk-dark-hue jk-dark-hue--horizontal">
		<div
			class="jk-dark-hue-container"
			role="slider"
			:aria-valuenow="hsvH"
			aria-valuemin="0"
			aria-valuemax="360"
			ref="container"
			@mousedown="handleMouseDown"
			@touchmove="handleChange"
			@touchstart="handleChange"
		>
			<div class="jk-dark-hue-pointer" :style="{ top: 0, left: pointerLeft }" role="presentation">
				<div class="jk-dark-hue-picker"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx" name="Hue">
import { computed, ref, watch } from "vue";

interface Props {
	hsvH: number;
}
const props = withDefaults(defineProps<Props>(), {
	hsvH: 0
});

const oldHue = ref(0);
const pullDirection = ref("");
const container = ref();

const pointerLeft = computed(() => {
	if (props.hsvH === 0 && pullDirection.value === "right") {
		return "100%";
	}
	return (props.hsvH * 100) / 360 + "%";
});

watch(
	() => props.hsvH,
	(val: any): void => {
		if (val !== 0 && val - oldHue.value > 0) {
			pullDirection.value = "right";
		}
		if (val !== 0 && val - oldHue.value < 0) {
			pullDirection.value = "left";
		}
		oldHue.value = val;
	}
);

const handleChange = (e: any, skip?: any) => {
	!skip && e.preventDefault();

	if (!container.value) {
		return;
	}
	const containerWidth = container.value.clientWidth;
	const xOffset = container.value.getBoundingClientRect().left + window.pageXOffset;
	const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
	const left = pageX - xOffset;

	let h;
	let percent;
	if (left < 0) {
		h = 0;
	} else if (left > containerWidth) {
		h = 360;
	} else {
		percent = (left * 100) / containerWidth;
		h = (360 * percent) / 100;
	}
	if (props.hsvH !== h) {
		emit("change", h);
	}
};

const handleMouseDown = (e: any) => {
	handleChange(e, true);
	window.addEventListener("mousemove", handleChange);
	window.addEventListener("mouseup", handleMouseUp);
};
const handleMouseUp = () => {
	unbindEventListeners();
};
const unbindEventListeners = () => {
	window.removeEventListener("mousemove", handleChange);
	window.removeEventListener("mouseup", handleMouseUp);
};

const emit = defineEmits<{
	(e: "change", value: number): void;
}>();
</script>

<style lang="less" scoped>
.jk-dark-hue {
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	border-radius: 2px;
}
.jk-dark-hue--horizontal {
	background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.jk-dark-hue-container {
	cursor: pointer;
	margin: 0 2px;
	position: relative;
	height: 100%;
}
.jk-dark-hue-pointer {
	z-index: 2;
	position: absolute;
}
.jk-dark-hue-picker {
	width: 12px;
	height: 12px;
	margin-top: -1px;
	cursor: pointer;
	border-radius: 50%;
	background: #fff;
	transform: translateX(-6px);
}
</style>
