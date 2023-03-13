<template>
	<div class="pt-big-map w100% h100%">
		<!-- <h1>BigMap</h1> -->
		<Map3d class="map3d w100% h100% absolute z-100" :mapId="mapId"></Map3d>
		<MapControl class="pt-map-control" />
	</div>
</template>

<script setup lang="tsx" name="BigMap">
import { ref } from "vue";

import Map3d from "@/components/Map/map3d/index.vue";
import MapControl from "@/components/Map/map3d/mapControl.vue";
const mapId = ref("bigMap");
</script>

<style scoped lang="less"></style>

<style lang="less">
.pt-big-map {
	.pt-map-control {
		> div {
			right: 0;
		}
	}
}
</style>
