<template>
	<a-breadcrumb>
		<a-breadcrumb-item v-for="(item, index) of breadcrumbData" :key="index">
			<router-link v-if="item.path && index < breadcrumbData.length - 1" :to="item.path">{{ item.name }}</router-link>
			<span v-else>{{ item.name }}</span>
		</a-breadcrumb-item>
	</a-breadcrumb>
</template>
<script setup lang="ts" name="Breadcrumb">
// 限制数组对象类型
type CustomerType = {
	name: string;
	path: string;
	[propName: string]: number | string | boolean | Array<string>;
};
// 设置props数据类型和字段名称
interface Props {
	breadcrumbData: Array<CustomerType>;
}
// 设置默认值，list数组默认值，采用函数返回值，类似于vue2中的default:()=>{ return []}
withDefaults(defineProps<Props>(), {
	breadcrumbData: function (): Array<CustomerType> {
		return [];
	}
});
</script>
<style scoped lang="less">
@import "./index.less";
</style>
