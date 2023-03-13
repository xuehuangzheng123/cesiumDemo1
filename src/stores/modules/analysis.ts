import { defineStore } from "pinia";

// import piniaPersistConfig from "@/config/piniaPersist";

interface AnalysisGlobalState {
	showStylesModel: boolean;
	showAttrModel: boolean;
}

// AnalysisStore
export const AnalysisStore = defineStore({
	id: "AnalysisGlobalState",
	state: (): AnalysisGlobalState => ({
		//样式设置弹框
		showStylesModel: false,
		//属性设置弹框
		showAttrModel: false
	}),
	getters: {},
	actions: {
		setShowStylesModel(visible: boolean) {
			this.showStylesModel = visible;
		},
		setShowAttrModel(visible: boolean) {
			this.showAttrModel = visible;
		}
	}
	// persist: piniaPersistConfig("AnalysisGlobalState")
});
