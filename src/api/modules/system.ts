import http from "@/api";
import { QQ } from "@/api/config/servicePort";
import { ResPage, System } from "@/api/interface/index";

// * 获取字典数据
export const getDicListApi = (params: System.ReqDicList) => {
	return http.get<ResPage<System.ResDicList>>(QQ + `/api/system/syszd`, params);
};
