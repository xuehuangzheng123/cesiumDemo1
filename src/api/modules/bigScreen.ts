import http from "@/api";
import { QQ, REG } from "@/api/config/servicePort";

import { ResPage } from "../interface";

// 大屏页面请求模块
// 获取数据概览数据
export interface DataPreviewParams {
	cityId?: string;
	countyId?: string;
	provinceId?: string;
}
export interface StatItem {
	value?: any;
	label: string;
	num: number;
	unit: string;
}
export const getDataPreviewApi = (params?: DataPreviewParams) => {
	return http.get<StatItem[]>(`${REG}/api/dataAnalyse/dataPreview`, params);
};

// 获取工作进展数据
interface WorkProgressParams {
	pageNo?: string | number;
	pageSize?: string | number;
	parentValue?: string;
}
export interface StatRecordItem {
	id: number;
	value: string;
	label: string;
	parentValue: string;
	describe: string;
	remark: string;
	createTime: string;
}
export const getWorkProgressApi = (params?: WorkProgressParams) => {
	return http.get<ResPage<StatRecordItem>>(`${QQ}/api/syszd`, params);
};

// 业务审批
export const getBizAuditApi = (params?: DataPreviewParams) => {
	return http.get<StatItem[]>(`${REG}/api/dataAnalyse/generalResult`, params);
};

// 确权统计

export const getQqStatApi = (params?: DataPreviewParams & { type: "1" | "2" /* 统计类型，1单元类型，2权属统计 */ }) => {
	return http.get<StatItem[]>(`${REG}/api/dataAnalyse/qqResult`, params);
};

// 资金拨付 parentValue = zjbf
export const geFundPayApi = (params?: { parentValue?: string }) => {
	return http.get<ResPage<StatRecordItem>>(`${QQ}/api/syszd`, params);
};
