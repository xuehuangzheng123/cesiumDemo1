import { message as Message, Modal } from "ant-design-vue";

/**
 * @description 操作单条数据信息(二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法(必传)
 * @param {Object} params 携带的操作数据参数 {id,params}(必传)
 * @param {String} message 提示信息(必传)
 * @return Promise
 */
export const useHandleData = <P = any, R = any>(
	api: (params: P) => Promise<R>,
	params: Parameters<typeof api>[0],
	message: string
) => {
	return new Promise((resolve, reject) => {
		Modal.confirm({
			title: "温馨提示",
			content: `是否${message}?`,
			okText: "确定",
			cancelText: "取消",
			async onOk() {
				const res = await api(params);
				if (!res) return reject(false);
				Message.success(`${message}成功!`);
				resolve(true);
			}
		});
	});
};
