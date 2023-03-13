<template>
	<div class="pt-orgtree h-100%">
		<div class="pt-search" v-if="isSearch">
			<a-input-search
				v-model:value="searchValue"
				:placeholder="props.placeholder"
				@search="$emit('search', $event)"
				allow-clear
			/>
		</div>

		<div class="pt-tree overflow-y-auto">
			<a-tree
				v-if="props.treeData.length"
				v-model:search-value="searchValue"
				:expanded-keys="props.expandedKeys"
				@update:expanded-keys="(evt: any) => $emit('update:expandedKeys', evt)"
				:selected-keys="props.selectedKeys"
				@update:selected-keys="(evt: any) => $emit('update:selectedKeys', evt)"
				:checked-keys="props.checkedKeys"
				@update:checked-keys="(evt: any) => $emit('update:checkedKeys', evt)"
				:class="{ 'pt-tree-show-icon': props.treeShowIcon }"
				:tree-data="props.treeData"
				:show-icon="props.treeShowIcon"
				:field-names="props.fieldNames"
				@select="onSelect"
				default-expand-all
				block-node
				:checkable="props.checkable"
				@check="onCheck"
			>
				<template #title="{ dataRef, data }">
					<div class="pt-node-title flex items-center justify-between">
						<div class="pt-title sle">{{ dataRef[nodeTitle] }}</div>

						<div v-if="props.treeHasAction" class="pt-actions w-80px ml10px lh-0 invisible">
							<span
								class="pt-btn hover:color-[var(--pt-primary-color-hover)] focus:color-[var(--pt-primary-color-focus)]"
								@click.stop="onAdd(dataRef)"
								><SvgIcon name="add" :icon-style="{ width: '16px', height: '16px', fill: 'currentColor' }"
							/></span>
							<template v-if="!props.treeData.includes(data)">
								<span
									class="pt-btn hover:color-[var(--pt-primary-color-focus)] focus:color-[var(--pt-primary-color-focus)]"
									@click.stop="onEdit(dataRef)"
									><SvgIcon name="edit" :icon-style="{ width: '16px', height: '16px', fill: 'currentColor' }"
								/></span>
								<span
									class="pt-btn hover:color-[var(--pt-primary-color-focus)] focus:color-[var(--pt-primary-color-focus)]"
									@click.stop="onDelete(dataRef)"
									><SvgIcon name="delete" :icon-style="{ width: '16px', height: '16px', fill: 'currentColor' }"
								/></span>
							</template>
						</div>
						<template v-if="props.treeHasEye">
							<div v-if="!dataRef.children" class="pt-actions w-40px">
								<eye-outlined v-if="dataRef.isShow" @click="openEye(dataRef, false)" />
								<eye-invisible-outlined v-else @click="openEye(dataRef, true)" />
								<a-popover placement="right" trigger="click">
									<template #content>
										<template v-if="!props?.treeHasConfig">
											<a-popover placement="right" trigger="click">
												<template #content>
													<div class="f-c-c">
														<Slider
															class="mx-10px w-100px"
															:value="dataRef.opacity"
															:min="0"
															:max="100"
															@change="onChangeTransparent($event, dataRef)"
														/>
													</div>
												</template>
												<div class="flex items-center mb-10 cursor-pointer">
													<img src="@/assets/icons/opacity.svg" alt="" class="mr-10" />
													<div class="">透明度</div>
												</div>
											</a-popover>
											<div class="flex items-center cursor-pointer" @click="analysisStore.setShowStylesModel(true)">
												<img src="@/assets/icons/style.svg" alt="" class="mr-10" />
												<div class="">样式设置</div>
											</div>
										</template>
										<template v-else>
											<div class="flex items-center cursor-pointer" @click="analysisStore.setShowAttrModel(true)">
												<setting-outlined class="mr-10" />
												<div class="">属性设置</div>
											</div>
										</template>
									</template>
									<more-outlined class="ml-10px" />
								</a-popover>
							</div>
						</template>
					</div>
				</template>

				<template #icon="{ children, expanded }">
					<template v-if="children">
						<FolderOpenFilled v-if="expanded" />
						<FolderFilled v-else />
					</template>
					<template v-else>
						<FileFilled />
					</template>
				</template>
			</a-tree>
		</div>
	</div>
</template>

<script setup lang="tsx" name="SearchTree">
import { computed } from "vue";
import { TreeProps } from "ant-design-vue";
import { DataNode, EventDataNode, Key } from "ant-design-vue/lib/vc-tree/interface";
import { CheckInfo } from "ant-design-vue/lib/vc-tree/props";

