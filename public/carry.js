var carry;
carry = carry || {};

/*utils*/ 
!function (utils) {
    // 判断是否在微信端内置浏览器
    var checkIsWx = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    utils.isWx = checkIsWx()

    var checkIsiOS = function () {
        if (/Mac/i.test(navigator.userAgent)) {
            return true
        }
        return false
    }
    utils.isIos = checkIsiOS()

    var getUrlParam = function (url) {
        var get = {}
        url = url || window.location.href.toString()
        var q = url.split("?")[1];
        if (typeof (q) == "string") {
            q = q.split("#")[0];
            q = q.split("&");
            for (var i in q) {
                var j = q[i].split("=");
                get[j[0]] = j[1];
            }
        }
        return get
    }
    utils.urlParam = getUrlParam()

    // 
    utils.randomInt = function (min, max) {
        var r = Math.random()   //  Math.random() 返回0 -- 1的开区间，即 0 < x < 1
        r = Math.ceil(r * (max - (min - 1)))
        return (r + (min - 1))
    }

    // 
    var el_clog = null
    utils.clog = function(txt) {
        if(this.isDemo || this.isLocal) {            
        }
        else {
            return 
        }

        if(typeof(txt) == 'object') {
            txt = JSON.stringify(txt);
        }

        
        if(el_clog == null) {
            el_clog = document.createElement('div')
            el_clog.style.cssText = "position:fixed; z-index:9999; color:green; font-size: 0.4rem;word-break: break-all;"
            document.body.appendChild(el_clog)
        }

        el_clog.innerHTML += (txt + ' ` ')
    }

    // 检测是否是手机号码
    utils.checkIsTel = function(phone) {
        if(phone) {
            var reg = /^(13[0-9]|14[579]|15[0-9]|166|17[0-9]|18[0-9]|19[89])\d{8}$/;
            if(reg.test(phone)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    //获取字符串中的整数
    utils.getNumByStr = function(str) {
        var num = str.replace(/[^0-9]/ig, ""); 
        return parseInt(num)
    }

    // 指定时间与当前时间比较
    // return : true 早于或等于当前时间； false 晚于当前时间
    utils.compareDate = function(year, mon, day, hour, min, sec) {
        day = day || 1
        hour = hour || 0 
        min = min || 0
        sec = sec || 0
        var destDate = new Date(year, mon - 1, day, hour, min, sec)
        var curDate = new Date()
        if(destDate <= curDate) {
            return true
        }
        else {
            return false
        }
    }
}(carry)

/*事件收发*/
!function(mgr) {
    var eventFuncAry = {}
    // 发送事件
    mgr.dispEvent = function(action, data) {
        var ev = new Event(action)
        ev.data = data
        ev.action = action
        document.dispatchEvent(ev) 
    }

    mgr.once = function(action, func, that) {
        if(eventFuncAry[action]) {
            console.warn('重复监听事件：', action)
            this.removeListener(action)
        }
        // 
        var cbFun = function(ev) {
            this.removeListener(action)
            func.call(that, ev)
        }.bind(this)
        eventFuncAry[action] = cbFun
        document.addEventListener(action, cbFun)   
    }
    
    mgr.addListener = function(action, func, that) {
        if(eventFuncAry[action]) {
            console.warn('重复监听事件：', action)
            this.removeListener(action)
        }
        // 
        var cbFun = func.bind(that)
        document.addEventListener(action, cbFun)   
        eventFuncAry[action] = cbFun
        return cbFun
    }

    mgr.removeListener = function(action) {
        if(eventFuncAry[action]) {
            document.removeEventListener(action, eventFuncAry[action])   
        }
        eventFuncAry[action] = null
    }
}(carry)


/* 环形进度条
carry.RingProgress = function(canvas) {  
    var lineHei = 9
    var forecolor = "#ffffff"     //前景色
    var bgcolor = 'rgba(0,0,0,0)' //背景色

    var context = canvas.getContext("2d");  
    var center_x = canvas.width / 2;  
    var center_y = canvas.height / 2;  
    var rad = Math.PI * 2 / 100;     
      
    // 绘制背景圆圈  
    function backgroundCircle() {  
        context.save();  
        context.beginPath();  
        context.lineWidth = lineHei; //设置线宽  
        var radius = center_x - context.lineWidth;  
        context.lineCap = "round";  
        context.strokeStyle = bgcolor;  
        context.arc(center_x, center_y, radius, 0, Math.PI*2, false);  
        context.stroke();  
        context.closePath();  
        context.restore();  
    }  
  
    //绘制运动圆环  
    function foregroundCircle(n) {  
        context.save();  
        context.strokeStyle = forecolor;  
        context.lineWidth = lineHei;  
        context.lineCap = "round";  
        var radius = center_x - context.lineWidth;  
        context.beginPath();  
        context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)  
        context.stroke();  
        context.closePath();  
        context.restore();  
    }  
  
    //绘制文字  
    function text(n) {  
        context.save(); //save和restore可以保证样式属性只运用于该段canvas元素  
        context.fillStyle = forecolor;  
        var font_size = 40;  
        context.font = font_size + "px Helvetica";  
        var text_width = context.measureText(n.toFixed(0)+"%").width;  
        context.fillText(n.toFixed(0)+"%", center_x-text_width/2, center_y + font_size/2);  
        context.restore();  
    }  

    backgroundCircle();  

    return {
        setPersent: foregroundCircle,
        setPersentTxt: text
    }
} 
*/

/* 4个方向滑动事件*/
/* eg :
    carry.slide.init()
    carry.slide.addUpEvent(function() {
        console.log('uu', this.stateLb.text)
    }, this)
    carry.slide.addDownEvent(function() {
        console.log('dd', this.stateLb.text)
    }, this)
    carry.slide.addLeftEvent(function() {
        console.log('ll', this.stateLb.text)
    }, this)
    carry.slide.addRightEvent(function() {
        console.log('rr', this.stateLb.text)
    }, this)
*/
/*
carry.slide = (carry.slide || {})
!function (slide) {
    var _gapTime = 1000 //触摸时间低于该值才触发事件
    var _gapPer = 1.2
    var _moveDist = 100 //触摸移动距离大于该值才触发事件
    var _startTp = null
    slide.init = function () {
        document.body.addEventListener('touchstart', function (ev) {
            var touch = ev.touches[0];
            _startTp = {
                sx: touch.clientX,
                sy: touch.clientY,
                t: ev.timeStamp
            }
        }, true);
        document.body.addEventListener('touchend', function (ev) {
            if (ev.timeStamp - _startTp.t > _gapTime) {
                console.log('触摸时间过长')
                _startTp = null
                return
            }

            var touch = ev.changedTouches[0];
            var gapx = touch.clientX - _startTp.sx
            var gapy = touch.clientY - _startTp.sy

            if (Math.abs(gapy) / Math.abs(gapx) > _gapPer) {
                if (gapy > _moveDist) {
                    console.log('down')
                    var ev = new Event('carry-slide-down')
                    document.dispatchEvent(ev)
                }
                else if (gapy < -_moveDist) {
                    console.log('up~~~~~~~~~~~~~~~~~~~')
                    var ev = new Event('carry-slide-up')
                    document.dispatchEvent(ev)
                }
            }
            if (Math.abs(gapx) / Math.abs(gapy) > _gapPer) {
                if (gapx > _moveDist) {
                    console.log('right')
                    var ev = new Event('carry-slide-right')
                    document.dispatchEvent(ev)
                }
                else if (gapx < -_moveDist) {
                    console.log('left')
                    var ev = new Event('carry-slide-left')
                    document.dispatchEvent(ev)
                }
            }

        }, true);
    }

    // 
    slide.addUpEvent = function(func, that) {
        document.addEventListener('carry-slide-up', func.bind(that))
    }
    // 
    slide.addDownEvent = function(func, that) {
        document.addEventListener('carry-slide-down', func.bind(that))
    }
    // 
    slide.addLeftEvent = function(func, that) {
        document.addEventListener('carry-slide-left', func.bind(that))
    }
    // 
    slide.addRightEvent = function(func, that) {
        document.addEventListener('carry-slide-right', func.bind(that))
    }
}(carry.slide)
*/


/* 摇一摇事件封装
carry.shake = {}
!function(shake) {
    var shake_tereshold = 1000;  
    var last_update = 0; 
    var x = y = z = last_x = last_y = last_z = 0;   
    var onDeviceMotion = function(eventData) {
        var curTime = new Date().getTime();  
        // carry.clog((curTime - last_update) + '')
        if ((curTime - last_update) < 100) {  
            return 
        }
        
        var diffTime = curTime - last_update;  
        last_update = curTime;  

        var acceleration = eventData.accelerationIncludingGravity;  // 移动加速度
        x = acceleration.x;   // 西向东
        y = acceleration.y;   // 南向北 
        z = acceleration.z;   // 垂直地面

        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;  

        if (speed > shake_tereshold) {   
            
            var ev = new Event('carry-shake')
            document.dispatchEvent(ev)
        }  
        last_x = x;  
        last_y = y;  
        last_z = z;  
    }
    // 启动检测摇一摇事件
    shake.turnon = function() {
        if (window.DeviceMotionEvent) {  
            window.addEventListener('devicemotion', onDeviceMotion, false);  
        } 
        else {  
            alert('not support devicemotion');  
        }  
    }
    // 关闭检测
    shake.turnoff = function() {
        // if (window.DeviceMotionEvent) {  
        //     window.removeEventListener('devicemotion', onDeviceMotion, false);  
        // } 
    }

    shake.addTriggerEvent = function(func, that) {
        document.addEventListener('carry-shake', func.bind(that))
    }

}(carry.shake)
*/

/* 预加载相关 */ 
!function(perload) {
    perload.loadImg = function(url, cbFun, that) {
        var img = new Image();
        img.onload = function() {
            cbFun.call(that, true, img.src)
        }
        img.onerror = function() {
            cbFun.call(that, false, img.src)
        };
        img.src = url
    }
}(carry)


/*dom & css*/ 
!function (docs) {
    docs.addClass = function (elId, cls) {
        cls = ' ' + cls
        var el = null
        if (typeof (elId) == "string") {
            el = document.getElementById(elId)
        }
        else {
            el = elId
        }
        if (el && el.className.indexOf(cls) == -1) {
            el.className += cls
        }
    }

    docs.removeClass = function (elId, cls) {
        cls = ' ' + cls
        var el = null
        if (typeof (elId) == "string") {
            el = document.getElementById(elId)
        }
        else {
            el = elId
        }
        if (el) {
            el.className = el.className.replace(cls, "")
        }
    }

    // 给定dom对象，宽适配，设置对应的em单位
    docs.initEm = function (el, cw_em) {
        if (cw_em == null) {
            cw_em = 7.5
        }
        var ch = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        var cw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        var ch_em = ch / cw * cw_em
        el.style.fontSize = (cw / cw_em) + 'px';
    }

    // 弱提示
    docs.weakHint = function(desc, waitTime) {
        var node = document.createElement('div')
        node.className = "cont-weakhint"
        var str = '';
        str += '<span>' + desc + '</span>'
        node.innerHTML = str;
        document.body.appendChild(node);
        carry.initEm(node)

        waitTime = waitTime || 1400
        setTimeout(function() {
            node.remove()
        }, 500 + waitTime)
    }

    //  动态添加 css 样式
    docs.insertCss = function(cssStr) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = cssStr;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

}(carry)


/*菊花*/ 
carry.spinner = {}
!function(spin) {
    var _isShowing = true
    var _spinner = null
    spin.show = function() {
        _isShowing = true

        if (_spinner) {
            // _spinner.style.isibility = "visible"; //效果不好
            carry.removeClass(_spinner, 'cont-hide')
            return
        }

        var node = document.createElement("div");
        node.className = "cont-spinner"
        var str = ''
        var pieceNum = 9
        var gap = 360 / pieceNum
        var de = 1.3 / pieceNum
        str += '<div class="spinner-dk"></div>'
        for (var idx = 0; idx < pieceNum; idx++) {
            str += '<div class="piece" style="animation-delay: ' + (idx * de) + 's;">'
                str += '<div class="piece-cell" style="transform: rotate(' + (idx * gap) + 'deg) translate(10px, 0px);"></div>'
            str += '</div>'
        }

        node.innerHTML = str;
        document.body.appendChild(node)
        carry.initEm(node)
        _spinner = node
    }
    spin.hide = function() {
         _isShowing = false
        if (_spinner) {
            carry.addClass(_spinner, 'cont-hide')

        }
    }
}(carry.spinner)


/*背景乐*/ 
carry.bgm = {}
!function(bgm) {
    var audio = null
    var wait_ctrl = false
    var stateAction = 'carry-bgm-state' 
    var isReady = false
    
    // 检测当前播放状态，还没创建则当成停止播放
    var checkPlayState = function(cbFun) {
        var isPlay;
        var t1 = audio ? audio.currentTime : 0
        setTimeout(function() {
            var t2 = audio ? audio.currentTime : 0
            if(t1 == t2) { //实际上并没有在播放
                isPlay = false
            }
            else {
                isPlay = true
            }
            cbFun(isPlay)
        }, 50)
    }

    //
    var createAudio = function() {
        if(audio) {
            return 
        }
        /* kone warning: 假如将mp3资源直接放到项目线上环境resocure中，iOS一些设备有个bug:播放一到两次就停止播放了，无法循环播放。
        所有这里将mp3资源统一放到cdn.aiwanpai的域名中 */
        /* 
        // 先从下面的列表找找有没有合适的
        //cdn.aiwanpai.com/music/bgm_hot.mp3
        //cdn.aiwanpai.com/uvjz/bly-lyfsmile-bgm.mp3
        //cdn.aiwanpai.com/6fbb0d70eca611e8b603702084e1f368/mp3/bg.mp3
        //cdn.aiwanpai.com/ef3f2d5af6a011e8b603702084e1f368/bgm.mp3
        */
        // var bgmres = 'resource/bg.mp3?' + BIN_VER
        var bgmres = '//cdn.aiwanpai.com/uvjz/bly-lyfsmile-bgm.mp3'
        audio = new Audio(bgmres)
        audio.loop = true
        audio.autoplay = true

        // 
        var timer;
        var tfunc = function() {
            checkPlayState(function(isp) {
                if(isp) {  //默认播放的，直到知道bgm已经播放了才算就绪
                    carry.dispEvent(stateAction, isp)
                    clearInterval(timer)
                    isReady = true
                    console.log('bgm 就绪')
                }
            }, this)
        }
        timer = setInterval(tfunc, 60)
    }

    //注意： 为保证 WeixinJSBridgeReady 能生效，必须再加载 jweixin-xxx.js 之前调用。
    //注意： 南航的app内置浏览器无法默认播放Audio,要触发播放
    // @param isCheck: 检测是否就绪,没有这强制初始化
    bgm.init = function(isCheck) {
        isCheck = isCheck || false
        if(isCheck) {
            if(!isReady) {
                createAudio()
            }
        }
        else if (carry.isWx) {
            document.addEventListener('WeixinJSBridgeReady', function () { 
                createAudio()
            }, false)
            // kone warining 并不能保证一定能进入到该回调，比如在 pc端微信
            // setTimeout(function() {createAudio()}, 3000);
        }
        else {
            createAudio()
        }
        return isReady
    }

    bgm.getIsPlay = function() {
        if(!bgm.init(true)) {
            console.log('还没就绪，不能获取状态')
            return 
        }

        checkPlayState(function(isp) {
            carry.dispEvent(stateAction, isp)
        })
    }

    // 
    // @param isPlay: 是否播放，若不传该参数怎默认切换播放状态
    // @param playTime: 设置播放时间， 不传值默认继续播放
    var ctrlEnd = function(isp) {
        carry.dispEvent(stateAction, isp)
        wait_ctrl = false
    }
    bgm.ctrl = function (isPlay, playTime) {
        if(!bgm.init(true)) {
            console.log('还没就绪，不能控制')
            return 
        }
        
        if(wait_ctrl) {
            return
        }
        wait_ctrl = true

        checkPlayState(function(curIsPlay) {
            if(audio == null) {
                ctrlEnd(false)
                return
            }

            if (isPlay == null) { 
                isPlay = !curIsPlay
            }

            if(isPlay == curIsPlay) { 
                ctrlEnd(isPlay)
            }
            else {
                if(isPlay) {
                    if(playTime != null) {
                        audio.currentTime = playTime
                    }
                    audio.play()
                }
                else {
                    audio.pause()
                }

                checkPlayState(function(val) {
                    ctrlEnd(val)
                }, this)
            }
        }, this)
    }

    // 监听bgm播放状态发生改变
    bgm.onGetIsPlay = function (func) {
        carry.addListener(stateAction, function (ev) {
            func(ev.data)
        }, this)
    }
}(carry.bgm)