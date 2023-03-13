import http from "@/api";
import { QQ, SA } from "@/api/config/servicePort";

import { Catalog, ReqPage, ResPage } from "../interface";

/**
 * @name 编目管理请求模块
 */
// 类型字典接口
export function getTypeDict(params: { dictCode: string } & ReqPage) {
	return http.get<ResPage<Catalog.DictItem>>(SA + "/api/dictItem", params);
}

// 编目树列表
export function getCatalogList(params: Catalog.ReqCatalogListParams) {
	return http.get<ResPage<Catalog.CatalogItem>>(QQ + "/api/catalog", params);
}

// 编目树查询
export function getCatalogTree(params: Catalog.CatalogParams) {
	return http.get<Catalog.ResCatalogTree[]>(QQ + "/api/catalog/catalogTree", params);
}

// 新增编目
export function addCatalog(params: Catalog.ReqAddCatalogParams) {
	return http.post(QQ + "/api/catalog", params);
}

// 修改编目
export function editCatalog(params: Catalog.RedEditCatalogParams) {
	return http.patch(QQ + "/api/catalog", params);
}

// 删除编目
export function deleteCatalog(params: { id: string }) {
	return http.delete(QQ + "/api/catalog" + `/${params.id}`);
}
