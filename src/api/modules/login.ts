// import qs from "qs";
import http from "@/api";
import { SA } from "@/api/config/servicePort";
import { Login } from "@/api/interface/index";
// import AuthButtons from "@/assets/json/authButtons.json";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(SA + `/api/application/authentication/signin`, params, {
		headers: { noLoading: true }
	}); // 正常 post json 请求  ==>  application/json
	// return http.post<Login.ResLogin>(SA + `/oauth/token`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	// return http.post<Login.ResLogin>(SA + `/login`, qs.stringify(params)); // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	// return http.post<Login.ResLogin>(SA + `/login`, params, { headers: { noLoading: true } }); // 控制当前请求不显示 loading
};

// * 用户登出接口
export const loginOutApi = (params?: any) => {
	return http.delete(SA + `/api/management/user/logout`, params, { headers: { noLoading: true } });
};

// * 获取按钮权限
export const getAuthButtonListApi = (params: any) => {
	return http.get<Login.ResAuthButtons>(SA + `/api/management/user/getRoleCode`, params, { headers: { noLoading: true } });
	// 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtons.json 数据
	// return AuthButtons;
};

// * 获取菜单列表
export const getAuthMenuListApi = (params: Login.ReqAuthMenu) => {
	return http.get<Login.ResAuthMenus[]>(SA + `/api/management/resource/listMenu`, params, { headers: { noLoading: true } });
};
