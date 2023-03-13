<template>
	<div class="pt-big-screen">
		<div class="pt-header-wrapper">
			<BigHeader />
		</div>

		<div class="pt-map-wrapper">
			<BigMap />
		</div>

		<div class="pt-main-wrapper">
			<BigMain />
		</div>
	</div>
</template>

<script setup lang="tsx" name="BigScreen">
import BigHeader from "./components/BigHeader/index.vue";
import BigMain from "./components/BigMain/index.vue";
import BigMap from "./components/BigMap/index.vue";
</script>

<style scoped lang="less">
.pt-big-screen {
	min-width: 1860px;
	height: 100vh;
	min-height: 960px;
	position: relative;
	color: #73caed;

	.pt-header-wrapper {
		position: absolute;
		z-index: 200;
		width: 100%;
		height: 87px;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
	}

	.pt-map-wrapper {
		width: 100%;
		height: 100%;
		background-color: #000;
		// position: absolute; // 子组件添加了
		// z-index: 100;
	}

	.pt-main-wrapper {
		width: 100%;
		position: absolute;
		z-index: 200;
		top: 87px;
		background-color: blueviolet;
	}
}
</style>

<style lang="less"></style>
