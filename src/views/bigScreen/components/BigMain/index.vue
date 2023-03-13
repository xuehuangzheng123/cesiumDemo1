<template>
	<div class="pt-big-main">
		<div class="pt-main-left-wrapper">
			<MainLeft />
		</div>

		<div class="pt-main-right-wrapper">
			<MainRight />
		</div>

		<div class="pt-main-mapcontrol">
			<MapControl />
		</div>
	</div>
</template>

<script setup lang="tsx" name="BigMain">
import MainLeft from "./MainLeft.vue";
import MainRight from "./MainRight.vue";
import MapControl from "./MapControl.vue";
</script>

<style scoped lang="less">
.pt-big-main {
	width: 100%;
	position: relative;
	.pt-main-left-wrapper {
		position: absolute;
		left: 0;
		min-height: 873px;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent);
		height: calc(100vh - 87px); // 减去header高度
		padding-bottom: 20px;
	}
	.pt-main-right-wrapper {
		position: absolute;
		right: 0;
		min-height: 873px;
		background: linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent);
		height: calc(100vh - 87px - 0px);
		padding-bottom: 20px;
	}

	.pt-main-mapcontrol {
		position: fixed;
		right: 0;
		bottom: 0;
	}
}
</style>

<style lang="less"></style>
