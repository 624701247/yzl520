// TypeScript file
namespace jinx {
    // 给定一个尺寸size，平分为 num 份
    // return 每份的坐标的数组列表
    export function getGap(size, num) {
        let partSize = size / (num + 1) //分成几份
        let ary = []
        for(let idx = 0; idx < num; idx++) {
            ary[idx] = partSize * (idx + 1)
        }
        return ary
    }

    // 文本过长添加省略号
    // 先在exml布局文件中输入 'xxxxxx...' 模拟看看效果，然后不要设置死Label的宽度
    export function addEllipsis(label:eui.Label, str, maxWid?) {
        maxWid = maxWid || label.width
        let needEll = false //是否需要省略号
        for(let idx = str.length; idx > 0; idx--) {
            if(needEll) {
                label.text = str.substr(0, idx) + '...'
            }
            else {
                label.text = str.substr(0, idx)
            }
            // console.log('label.width', label.width)
            if(label.width > maxWid) {
                needEll = true
            }
            else {
                break
            }
        }
    }

    // 检查手机号码格式是否正确
    export function checkTelIsValid(telInp:eui.EditableText) {
        if(telInp.text == '') {
            carry.weakHint(telInp.prompt)
            return false
        }
        if(telInp.text.length != 11) {
            carry.weakHint('手机号码格式不对')
            return false
        }
        return true
    }

