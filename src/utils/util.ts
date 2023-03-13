import { isArray } from "@/utils/is";

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export function localGet(key: string) {
	const value = window.localStorage.getItem(key);
	try {
		return JSON.parse(window.localStorage.getItem(key) as string);
	} catch (error) {
		return value;
	}
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export function localSet(key: string, value: any) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export function localRemove(key: string) {
	window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @return void
 */
export function localClear() {
	window.localStorage.clear();
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function isType(val: any) {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
	if (!a || !b) return false;
	let aProps = Object.getOwnPropertyNames(a);
	let bProps = Object.getOwnPropertyNames(b);
	if (aProps.length != bProps.length) return false;
	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];
		let propA = a[propName];
		let propB = b[propName];
		if (!b.hasOwnProperty(propName)) return false;
		if (propA instanceof Object) {
			if (!isObjectValueEqual(propA, propB)) return false;
		} else if (propA !== propB) {
			return false;
		}
	}
	return true;
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}

/**
 * @description 获取当前时间
 * @return string
 */
export function getTimeState() {
	// 获取当前时间
	let timeNow = new Date();
	// 获取当前小时
	let hours = timeNow.getHours();
	// 判断当前时间段
	if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
	if (hours >= 10 && hours <= 14) return `中午好 🌞`;
	if (hours >= 14 && hours <= 18) return `下午好 🌞`;
	if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
	if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh";
	} else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
}

/**
 * @description 递归查询当前路由所对应的路由
 * @param {Array} menuList 所有菜单列表
 * @param {String} path 当前访问地址
 * @return array
 */
export function filterCurrentRoute(menuList: Menu.MenuOptions[], path: string) {
	let result = {};
	for (let item of menuList) {
		if (item.path === path) return item;
		if (item.children) {
			const res = filterCurrentRoute(item.children, path);
			if (Object.keys(res).length) result = res;
		}
	}
	return result;
}

/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatArr(menulist: Menu.MenuOptions[]) {
	return menulist.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 使用递归，过滤需要缓存的路由
 * @param {Array} menuList 所有菜单列表
 * @param {Array} cacheArr 缓存的路由菜单 name ['**','**']
 * @return array
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveArr: string[] = []) {
	menuList.forEach(item => {
		item.meta.isKeepAlive && item.name && keepAliveArr.push(item.name);
		item.children?.length && getKeepAliveRouterName(item.children, keepAliveArr);
	});
	return keepAliveArr;
}

/**
 * @description 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.filter(item => {
		item.children?.length && (item.children = getShowMenuList(item.children));
		return !item.meta?.isHide;
	});
}

/**
 * @description 使用递归处理路由菜单 path，生成一维数组(第一版本地路由鉴权会用到)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @return array
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []) {
	menuList.forEach((item: Menu.MenuOptions) => {
		typeof item === "object" && item.path && menuPathArr.push(item.path);
		item.children?.length && getMenuListPath(item.children, menuPathArr);
	});
	return menuPathArr;
}

/**
 * @description 使用递归，过滤出当前路径匹配的面包屑地址
 * @param {String} path 当前访问地址
 * @param {Array} menuList 所有菜单列表
 * @returns array
 */
export function getCurrentBreadcrumb(path: string, menuList: Menu.MenuOptions[]) {
	let tempPath: Menu.MenuOptions[] = [];
	try {
		const getNodePath = (node: Menu.MenuOptions) => {
			tempPath.push(node);
			if (node.path === path) throw new Error("Find IT!");
			if (node.children?.length) node.children.forEach(item => getNodePath(item));
			tempPath.pop();
		};
		menuList.forEach(item => getNodePath(item));
	} catch (e) {
		return tempPath;
	}
}

/**
 * @description 双重递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @returns array
 */
export function getAllBreadcrumbList(menuList: Menu.MenuOptions[]) {
	let handleBreadcrumbList: { [key: string]: any } = {};
	const loop = (menuItem: Menu.MenuOptions) => {
		if (menuItem?.children?.length) menuItem.children.forEach(item => loop(item));
		else handleBreadcrumbList[menuItem.path] = getCurrentBreadcrumb(menuItem.path, menuList);
	};
	menuList.forEach(item => loop(item));
	return handleBreadcrumbList;
}

/**
 * @description 格式化表格单元格默认值(el-table-column)
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {String} callValue 当前单元格值
 * @return string
 * */
export function defaultFormat(row: number, col: number, callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 处理无数据情况
 * @param {String} callValue 需要处理的值
 * @return string
 * */
export function formatValue(callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 枚举列表
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
export function filterEnum(callValue: any, enumData: any, searchProps?: { [key: string]: any }, type?: string): string {
	const value = searchProps?.value ?? "value";
	const label = searchProps?.label ?? "label";
	let filterData: any = {};
	if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}

/**
 * @description 获取CSS自定义属性值
 * @param {String} varname CSS自定义属性名
 * @returns string
 */
export function getCssVarValue(varname: string) {
	const styles = window.getComputedStyle(document.documentElement);
	return styles.getPropertyValue(varname).trim();
}

/**
 * @description 过滤对象中的空值，如：undefined, null, ''
 * @param {Object} sourceObj 源对象
 * @returns object
 */
export function filterNullProp<T extends object>(sourceObj: T): T {
	const NULL_VALUE = [undefined, null, ""];
	const targetObj = Object.assign({}, sourceObj);

	Object.keys(targetObj).forEach(key => {
		const value = targetObj[key as keyof T];
		if (NULL_VALUE.includes(value as any)) {
			delete targetObj[key as keyof T];
		}
	});

	return targetObj;
}

/**
 * @description 格式化权限菜单数据
 * @param {[object]} list 菜单数据
 * @returns array
 */
export const formatMenuData = (list: any) => {
	let tempArr = list;
	const handleMoveAttr = (arr: any) => {
		for (let item of arr) {
			Object.assign(item, {
				path: item.url,
				title: item.name,
				name: item.id,
				meta: item.config
			});
			Object.assign(item.meta, {
				icon: item.icon,
				title: item.title
			});
			for (let k in item) {
				if (!["path", "name", "component", "meta", "props", "children", "redirect"].includes(k)) {
					delete item[k];
				}
			}
			if ("props" in item.meta) {
				item.props = item.meta.props;
				delete item.meta.props;
			}
			if ("redirect" in item.meta) {
				item.redirect = item.meta.redirect;
				delete item.meta.redirect;
			}
			if (item.children && item.children.length > 0) {
				handleMoveAttr(item.children);
			}
		}
	};
	handleMoveAttr(tempArr);
	return tempArr;
};

/**
 * @description 通过文件名动态引入assets文件夹图片
 * @param {String} imgName 图片名称
 * @returns string
 */
export const getAssetsFile = (imgName: string) => {
	return new URL(`../assets/images/${imgName}`, import.meta.url).href;
};

/**
 * @description 通过文件路径动态引入assets文件夹图片
 * @param {String} imgPath 图片路径
 * @returns string
 */
export const getAssetsFileByPath = (imgPath: string) => {
	try {
		let path = imgPath;
		const isDev = process.env.NODE_ENV === "development";
		if (imgPath.indexOf("~@") != -1) {
			path = imgPath.replace("~@", "@");
		}
		const handlePath = path.replace("@", isDev ? "/src" : "");
		return new URL(handlePath, import.meta.url).href;
	} catch (error) {
		console.warn(error);
	}
};
