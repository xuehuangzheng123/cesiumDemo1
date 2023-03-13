// * global
declare global {
	interface Navigator {
		msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
		browserLanguage: string;
	}
	interface Window {
		tudou3d: any; //全局变量名
		Cesium: any;
		map: any;
		turf: any;
		[mapId: string]: any;
		CustomMap: any;
	}
}

export {};
