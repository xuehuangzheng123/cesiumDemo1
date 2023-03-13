import http from "@/api";
import { DATAGAEAETLS, KERNEL, QQ } from "@/api/config/servicePort";

import { MapData } from "../interface";

// 获取免切片坐标系
export const getWimgESPG = (params: MapData.WimgESPGParamsItf) => {
	return http.get<any>(KERNEL + "/api/sense/getJsonById", params);
};
export const characteristic = (params: MapData.characteristic) => {
	return http.post<any>(DATAGAEAETLS + "/v1/api/stats/Characteristic", params);
};

// 获取行政区划数据
export const getAreaTreeDataApi = (params: any) => {
	return http.get(QQ + `/api/dataAnalyse/areaTree`, params);
};

// 获取行政区服务
export const getAreaServerApi = (params: any) => {
	return http.get<any>(QQ + `/api/serviceManage/serviceUrl`, params);
};
