import http from "@/api";
import { FILE, SA } from "@/api/config/servicePort";
import { Upload } from "@/api/interface/index";

/**
 * @name 文件上传模块
 */
// * 图片上传
export const uploadImg = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(SA + `/file/upload/img`, params);
};

// * 视频上传
export const uploadVideo = (params: FormData) => {
	return http.post<Upload.ResFileUrl>(SA + `/file/upload/video`, params);
};

export const getOnlinePreviewUrlApi = (params: Upload.ReqOnlinePreviewUrl) => {
	return http.get<Upload.ResOnlinePreviewUrl>(FILE + "/api/minio/getOnlinePreviewUrl", params);
};
