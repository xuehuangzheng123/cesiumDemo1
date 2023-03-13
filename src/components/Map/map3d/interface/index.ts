export namespace MapMethods {
	interface LayerOptionsItf {
		map: any;
		id: number | string;
		show?: boolean;
		alpha?: number;
		flyTo?: boolean;
		bbox?: any;
		height?: number;
		layerInfo?: any;
		zIndex?: number;
		filterStr?: string;
		userData?: any;
		parameters?: any;
		layers?: any;
	}
	interface AddLayerOptions extends LayerOptionsItf {
		url: string;
		serviceType: string;
	}
	interface RemoveLayerOptions extends LayerOptionsItf {
		hasDestroy?: boolean;
	}
	interface LayerOpacityOptions extends LayerOptionsItf {
		alpha: number;
	}
	interface LayerShowOptions extends LayerOptionsItf {
		show: boolean;
	}
	export interface AddLayerFunItf {
		(options: AddLayerOptions): void;
	}
	export interface RemoveLayerItf {
		(options: RemoveLayerOptions): void;
	}
	export interface LayerOpacityItf {
		(options: LayerOpacityOptions): void;
	}
	export interface LayerShowItf {
		(options: LayerShowOptions): void;
	}
}
