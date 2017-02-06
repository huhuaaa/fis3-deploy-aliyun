var ALY = require("aliyun-sdk");
var aliyunoss = null;
var files = [];
var bucket = '';
var uploadNext = null;
/**
 * 上传oss方法
 * @param  string   bucket   空间名称
 * @param  object   file     fis的file对象
 * @param  function callback 回调函数
 * @return video
 */
function uploadoss(bucket, file, callback) {
    var subpath = file.subpath;
    var contenttype = "";
    var aliyunkey = file.release.replace(/^\//, '');
    // 文件头信息Content-Type
    switch(file.ext){
      case '.xml':
        contenttype = 'application/xml';
        break;
      case '.jpg':
      case '.jpeg':
        contenttype = 'image/jpeg';
        break;
      default:
        if(file.isJsLike){
          contenttype = "application/javascript";
        }

        if(file.isCssLike){
          contenttype = "text/css";
        }

        if(file.isJsonLike){
          contenttype = "application/json";
        }

        if(file.isHtmlLike){
          contenttype = "text/html";
        }
        break;
    }

    aliyunoss.putObject({
      Bucket: bucket,
      Key: aliyunkey,
      Body: file.getContent(),
      AccessControlAllowOrigin: '',
      ContentType: contenttype,
      CacheControl: 'cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      ServerSideEncryption: '',
      Expires: 60
    },
    function (err, data) {
      if(err){
          console.log('error:', err);
      } else {
          var time = '[' + fis.log.now(true) + ']';
          process.stdout.write(
              ' uploadoss - '.green.bold +
              time.grey + ' ' + 
              subpath.replace(/^\//, '') +
              ' >> '.yellow.bold +
             aliyunkey + "---"+contenttype+
              '\n'
          );
      }
      typeof callback == 'function' && callback()
    });
};

// 采用队列的方式上传，防止并发上传过多引起上传失败
var upload = function(b, next){
  typeof b == 'string' && (bucket = b)
  typeof next == 'function' && (uploadNext = next)
  var file = files.shift()
  if(file){
    uploadoss(bucket, file, upload)
  }else{
    // console.log('upload end and next')
    typeof uploadNext == 'function' && uploadNext()
  }
};
// 将文件对象放入上传队列
var pushFile = function(file){
  files.push(file)
};

module.exports = function(options, modified, total, next){
  aliyunoss = new ALY.OSS({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    endpoint: options.url ? options.url : 'http://oss-cn-hangzhou.aliyuncs.com',
    apiVersion: '2013-10-15'
  });
  typeof options.filter != 'function' ? (options.filter = function(){return true}) : options.filter;
  modified.filter(function(item){
    return options.filter(item);
  }).forEach(function(file){
    pushFile(file);
  });
  // 触发上传
  upload(options.bucket, next);
  // next();
};