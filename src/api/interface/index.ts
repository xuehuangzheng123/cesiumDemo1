// * 请求响应参数(不包含data)
export interface Result {
	code: number;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

// * 分页响应参数
export interface ResPage<T> {
	list: T[];
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNo?: number;
	pageSize?: number;
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
		remember: boolean;
		client: string;
	}
	export interface ResLogin {
		access_token: string;
		token_type: string;
		refresh_token: string;
		expires_in: number;
		scope: string;
		active: true;
		clientId: string;
		avatar: string;
		userId: number;
		username: string;
		tokenInfo: object;
	}
	export interface ResAuthButtons {
		[key: string]: string[];
	}
	interface MenuData {
		id: string;
		parentId: string;
		weight: number;
		name: string;
		icon?: any;
		description?: any;
		sort: number;
		type: number;
		url?: any;
		children?: MenuData[];
	}

	export type ResAuthMenus = MenuData[];

	export interface ReqAuthMenu {
		id: string;
		search?: string;
	}
}

// 应用
export namespace App {
	interface AppData {
		id: string;
		parentId: string;
		weight: number;
		name: string;
		icon?: any;
		description?: any;
		sort: number;
		type: number;
		url?: any;
		children?: AppData[];
	}
	export interface ResAppList {
		[propName: string]: AppData;
	}
}

// 系统
export namespace System {
	export interface ReqDicList extends ReqPage {
		parentValue?: string;
		label?: string;
	}

	interface ResDicItem {
		id: number;
		value: string;
		label: string;
		parentValue: string;
		describe?: any;
		remark?: any;
		createTime?: any;
	}

	export type ResDicList = ResDicItem[];
}

// * 用户管理模块
export namespace User {
	export interface ResUserDetail {
		id: number;
		username: string;
		fullName: string;
		password: string;
		passwordComplexity: number;
		email: string;
		tel: string;
		avatar: string;
		state: number;
		tenantId: string;
		desc: string;
		createUser: string;
		createTime: string;
		updateUser: string;
		updateTime: string;
		dept?: any;
		role?: any;
		orgList: string[];
		roleList: string[];
		tree: MenuTree[];
	}
	interface MenuTree {
		id: string;
		parentId?: any;
		weight: number;
		name: string;
		flag: string;
		icon?: any;
		description?: any;
		createUser: string;
		sort: number;
		type: number;
		url: string;
		children?: MenuTree[];
	}
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		fileUrl: string;
	}

	export interface ReqOnlinePreviewUrl {
		bucketName: string;
		objectName: string;
	}

	export interface ResOnlinePreviewUrl {
		url: string;
		previewHost: string;
	}
}

// 地图模块
export namespace MapData {
	export interface WimgESPGParamsItf {
		id: string;
	}
	export interface characteristic {
		list: any;
		geomWkt: any;
	}
}

// 编目管理
export namespace Catalog {
	export interface ResCatalogTree {
		key: string | number;
		id: number;
		parentId: number | null;
		weight: number;
		name: string;
		code: string;
		children?: ResCatalogTree[] | undefined;
	}

	export interface CatalogParams {
		parentCode: string;
		name?: string;
		nodeType?: number; // 节点类型，1树，2叶子节点
	}

	export interface ReqCatalogListParams extends ReqPage {
		parentId: number;
		status?: number;
	}

	export interface CatalogItem {
		id: number;
		code: string;
		name: string;
		type: string;
		bath?: any;
		desc?: any;
		parentId: number;
		sort: number;
		status: number; // 状态，0启用，1禁用
		createUser: string;
		createTime: string;
	}

	export interface DictItem {
		id: number;
		dictCode: string;
		value: string;
		label: string;
		description: string;
		remarks: string;
		deleteFlag: number;
		tenantId: number;
	}

	export interface ReqAddCatalogParams {
		name: string;
		code: string;
		desc?: string;
		dataType?: string; // 数据类型，取数据字典的value
		nodeType?: number; // 节点类型，1树，2叶子节点
		parentId?: number | null; // 父级节点id
	}
	export interface RedEditCatalogParams {
		id: number | null;
		name?: string;
		desc?: string;
		status?: number;
	}
}

// [propName: string]: any; //其他没有使用的属性名 可以统一使用[propName: string]: number | string | boolean | Array<string>;定义类型 属性值的类型是把所有的类型都展示
