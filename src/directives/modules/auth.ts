/**
 * v-auth
 * @desc 按钮权限指令
 * @eg 写法一：v-auth="['preview']"
 *     写法二：v-auth="'preview'"
 */
import type { Directive, DirectiveBinding } from "vue";

import { AuthStore } from "@/stores/modules/auth";

const auth: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { value } = binding;
		const authStore = AuthStore();
		const currentPageRoles = authStore.authButtonListGet[authStore.routeName] ?? [];
		if (value instanceof Array && value.length) {
			const hasPermission = value.every(item => currentPageRoles.includes(item));
			if (!hasPermission) el.remove();
		} else {
			if (!currentPageRoles.includes(value)) el.remove();
		}
	}
};

export default auth;
