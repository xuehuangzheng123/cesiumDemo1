<template>
	<div v-if="showStylesModel" class="styles-wrapper">
		<a-card>
			<div class="f-b-c p-16px pb-0px">
				<span class="text-18px">样式设置</span>
				<CloseOutlined class="text-16px mr-10px" @click="onClose" />
			</div>
			<a-form
				class="p-16px"
				ref="stylesForm"
				name="custom-validation"
				:model="form"
				:layout="layout"
				:rules="rules"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<div class="item-title">填充</div>
				<a-form-item label="面颜色" name="color" ref="colorRef">
					<set-color
						v-model:value="form.color"
						:dom="colorRef"
						:showNoColorStyle="true"
						placeholder="请输入十六进制颜色值"
					></set-color>
				</a-form-item>
				<a-form-item label="面透明度" name="opacity">
					<slider v-model:value="opacityX100" :min="0" :max="100"></slider>
				</a-form-item>
				<div class="item-title">边线</div>
				<a-form-item label="线颜色" name="strokeColor" ref="strokeColorRef">
					<set-color
						v-model:value="form.strokeColor"
						:dom="strokeColorRef"
						:showNoColorStyle="true"
						placeholder="请输入十六进制颜色值"
					></set-color>
				</a-form-item>
				<a-form-item label="线宽度" name="strokeWidth">
					<slider v-model:value="form.strokeWidth" :min="1" :max="50" type="px"></slider>
				</a-form-item>
				<a-form-item label="线透明度" name="strokeOpacity">
					<slider v-model:value="strokeOpacityX100" :min="0" :max="100"></slider>
				</a-form-item>
			</a-form>
			<div class="styles-btn">
				<a-button class="mr-20px" @click="onReset">重置</a-button>
				<a-button type="primary" @click="onApply">应用</a-button>
			</div>
		</a-card>
	</div>
</template>

<script setup lang="tsx" name="SetStyles">
import { computed, onMounted, onUpdated, reactive, ref, watch } from "vue";
import type { Rule } from "ant-design-vue/es/form";

import { CloseOutlined } from "@ant-design/icons-vue";

import { mapCommon } from "@/components/Map/map3d/composables";
import { setLayerStyle } from "@/map/map3d/SetLayerStyle";
import { AnalysisStore } from "@/stores/modules/analysis";

import SetColor from "../set-color/index.vue";
import Slider from "../slider/index.vue";

const analysisStore = AnalysisStore();
const { addLayer, removeLayer } = mapCommon();
const colorRef = ref();
const strokeColorRef = ref();

const validateRexColor = async (_rule: Rule, value: string) => {
	const reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	if (!value) {
		return Promise.reject("请输入正确的十六进制颜色值");
	}
	if (value && !reg.test(value)) {
		return Promise.reject("请输入正确的十六进制颜色值");
	} else {
		return Promise.resolve();
	}
};

interface Props {
	code?: string;
}
const props = withDefaults(defineProps<Props>(), {
	code: ""
});
let originalOptions: any;
watch(props, newValue => {
	// 存储需要设置样式的图层options
	originalOptions = newValue.code && window.map.getLayerById(newValue.code).options;
	console.log("originalOptions", originalOptions);
});

const labelCol = ref({ span: 6 });
const wrapperCol = ref({ span: 16 });
const layout = ref("horizontal");
const form = reactive({
	layerName: props?.code,
	filtersInfo: {
		type: [],
		area: 0,
		cql: "",
		info: {}
	},
	color: "",
	opacity: 1,
	strokeColor: "",
	strokeWidth: 1,
	strokeOpacity: 1,
	overallStyle: {},
	newfiltersInfo: {}
});

const rules: Record<string, Rule[]> = {
	color: [{ validator: validateRexColor, trigger: ["change", "blur"] }],
	strokeColor: [{ validator: validateRexColor, trigger: ["change", "blur"] }]
};
const opacityX100 = ref(100);
const strokeOpacityX100 = ref(100);
const stylesForm = ref();

onMounted(() => {
	opacityX100.value = Math.round(form.opacity * 100);
	strokeOpacityX100.value = Math.round(form.strokeOpacity * 100);
});

onUpdated(() => {
	opacityX100.value = Math.round(form.opacity * 100);
	strokeOpacityX100.value = Math.round(form.strokeOpacity * 100);
});
const showStylesModel = computed(() => analysisStore.showStylesModel);

watch(
	() => [showStylesModel.value, opacityX100.value, strokeOpacityX100.value, form.strokeWidth, form.color, form.strokeColor],
	(newVal: any): void => {
		if (newVal[0]) {
			initData();
		}
		if (newVal[1]) {
			form.opacity = parseInt(newVal[1]) / 100;
		}
		if (newVal[2]) {
			form.strokeOpacity = parseInt(newVal[2]) / 100;
		}
		if (newVal[3]) {
			form.strokeWidth = newVal[3];
		}
		if (newVal[4]) {
			form.color = newVal[4];
		}
		if (newVal[5]) {
			form.strokeColor = newVal[5];
		}
	}
);

