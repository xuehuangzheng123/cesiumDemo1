<template>
	<div v-if="showAttrModel" class="attrs-wrapper">
		<a-card class="w-100% b-none">
			<div class="f-b-c p-16px pb-0px">
				<span class="text-18px">属性设置</span>
				<CloseOutlined class="text-16px mr-10px" @click="onClose" />
			</div>
			<div class="p-20px pb-0px">
				<a-table :columns="columns" :data-source="attrList" :pagination="tablePagination" @change="onChangeTable" bordered>
					<template #bodyCell="{ column, record }">
						<template v-if="column.dataIndex === 'attr'">
							<a-checkbox-group v-model:value="record.attr" name="checkboxgroup" :options="attrOptions" />
						</template>
					</template>
				</a-table>
			</div>
			<div class="styles-btn">
				<a-button class="mr-20px" @click="onReset">重置</a-button>
				<a-button type="primary" @click="onApply">应用</a-button>
			</div>
		</a-card>
	</div>
</template>

<script setup lang="tsx" name="SetAttr">
import { computed, onMounted, reactive, ref } from "vue";
import { TablePaginationConfig } from "ant-design-vue";
import { PaginationConfig } from "ant-design-vue/es/pagination";

import { CloseOutlined } from "@ant-design/icons-vue";

import { AnalysisStore } from "@/stores/modules/analysis";
const analysisStore = AnalysisStore();

const showAttrModel = computed(() => analysisStore.showAttrModel);

const columns = [
	{
		title: "属性名称",
		dataIndex: "name",
		width: "150px",
		ellipsis: true
	},
	{
		title: "配置项",
		dataIndex: "attr",
		width: "200px"
	}
];
const attrOptions = [
	{ label: "显示", value: "1" },
	{ label: "查询", value: "2" },
	{ label: "统计", value: "3" }
];
const tablePagination = reactive<TablePaginationConfig>({
	current: 1,
	pageSize: 10,
	total: 0,
	showTotal(total) {
		return `共 ${total} 条数据`;
	},
	showSizeChanger: true,
	showQuickJumper: true
});
const attrList = ref([
	{ name: "实体唯一标识码", attr: "1" },
	{ name: "图斑编号", attr: "1" },
	{ name: "乡镇级行政区名称", attr: "1" },
	{ name: "地类名称", attr: "1" },
	{ name: "耕地等级", attr: "1" },
	{ name: "种植属性代码", attr: "1" }
]);
// const getAttrList = async () => {};
const onChangeTable = (pagination: PaginationConfig) => {
	const { current, pageSize } = pagination;
	tablePagination.current = current;
	tablePagination.pageSize = pageSize;
	// getAttrList();
};
onMounted(() => {
	// getAttrList();
});

const onClose = () => {
	analysisStore.setShowAttrModel(false);
};

const onApply = () => {
	onClose();
};
const onReset = () => {
	onClose();
};
</script>
<style lang="less" scoped>
.attrs-wrapper {
	position: absolute;
	top: 156px;
	left: 612px;
	width: 500px;
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
	}
}
</style>
