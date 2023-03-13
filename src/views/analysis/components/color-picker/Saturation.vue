<template>
	<div
		class="jk-dark-saturation"
		:style="{ background: bgColor }"
		ref="container"
		@mousedown="handleMouseDown"
		@touchmove="handleChange"
		@touchstart="handleChange"
	>
		<div class="jk-dark-saturation--white"></div>
		<div class="jk-dark-saturation--black"></div>
		<div class="jk-dark-saturation-pointer" :style="{ top: pointerTop, left: pointerLeft }">
			<div class="jk-dark-saturation-circle"></div>
		</div>
	</div>
</template>

<script setup lang="tsx" name="Saturation">
import { computed, ref } from "vue";
import { clamp, throttle } from "lodash";

interface Props {
	value?: any;
	hsvH: number;
	hsvS: number;
	hsvV: number;
}
const props = withDefaults(defineProps<Props>(), {
	value: () => Object.create(null),
	hsvH: 0,
	hsvS: 0,
	hsvV: 0
});
const container = ref();
const bgColor = computed(() => `hsl(${props.hsvH}, 100%, 50%)`);
const pointerLeft = computed(() => props.hsvS * 100 + "%");
const pointerTop = computed(() => -(props.hsvV * 100) + 1 + 100 + "%");

const throttleFn: any = throttle(
	(fn: any, data: any) => {
		fn(data);
	},
	50,
	{
		leading: true,
		trailing: false
	}
);

const handleChange = (e: any, skip?: any) => {
	!skip && e.preventDefault();
	if (!container.value) {
		return;
	}
	const containerWidth = container.value.clientWidth;
	const containerHeight = container.value.clientHeight;

	const xOffset = container.value.getBoundingClientRect().left + window.pageXOffset;
	const yOffset = container.value.getBoundingClientRect().top + window.pageYOffset;
	const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
	const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
	const left = clamp(pageX - xOffset, 0, containerWidth);
	const top = clamp(pageY - yOffset, 0, containerHeight);
	const saturation = left / containerWidth;
	const bright = clamp(-(top / containerHeight) + 1, 0, 1);

	throttleFn(onChange, {
		s: saturation,
		v: bright
	});
};

const onChange = (sv: any) => {
	emit("change", sv);
};

const handleMouseDown = () => {
	window.addEventListener("mousemove", handleChange);
	window.addEventListener("mouseup", handleChange);
	window.addEventListener("mouseup", handleMouseUp);
};

const handleMouseUp = () => {
	unbindEventListeners();
};

const unbindEventListeners = () => {
	window.removeEventListener("mousemove", handleChange);
	window.removeEventListener("mouseup", handleChange);
	window.removeEventListener("mouseup", handleMouseUp);
};
const emit = defineEmits<{
	(e: "change", value: string): void;
}>();
</script>

<style lang="less" scoped>
.jk-dark-saturation,
.jk-dark-saturation--white,
.jk-dark-saturation--black {
	cursor: pointer;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.jk-dark-saturation--white {
	background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}
.jk-dark-saturation--black {
	background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}
.jk-dark-saturation-pointer {
	cursor: pointer;
	position: absolute;
}
.jk-dark-saturation-circle {
	cursor: head;
	width: 6px;
	height: 6px;
	box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);
	border-radius: 50%;
	transform: translate(-3px, -3px);
}
</style>