    //压缩 dataurl 
    export function setCompressDataurl(dataurl:string, destWid, destHei, func) {
        var img = new Image();
        img.src = dataurl
        img.onload = function(ev) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = parseInt(destWid)
            canvas.height = parseInt(destHei)   //kone point 如果这里有小数的话，ios无法生成相应的base64图
            ctx.drawImage(img, 0, 0, destWid, destHei);
            func(canvas.toDataURL())
        }
    }


    // 给定图片宽高，使其铺满给定宽高矩形
    // @return rr : 图片应缩放的比例
    export function bespreadRect(picWid, picHei, gpWid, gpHei) {
        var rr1 = gpWid / picWid
        var rr2 = gpHei / picHei
        return Math.max(rr1, rr2)
    }
    
    // 创建图片，带上50%圆角，使其铺满给定圆形
    // warining : 这里用mask将图片扣成圆形，5.1.4有个bug: 滚动列表里面的项目用此方案实现圆角功能会闪烁
    // @param rad : 半径
    // @param texture : 图片纹理
    // @return eui.Group对象，锚点居中的
    /*export function createCirImg(rad, texture) {
        let gp:eui.Group = new eui.Group()
        gp.width = rad*2, gp.height = rad*2
        gp.anchorOffsetX = gp.width / 2, gp.anchorOffsetY = gp.height / 2

        // 
        let cir = new eui.Rect()
        cir.width = gp.width, cir.height = gp.height
        cir.ellipseWidth = cir.width
        cir.ellipseHeight = cir.height
        cir.fillColor = 0xefca45
        gp.addChild(cir)

        // 
        let img = new egret.Bitmap()
        img.texture = texture 
        let rr = bespreadRect(img.width, img.height, gp.width, gp.height)
        img.width = img.width * rr
        img.height = img.height * rr
        img.anchorOffsetX = img.width / 2, img.anchorOffsetY = img.height / 2
        img.x = gp.width / 2, img.y = gp.height / 2
        gp.addChild(img)
        // 
        let circle = new egret.Shape();
        circle.graphics.lineStyle( 0, 0x00ff00 );
        circle.graphics.beginFill( 0xff0000, 1);
        circle.graphics.drawCircle(0,0, rad);
        circle.graphics.endFill();
        circle.x = gp.width / 2, circle.y = gp.height / 2
        gp.addChild(circle)
        img.mask = circle

        return gp
    }*/


    // 给定图片链接，将其转化成egret的 Texture对象。
    // 因为用mask实现圆角有bug,所以才有了如下写法
    function imgUrl2canvas(url, cbFun, that, needCir:boolean) {
        let image = new Image();  
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;  
        // image.style.cssText = 'border-radius: 50%;'  //想这样就实现canvas圆角是不行哦
        image.onload = function() {  
            var canvas = document.createElement("canvas");
            // console.log('w h', image.width, image.height)
            var ctx = canvas.getContext("2d");  

            // 
            if(needCir) { //弄成圆形图片
                let size = Math.min(image.width, image.height)
                canvas.width = size;  
                canvas.height = size;  
                ctx.save();
                ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
                ctx.clip();
                // 
                let ox = 0, oy = 0;
                if(image.width > image.height) {
                    ox = (image.width - size) / 2
                }
                else {
                    oy = (image.height - size) / 2
                }
                ctx.drawImage(image, ox, oy, size, size
                ,0, 0, size, size);  
            }
            else {
                canvas.width = image.width;  
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);  
            }
            // 

            cbFun.call(that, canvas.toDataURL(), canvas.width, canvas.height)
        } 
        image.onerror = function() {
            cbFun.call(that, null)
        }

    } 
    // 根据url创建纹理 - 用canvas转base64写法
    // 需要裁切成圆形图片推荐写法
    export function url2Texture_cvs(url, cbFun, that, needCir:boolean = true) {
        imgUrl2canvas(url, function(dataurl, width, height) {
            if(dataurl == null) {
                cbFun.call(that, null)
                return 
            }
            dataurl2texture(dataurl, function(texture) {
                cbFun.call(that, texture, width, height)
            }, this)
        }, this, needCir)
    }

    // 拷贝引擎中的 egret.BitmapData.create 方法
    function createBm(type, data, callback) {
        var base64 = "";
        if (type === "arraybuffer") {
            base64 = egret.Base64Util.encode(data);
        }
        else {
            base64 = data;
        }
        var imageType = "image/png"; //default value
        if (base64.charAt(0) === '/') {
            imageType = "image/jpeg";
        }
        else if (base64.charAt(0) === 'R') {
            imageType = "image/gif";
        }
        else if (base64.charAt(0) === 'i') {
            imageType = "image/png";
        }
        var img = new Image();
        img.src = "data:" + imageType + ";base64," + base64;
        // img.crossOrigin = '*'; // 就是这句导致有些设备微信头像出不来
        var bitmapData = new egret.BitmapData(img);
        img.onload = function () {
            img.onload = undefined;
            bitmapData.source = img;
            bitmapData.height = img.height;
            bitmapData.width = img.width;
            if (callback) {
                callback(bitmapData);
            }
        };
        return bitmapData;
    };


    // 根据url创建纹理 - egret api 写法
    export function url2Texture_eg(url, cbFunc, that) {
        var imgLoader:egret.ImageLoader = new egret.ImageLoader();
        imgLoader.crossOrigin = "*";
        // 然后注释掉下面这句用于修复bug: 使用egret.BitmapData.create将base64转化未egret纹理在一些iOS设备上会不成功
        // imgLoader.crossOrigin = 'anonymous' 
        imgLoader.once( egret.Event.COMPLETE, function(evt:egret.Event ) {
            var loader:egret.ImageLoader = evt.currentTarget;
            var bmd:egret.BitmapData = loader.data;
            var texture: egret.Texture = new egret.Texture();
            texture.bitmapData = bmd
            cbFunc.call(that, texture)
        }, this ); 
        imgLoader.load(url);
    }

    // base64字符串转化为纹理
    export function dataurl2texture(dataurl:string, cbFun, that) {
        let str = dataurl.split(',')[1]
        if(!str) {
            cbFun.call(that, null)
            return
        }
        createBm('base64', str, function(bit: egret.BitmapData) {
            let texture = new egret.Texture()
            texture.bitmapData = bit
            cbFun.call(that, texture)
        }.bind(this))
    }

    // 九宫格缩放
    // @param xgap : x轴方向左右两端固定不缩放的尺寸，若传null则表示在该方向不考虑九宫格缩放
    // @param ygap : 同上理
    export function setScale9(obj:eui.Image, wid, hei, xgap, ygap) {
        var rect = new egret.Rectangle();
        rect.x = xgap || 0
        rect.y = ygap || 0
        rect.width = wid - rect.x * 2
        rect.height = hei - rect.y * 2
        if(obj) {
            obj.scale9Grid = rect
        }
        console.log('"scale9grid": "' + rect.x + ',' + rect.y + ',' + rect.width + ',' + rect.height + '",' )
    }

    /**/ 
    export function onFocusIn() {
        carry.removeClass('inpMask', 'cont-hide')
    }
    export function onFocusOut() {
        carry.addClass('inpMask', 'cont-hide')
    }

}   //end of jinx



/* 粒子动画使用demo
{
    "name": "particle"
}

var texture = RES.getRes("newParticle_png");//纹理
var config = RES.getRes("newParticle_json");//配置文件
let system:particle.ParticleSystem = new particle.GravityParticleSystem(texture, config);
this.addChild(system)
system.start();
*/


/*
调起 wx 地图  互动派技术的公众号有该权限，后端那边已经默认初始化了该权限
wx.openLocation({
    longitude: 109.498754,// 经度，浮点数，范围为180 ~ -180。
    latitude: 18.29249,  // 纬度，浮点数，范围为90 ~ -90
    name: '三亚湾红树林度假世界国际会议中心', // 位置名
    address: '', // 地址详情说明
    scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
});
*/


/* egret http 
var request = new egret.HttpRequest();
request.responseType = egret.HttpResponseType.TEXT;
request.open("http://httpbin.org/get", egret.HttpMethod.POST);
request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
request.send(JSON.stringify({a:1, b:2}));
request.addEventListener(egret.Event.COMPLETE, function() {},this);
request.addEventListener(egret.IOErrorEvent.IO_ERROR, function() {},this);
request.addEventListener(egret.ProgressEvent.PROGRESS, function() {},this);
*/ 