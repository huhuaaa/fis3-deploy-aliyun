## fis3-deploy-aliyun ##

fis3发布资源到阿里云oss部署插件。

### 安装 ###

	npm install -g fis3-deploy-aliyun

### options ###


	{
		"url": "http://oss-cn-hangzhou.aliyuncs.com", //阿里云oss的上传地址
		"bucket": "OSS空间名",
		"accessKeyId": "您的accessKeyId",
		"secretAccessKey": "您的secretAccessKey"
	}

阿里云oss所在区域对应上传地址参考[文档](https://help.aliyun.com/document_detail/31837.html?spm=5176.doc32230.6.146.nvsz0j)。如果是在阿里云环境内运行，使用内网上传地址上传速度快很多。url默认为http://oss-cn-hangzhou.aliyuncs.com。