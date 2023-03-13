<template>
	<a-sub-menu :key="menuInfo.path">
		<template v-if="menuInfo.meta.icon" #icon>
			<SvgIcon :name="selectedKeys.includes(menuInfo.path) ? menuInfo.meta.icon + '-checked' : menuInfo.meta.icon" />
		</template>
		<template #title>{{ menuInfo.meta.title }}</template>
		<template v-for="item in menuInfo.children" :key="item.path">
			<template v-if="!item.children">
				<a-menu-item :key="item.path">
					<template v-if="item.meta.icon" #icon>
						<SvgIcon :name="selectedKeys.includes(item.path) ? item.meta.icon + '-checked' : item.meta.icon" />
					</template>
					{{ item.meta.title }}
				</a-menu-item>
			</template>
			<template v-else>
				<sub-menu :menu-info="item" :selectedKeys="selectedKeys" :key="item.path" />
			</template>
		</template>
	</a-sub-menu>
</template>
<script setup lang="ts" name="SubMenu">
import SvgIcon from "@/components/SvgIcon/index.vue";
defineProps<{
	menuInfo: Menu.MenuOptions;
	selectedKeys: string[];
}>();
</script>
