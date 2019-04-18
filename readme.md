# egret 模板项目 template-prj
##
#### 肖进超 --2018/5/7

	
###### 所用框架、技术：
1. 当前是 egret 5.1.4
2. less
3. 入口脚本carry.js 请使用es5规范写，因为我用gulp压缩代码，目前的gulp可处理不了 let 哪些

    
###### 开发步骤：
* 若是clone下来该项目的，请先cmd运行  1、cd node     &nbsp; &nbsp; &nbsp; &nbsp; 2、npm install
* IDE用wing。
* 请先处理 kone todo , 开发中有哪些待写也请使用标注 kone todo 
* 代码中一些知识点请搜索标注 kone point
* 想要保存文件自动编译请使用命令行 ： egret startserver -a

*  共有三个命名控件 carry、 jinx、 pgame。
	* carry是对原生h5的一些方法、功能的封装。
	* jinx是对egret的一些功能模块的封装，jinx依赖于carry，请看carry-dec.ts
	* pgame就是具体项目的逻辑、ui等咯 

* 具体项目不需要使用jinx模块请再 tsconfig.json中配置exclude；不需要的carry模块请直接删除carry.js相应的代码

* 打包请运行 python publish.py ， 若还有app版，请创建多一个publishapp.py



###### 如何引入egret第三方库：
1. 去 https://github.com/egret-labs/egret-game-library 下载白鹭当前对应版本的第三方库	
2. 放到引擎所在路径去， 例如： Egret\engine\5.1.4\build
3.egretProperties.json配置
	``` 
	{
      "name": "xxx"
    }
	```
引入即可。
	```
	{
      "name": "particle"
	}
	```粒子动画库


###### exml使用全局样式：
1. 在default.thm.json 添加

		"styles": {
		    "title1": {
		        "textColor": "0xff0000"
		    }
		}
2. 在exml布局文件中使用示例: <e:Label style="title1"/>

###### 精灵沿贝塞尔曲线运动：
+ 请参考项目711便利店点球大战 711-football

###### eui.Label \ egret.TextField 实现富文本：
	let size = this.testLb.size
    this.testLb.textFlow = <Array<egret.ITextElement>>[ 
        { text: "啊陆，帮你获得了", style:{"textColor":0xffffff, "size": size} },
        { text: '100', style:{"textColor":0xffea00, "size": size} },
        { text:"积分", style:{"textColor":0xffffff, "size":size} }
    ];


###### 建议：
+ 能写在carry的尽量写在carry.js，而不是写在jinx。 这样脱离egret也能用。
+ 记得写上模式使用的demo代码，各种乱七八糟的demo代码请写在 jutils.ts



## html5 注意：
##### window.innerHeight 、 window.innerWidth值会有不对的情况：  
    ios设备，页面上有跳链接的情况window.innerWidth值比正确值大了很多（详细见高夫项目jf-ace）

##### 微信里，img标签设置 opacity:0 仍然可以长按保存，但是无法长按识别二维码。要长按识别二维码必须 opacity:1把图片显示出来

##### iOS-11.3.1系统，微信里，某些MP3文件用audio标签播放有坑：
1. 无法设置音量为0（volume =0仍然播放有声音）
2. 无法循环播放。audio标签设置loop="loop"; Audio对象设置loop=true; 甚至写定时器，每隔一段时间new一个Audio对象然后play都不行。
  
		解决：无法循环播放的问题是aiwanpai服务器的锅，不能直接放到项目包里面。  
		叫后端放到cdn.aiwanpai.com那里去。比如：http:///music/bgm_hot.mp3


##### 关于合成图片然后 toDataURL 导成base64 的问题。
1. 如果合成图里有外域图片必须带上('crossOrigin', 'anonymous')，否则 toDataURL 无法成功,
   报错 Uncaught Error: #1033: 跨域图片不可以使用toDataURL来转换成base64
2. 但是有些图片加上这个('crossOrigin', 'anonymous')跨越的属性又会get不到图片。
3. 1、 2   两点用egret的api也是同理的

		var image = new Image();  
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = url;

		var imgLoader:egret.ImageLoader = new egret.ImageLoader();
		// imgLoader.crossOrigin = "*";
		imgLoader.crossOrigin = 'anonymous'
4. 用egret的 egret.RenderTexture、  toDataURL 必须设置为 canvas模式，并且龙骨动画不许用mesh。详情见下文：egret 各种坑。
  


## egret 各种坑：

### 使用egret.BitmapData.create将base64转化未egret纹理在一些iOS设备上会不成功。
解决：在egret.BitmapData.create 方法中，将其 s.crossOrigin="*" 注释起来即可！

### 涉及到要多个精灵在屏幕上不断移动的,请不要用Tween,效果不佳，会卡顿。也不要用帧回调函数，因为有些老旧设备的帧回调函数比正常的慢。
解决：最好是：用定时器 20。 先用60帧跑跑看流畅不，不行在用30帧的。


###  egret项目里面创建package.json会跟egret的配置冲突，使项目跑不起来啊</br>
版本： egret 5.1.4 </br>
解决：我在根目录下创建了node子目录，在里面配置package.json吧 </br>
如果 npm install 后 运行glup任然有问题。 请手动：</br>
npm install gulp --save-dev</br>
npm install --save-dev gulp-uglify</br>
npm install --save-dev gulp-concat</br>
npm install gulp-strip-debug --save-dev </br>
npm install --g gulp</br>


