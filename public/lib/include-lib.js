//第三方类库加载管理js，方便切换lib
/* eslint-disable */
; (function () {
  var r = new RegExp('(^|(.*?\\/))(include-lib.js)(\\?|$)'),
    s = document.getElementsByTagName('script'),
    targetScript
  for (var i = 0; i < s.length; i++) {
    var src = s[i].getAttribute('src')
    if (src) {
      var m = src.match(r)
      if (m) {
        targetScript = s[i]
        break
      }
    }
  }

  // cssExpr 用于判断资源是否是css
  var cssExpr = new RegExp('\\.css')

  function inputLibs(list) {
    if (list == null || list.length === 0) {
      return
    }

    for (var i = 0, len = list.length; i < len; i++) {
      var url = list[i]
      if (cssExpr.test(url)) {
        var css = '<link rel="stylesheet" href="' + url + '">'
        document.writeln(css)
      } else {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>'
        document.writeln(script)
      }
    }
  }

  //加载类库资源文件
  function load() {
    var arrInclude = (targetScript.getAttribute('include') || '').split(',')
    var libpath = targetScript.getAttribute('libpath') || ''

    //在线lib，开发中请注释下面代码
    var isOnline = window.location.hostname.indexOf('tudou3d') !== -1 //www.tudougis.cn
    if (isOnline) {
      libpath = 'http://mars3d.cnlib/'
    }
    //在线lib end，开发中请注释上面代码




    if (libpath.lastIndexOf('/') !== libpath.length - 1) {
      libpath += '/'
    }

    var libsConfig = {
      'turf': [
        libpath + "turf/turf.min.js"
      ],
      'tudou3d': [
        //三维地球“主库”
        libpath + 'Cesium/Widgets/widgets.css', //cesium
        libpath + 'Cesium/Cesium.js',
        // libpath + 'tudou3d/plugins/compatible/cesium-version.js', //cesium版本兼容处理
        libpath + 'tudou3d/tudou3d.css', //tudou3d
        libpath + 'tudou3d/tudou3d.js',
      ],
      "mapserver": [
        libpath + "mapserver/CustomCesiumSDK.js"
      ]
    }


    var keys = {}
    for (var i = 0, len = arrInclude.length; i < len; i++) {
      var key = arrInclude[i]

      if (keys[key]) {
        //规避重复引入lib
        continue
      }
      keys[key] = true
      inputLibs(libsConfig[key])
    }
  }

  load()
})()
