<template>
	<div :id="mapId"></div>
</template>
<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";

import mapConfig from "@/assets/json/mapConfig.json";
import { mapManage } from "@/map/map3d/MapManage";
// import { useStore } from 'vuex'
export default defineComponent({
	name: "Map3d",
	props: {
		mapId: {
			type: String,
			default: "maptop"
		}
	},
	setup(props) {
		onMounted(() => {
			nextTick(() => {
				let map = mapManage().initMap({
					id: props.mapId,
					mapOptions: mapConfig
				});
				window.map = map;
			});
		});
	}
});
</script>