###  加载网络图片跨域问题 
版本： egret 5.1.4 </br>
解决：还是用h5的img标签或者div设置背景图片
 
	// 加载网络图片 方法 1 ： 
	// 如下测试，canvas模式下没问题，webgl模式下直接报错： The image element contains cross-origin data
	var url = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJmKxx6P6sfNXKhWcOm75xFEHjZSBXJLZCMHic6rmmFj6mAGcALibFvbVzCxfByLQt2ypoAF7Xk7wMQ/132' 
	// var url = 'resource/assets/avt_1.png'
	RES.getResByUrl(url, function(event:any) {
	    var texture: egret.Texture = <egret.Texture>event;
	    var img = new egret.Bitmap(texture)
	    this.imgGp.addChild(img)
	}, this, RES.ResourceItem.TYPE_IMAGE); 


	// 加载网络图片 方法 2
    // 如下测试， canvas webgl 都加载不到图片 报错： No 'Access-Control-Allow-Origin' 
    // 先前试过用此方法加载跨域图片是可以的，估计是有些可以有些不可以
    var url = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJmKxx6P6sfNXKhWcOm75xFEHjZSBXJLZCMHic6rmmFj6mAGcALibFvbVzCxfByLQt2ypoAF7Xk7wMQ/132' 
    var imgLoader:egret.ImageLoader = new egret.ImageLoader();
    imgLoader.crossOrigin = "*";
    // imgLoader.crossOrigin = 'anonymous' //用这句也一样
    imgLoader.once( egret.Event.COMPLETE, function(evt:egret.Event ) {
        var loader:egret.ImageLoader = evt.currentTarget;
        var bmd:egret.BitmapData = loader.data;
        var texture: egret.Texture = new egret.Texture();
        texture.bitmapData = bmd
        var img = new egret.Bitmap(texture)
        this.imgGp.addChild(img)    
    }, this ); 
    imgLoader.load(url);
</br>
###  RenderTexture截图导成base64字符串在android设备上图片变黑
版本： egret 5.1.4 及其之前的版本 </br>
解决： </br>
1. 用 canvas模式咯，但是canvas模式下龙骨动画就不能用蒙皮mesh 功能，官方文档有写的。</br>
2. 不然就用其他插件咯，但是也坑，千万小心，比如html2canvas也是各种问题：出来的图模糊，跨域图片出来。

	//坑1：不能在构造函数里生成纹理，也不能再onAddToStage里面，要等ui渲染出来在生产才行，你写个延时函数吧
	let img = new egret.Bitmap( RES.getRes('xx_png') ) 
	let rt:egret.RenderTexture = new egret.RenderTexture()
	let rect = new egret.Rectangle(0, 0, img.width, img.height) //坑2： 要加 rect 哦  不然尺寸不对
	rt.drawToTexture(img, rect) 
	
	// todo 问题代码，就是下面的转化base64的方法有问题。
	let dataUrl = rt.toDataURL("image/png"); // "image/jpg"
	
	//
	var node = document.createElement('div')
	var str = '<img src="' + dataUrl + '" />'
	node.innerHTML = str;
	document.body.appendChild(node)

如上代码，webgl模式下，用 egret.RenderTexture 的 toDataUR L将纹理转化很base64字符串，然后生成对应img标签（为了实现长按保存图片的功能），
然后大部分的android设备的微信内置浏览器转化出来的base64字符串有问题，生成对应的img会比原图黑。
错误代码 let dataUrl = rt.toDataURL("image/png");

### egret实现圆角
版本： egret 5.1.4</br>
目前只能用mask去实现圆角。</br>
但是当一个滚动试图，里面每项都有圆角图片时就会有bug,滚动起来圆角图片会闪烁。</br>
解决： 滚动试图内的项目圆角用 css3 的 border-radius: 50%; 其他的情况先用如下 方法2 试试。 </br>


	/* mask 实现圆角 */
	// 方法1
	let circle = new egret.Shape();
	img.mask = circle

	// 方法2
	private createItem() {
        let gp = new eui.Group()
        gp.width = 500
        gp.height = 140

        // 
        let img = new eui.Image( RES.getRes('avt_1_png') )
        img.width = 120, img.height = 120
        img.y = 10
        gp.addChild(img)

        // 
        var spr = new egret.Sprite();
        spr.graphics.beginFill(0x18f7ff);
        spr.graphics.drawRoundRect(0, 0, 120, 120, 120, 120);
        spr.graphics.endFill();
        spr.y = 10
        gp.addChild(spr) //这个还是要加，否则渲染有问题，你试试就知道了
        img.mask = spr

        return gp
    }


### 关于egret 多点触摸
版本： egret 5.1.4</br>
evt:egret.TouchEvent 中的 evt.touchPointID  在pc和android设备上第一点触摸值为0，第二点触摸值为1，以此类推！</br>
但是在iOS设备上却不是，iOS的是分配一个唯一标识数字。详情请看我 jinx/MultiTouch.ts

### Tween动画会卡顿的问题
版本： egret 5.1.4</br>
具体请回忆项目 娇兰佳人（jljr-jf）的情况。</br>
就是用tween实现的对象移动动画，但有大量的对象在同时移动时就会出现卡顿</br>
解决：

	//idea1: 在 onFrame 方法里面设置改变对象的x,y属性达到移动效果。如果效果不佳请将 data-frame-rate 改成30试试
	this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this)

	//idea2: 或者用定时器
	this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this)

	//idea3: 或者用第三方库 GreenSock缓动类，该库用到了egret.setTimeout 所以还需要引入 game 库哦
	
 	// idea1 跟 idea2 那种效果更好有待测试？ 实验证明都差不多。
	