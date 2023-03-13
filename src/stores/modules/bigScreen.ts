import { defineStore } from "pinia";

interface BigScreenState {
	districtCode: string | number;
}
export const BigScreenStore = defineStore({
	id: "BigScreenState",
	state: (): BigScreenState => ({
		// 行政区code
		districtCode: ""
	}),

	actions: {
		setDistrictCode(code: string | number) {
			this.districtCode = code;
		}
	}
});
