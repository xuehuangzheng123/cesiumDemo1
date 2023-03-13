import http from "@/api";
import { SA } from "@/api/config/servicePort";
import { App } from "@/api/interface/index";

// * 根据用户id获取用户所有菜单
export const getAppList = (userId: number) => {
	return http.get<App.ResAppList>(SA + `/api/management/user/userResource/${userId}`);
};
