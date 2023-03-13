import { createApp, Directive, DirectiveBinding } from "vue";

import { Spin } from "@potato/antd";

type VueEl = HTMLElement & { maskEl: HTMLElement; fullscreen: boolean };

const relativeCls = "relative";
const loadingDirective: Directive = {
	// 指令挂载时的钩子函数
	mounted(el: VueEl, binding: DirectiveBinding) {
		el.fullscreen = binding.modifiers.fullscreen;
		let spinType = "form";
		if (binding.modifiers.page) spinType = "page";
		if (binding.modifiers.form) spinType = "form";
		const app = createApp(Spin, { type: spinType });
		const maskEl = document.createElement("div");
		maskEl.classList.add("pt-spin-mask");

		const instance = app.mount(document.createElement("div"));
		maskEl.append(instance.$el);
		el.maskEl = maskEl;
		if (binding.value) {
			append(el);
		}
	},

	// 当组件更新的时候执行，因为指令不是一成不变的
	// 比如由v-loading=true变为v-loading=false 就会执行
	updated(el: any, binding: DirectiveBinding) {
		// 如果loading前后值不一致
		if (binding.value !== binding.oldValue) {
			// 如果是true那么就插入否则删除
			binding.value ? append(el) : remove(el);
		}
	}
};

function addClass(el: HTMLElement, className: string) {
	// 如果当前元素样式列表中没有className
	if (!el.classList.contains(className)) {
		el.classList.add(className);
	}
}

function removeClass(el: HTMLElement, className: string) {
	el.classList.remove(className);
}

// 元素挂载的操作
function append(el: VueEl) {
	// 根据loading组件样式，是使用absolute，而当el不是fixed或retaive时候给其动态添加定位属性
	const style = getComputedStyle(el);
	// 判断el的样式中有无定位，===-1就是没有 希望v-loading不受样式限制
	if (["absolute", "fixed", "relative"].indexOf(style.position) === -1) {
		addClass(el, relativeCls);
	}

	if (el.fullscreen) document.body.append(el.maskEl);
	else el.appendChild(el.maskEl);
}

function remove(el: VueEl) {
	removeClass(el, relativeCls);
	if (el.fullscreen) document.body.removeChild(el.maskEl);
	else el.removeChild(el.maskEl);
}

export default loadingDirective;