const onReset = () => {
	stylesForm.value.resetFields();
	opacityX100.value = 100;
	strokeOpacityX100.value = 100;
	Object.assign(form, getInitStyle());
	resetMap(form);
};

const onApply = () => {
	stylesForm.value
		.validate()
		.then(async () => {
			const { layerName } = form;
			// @ts-ignore
			const { url, parameters, mergeOptions } = await setLayerStyle().setStyle({
				originalOptions,
				serviceType: originalOptions.name,
				...form
			});
			removeLayer({ map: window.map, id: layerName });
			await addLayer({
				map: window.map,
				id: layerName,
				url,
				parameters,
				serviceType: originalOptions.name,
				zIndex: originalOptions.zIndex,
				flyTo: true
			});
			// 将修改样式前的options参数和修改后options合并，目的为了保留用户参数
			window.map.getLayerById(layerName).options = mergeOptions;
		})
		.catch((err: any) => {
			console.log("error", err);
		});
};
const resetMap = (form: any) => {
	removeLayer({ map: window.map, id: form.layerName });
	addLayer({
		map: window.map,
		id: form.layerName,
		url: originalOptions.userData.orginalUrl,
		serviceType: originalOptions.name,
		zIndex: originalOptions.zIndex,
		flyTo: true
	});
};

const onClose = () => {
	analysisStore.setShowStylesModel(false);
	onReset();
};

// 地图功能
// 重置
// const reset = ({ id }: any) => {
// 	removeLayer({
// 		map: window.map,
// 		id
// 	});
// };

const initData = () => {
	try {
		Object.assign(form, getInitStyle());
		// 获取该图层样式数据
		let styleData;
		if (styleData !== undefined) {
			Object.assign(form, setForm(styleData));
		}
	} catch {}
};

const getInitStyle = () => {
	return {
		layerName: props.code,
		filtersInfo: {
			type: [],
			area: 0,
			cql: "",
			info: {}
		},
		color: "#364c70",
		opacity: 1,
		strokeColor: "#364c70",
		strokeWidth: 1,
		strokeOpacity: 1
	};
};

const setForm = (data: any) => {
	const { layerName, filtersInfo, color, opacity, strokeColor, strokeWidth, strokeOpacity } = data;
	return {
		layerName: layerName || props.code,
		filtersInfo: {
			type: filtersInfo.type || [],
			area: filtersInfo.area || 0,
			cql: filtersInfo.cql || "",
			info: filtersInfo.info || {}
		},
		color: color || "",
		opacity: opacity || 1,
		strokeColor: strokeColor || "",
		strokeWidth: strokeWidth || 1,
		strokeOpacity: strokeOpacity || 1
	};
};
</script>

<style lang="less" scoped>
.styles-wrapper {
	position: absolute;
	top: 176px;
	left: 382px;
	// width: 256px;
	height: auto;
	background: var(--pt-bg-color-white);
	border: 1px solid var(--pt-border-color-normal);
	transition: transform 0.25s;

	.styles-btn {
		margin: 30px 0;
		text-align: center;
	}

	.item-title {
		margin-bottom: 7px;
		color: var(--pt-text-color-stair-light);
	}
}
</style>
<style lang="less">
.styles-wrapper {
	color: var(--pt-text-color-stair-light);

	.ant-card {
		background: transparent;
		border: none;

		.ant-card-head {
			height: 28px;
			min-height: 28px;
			padding: 0 0 0 11px;
			color: var(--pt-text-color-stair-light);
			background: var(--light-header-bg-color);
			border: none;

			.ant-card-head-wrapper {
				height: 100%;

				.ant-card-head-title {
					padding: 4px 0;
					color: var(--pt-text-color-stair-light);
				}
			}
		}

		.ant-card-extra {
			padding: 0;
		}

		.ant-card-body {
			.ant-form {
				.ant-form-item {
					height: 100%;
					min-height: 25px;
					margin-bottom: 10px;

					.ant-input {
						height: 24px;
					}

					.color-btn {
						width: 18px;
						height: 18px;
						margin: 2px;
					}

					.mod-transparent {
						height: 24px;
						line-height: 30px;

						background: transparent;
						border: none;
					}
				}

				.ant-form-item-label {
					text-align: left;

					> label {
						color: var(--pt-text-color-stair-light) !important;
					}
				}

				.ant-form-item-control-wrapper {
					color: var(--pt-text-color-stair-light);

					.data-filters-wrapper {
						margin-top: 5px;
					}
				}

				.ant-form-item-control,
				.ant-form-item-label {
					line-height: 25px;
				}
			}

			.d-button > .button {
				width: 90px;
				height: 25px;
				line-height: 25px;
			}

			.ant-input::-webkit-input-placeholder {
				font-size: 1rem;
			}
		}
	}
}
</style>
