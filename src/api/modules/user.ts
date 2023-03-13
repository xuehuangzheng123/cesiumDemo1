import http from "@/api";
import { SA } from "@/api/config/servicePort";
import { User } from "@/api/interface/index";

/**
 * @name 用户管理模块
 */
// * 获取用户列表
export const getUserMessApi = (params: { id: string }) => {
	return http.get<User.ResUserDetail>(SA + `/api/management/user/${params.id}`);
};