import {
	EyeInvisibleOutlined,
	EyeOutlined,
	FileFilled,
	FolderFilled,
	FolderOpenFilled,
	MoreOutlined,
	SettingOutlined
} from "@ant-design/icons-vue";

import SvgIcon from "@/components/SvgIcon/index.vue";
import { AnalysisStore } from "@/stores/modules/analysis";
import Slider from "@/views/analysis/components/slider/index.vue";

const analysisStore = AnalysisStore();

interface SearchTreeProps {
	searchValue?: string;
	isSearch?: boolean;
	placeholder?: string;
	fieldNames?: TreeProps["fieldNames"];
	treeData?: TreeProps["treeData"];
	expandedKeys?: TreeProps["expandedKeys"];
	selectedKeys?: TreeProps["selectedKeys"];
	checkedKeys?: TreeProps["checkedKeys"];
	treeHasAction?: boolean;
	treeShowIcon?: boolean;
	checkable?: boolean;
	treeHasEye?: boolean;
	treeHasConfig?: boolean;
}
const props = withDefaults(defineProps<SearchTreeProps>(), {
	searchValue: "",
	isSearch: true,
	placeholder: "placeholder 默认值",
	treeData: () => [],
	treeHasAction: false,
	treeShowIcon: false,
	checkable: false,
	treeHasEye: false,
	treeHasConfig: false
});
const nodeTitle = computed(() => {
	let result = "title";
	if (props.fieldNames && props.fieldNames.title) {
		result = props.fieldNames.title;
	}

	return result;
});

const emit = defineEmits<{
	(e: "search", value: string): void;
	(e: "add", value: DataNode): void;
	(e: "edit", value: DataNode): void;
	(e: "delete", value: DataNode): void;
	(
		e: "select",
		selectedKeys: Key[],
		info: {
			event: "select";
			selected: boolean;
			node: EventDataNode;
			selectedNodes: DataNode[];
			nativeEvent: MouseEvent;
		}
	): void;
	(e: "update:searchValue", value: string): void;
	(e: "update:expandedKeys", value: string): void;
	(e: "update:selectedKeys", value: string): void;
	(e: "update:checkedKeys", value: string): void;
	(e: "check", checked: Key[] | { checked: Key[]; halfChecked: Key[] }, info: CheckInfo): void;
	(e: "changeTransparent", value: DataNode, val: number): void;
	(e: "openEye", value: DataNode, visible: boolean): void;
}>();
const searchValue = computed({
	get() {
		return props.searchValue;
	},
	set(value: string) {
		emit("update:searchValue", value);
	}
});

type ArgType = Parameters<NonNullable<TreeProps["onSelect"]>>;
const onSelect: TreeProps["onSelect"] = (...args: ArgType) => {
	emit("select", ...args);
};

const onAdd = (dataNode: DataNode) => {
	emit("add", dataNode);
};

const onEdit = (dataNode: DataNode) => {
	emit("edit", dataNode);
};

const onDelete = (dataNode: DataNode) => {
	emit("delete", dataNode);
};

type ArgTypes = Parameters<NonNullable<TreeProps["onCheck"]>>;
const onCheck: TreeProps["onCheck"] = (...args: ArgTypes) => {
	emit("check", ...args);
};

//设置显影
const openEye = (dataNode: DataNode, visible: boolean) => {
	emit("openEye", dataNode, visible);
};

//设置透明度
const onChangeTransparent = (val: any, dataNode: DataNode) => {
	emit("changeTransparent", dataNode, val);
};
</script>

<style scoped lang="less">
.pt-orgtree {
	display: flex;
	flex-direction: column;
	background-color: var(--pt-bg-color-page);
	width: 327px;
	border-radius: var(--pt-radius-sm);
	padding: var(--pt-spacer-md);

	> div + div {
		margin-top: var(--pt-spacer-md);
	}

	.pt-tree {
		flex: 1;
	}

	.pt-btn {
		& + .pt-btn {
			margin-left: 10px;
		}
	}

	.pt-node-title {
		&:hover {
			.pt-actions {
				visibility: visible;
			}
		}
	}
}
</style>

<style lang="less">
.pt-orgtree {
	.ant-tree-show-line .ant-tree-indent-unit::before {
		display: none;
	}

	.ant-tree .ant-tree-treenode {
		width: 100%;
	}

	.pt-tree-show-icon {
		.ant-tree-node-content-wrapper {
			display: flex;
		}

		.ant-tree-title {
			flex: 1;
		}

		.ant-tree-iconEle {
			color: #ffcc66;
		}
	}
}
</style>
