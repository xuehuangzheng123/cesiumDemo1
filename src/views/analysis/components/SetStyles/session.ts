export function setStyleData(key: any, data: any) {
	// 获取全部的图层样式数据
	const stylesData = getStyleData();
	stylesData[key] = data;
	sessionStorage.layerStyles = JSON.stringify(stylesData);
}
export function getStyleData(key?: any) {
	const stylesDataStr = sessionStorage.layerStyles;
	const stylesData = stylesDataStr ? JSON.parse(stylesDataStr) : {};
	return key === undefined ? stylesData : stylesData[key];
}
export function setSlopeQueryData(key: any, value: any) {
	// 获取全部的坡度查询数据
	const data = getSlopeQueryData();
	data[key] = value;
	sessionStorage.slopeQuery = JSON.stringify(data);
}
export function getSlopeQueryData(key?: any) {
	const dataStr = sessionStorage.slopeQuery;
	const data = dataStr ? JSON.parse(dataStr) : {};
	return key === undefined ? data : data[key];
}
