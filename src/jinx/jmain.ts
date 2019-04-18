namespace jinx {   
    //设计稿 宽高
    export var designWid:number
    export var designHei:number

    //实际屏幕 宽高
    export var scwid:number
    export var schei:number

    // 实际尺寸 / 设计稿尺寸
    export var rr: number 

    // egret 舞台
    export var stage:egret.Stage = null

    var el_egret;

    var resize = function() {
        scwid = stage.stageWidth
        schei = stage.stageHeight
        if(stage.scaleMode == egret.StageScaleMode.FIXED_HEIGHT) {
            rr = jinx.scwid / jinx.designWid
        }
        else if(stage.scaleMode == egret.StageScaleMode.FIXED_WIDTH) {
            rr = jinx.schei / jinx.designHei
        }
        else {
            console.error('请使用宽适配，或高适配')    
        }
        // console.log('re size',stage.scaleMode, scwid, schei, rr)
    }

    /* 限定最大宽高适配
    推荐方案： 高适配的限定最大宽度，宽适配的限定最大高度
    @param obj:适配对象
    @return : {
        sc:该对象的缩放值, 
        hGap: 假设该对象水平居中，该对象距离左、右两边的距离
        vGap:同上理
    }    */
    export var fitMaxSize = function (obj:egret.DisplayObject, maxWid, maxHei):{sc:number;hGap:number;vGap:number} {
        var sc = 1
        var relWid = obj.width
        var relHei = obj.height
        if(maxWid != null && relWid > maxWid) {
            sc = maxWid / relWid 
            relWid = maxWid            
        }

        if(maxHei != null && relHei > maxHei) {
            sc = Math.max(sc, maxHei / relHei) 
            relHei = maxHei            
        }

        obj.scaleX = obj.scaleY = sc
    
        return {
            sc:sc,
            hGap: (jinx.scwid - relWid) / 2,
            vGap: (jinx.schei - relHei) / 2
        }
    }

    /* 缩放对象使其刚好铺满给定的 wid、hei
    @param wid: 需要铺满的宽度，默认为 浏览器宽度
    @param hei: 需要铺满的高度，默认为 浏览器高度
    */ 
    export var fitCover = function(obj:egret.DisplayObject, wid:number = 0, hei:number = 0) {
        if(!obj.width || !obj.height) {
            console.error('请先为该对象设置宽高')
            return 
        }
        wid = wid || jinx.scwid
        hei = hei || jinx.schei
        var rr1 = wid / obj.width
        var rr2 = hei / obj.height
        obj.scaleX = obj.scaleY = Math.max(rr1, rr2)
    }

    export var resetRem = function() {
        if(stage.scaleMode == egret.StageScaleMode.FIXED_HEIGHT) {
            carry.setRem(true)
        }
        else if(stage.scaleMode == egret.StageScaleMode.FIXED_WIDTH) {
            carry.setRem()
        }
    }

    // 
    export var setFixedWid = function() {
        if(stage.scaleMode == egret.StageScaleMode.FIXED_WIDTH) {
            console.log('已经是宽适配了')
            return 
        }
        console.log('修改为宽适配')
        el_egret.setAttribute('data-scale-mode', 'fixedWidth')
        stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH //修改完会触发  egret.Event.RESIZE 事件
    }
    //
    export var setFixedHei = function() {
        if(stage.scaleMode == egret.StageScaleMode.FIXED_HEIGHT) {
            console.log('已经是高适配了')
            return 
        }
        console.log('修改为高适配')
        el_egret.setAttribute('data-scale-mode', 'fixedHeight')
        stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT
    }

    // 要用jinx, 必须先调用此初始化
    export var init = function(stg:egret.Stage, rsFunc, that) {
        stage = stg

        // 
        el_egret = document.querySelector('.egret-player')
        if(el_egret) {
            designWid = parseInt(el_egret.getAttribute("data-content-width"))
            designHei = parseInt(el_egret.getAttribute("data-content-height"))
        }
        else {
            console.error('找不到元素 egret-player')
        }
        resize()
        stage.addEventListener(egret.Event.RESIZE, function() {
            resize()
            resetRem()
            rsFunc.call(that)
        }, this)
    }
}   //end of jinx


/*
以下脚本，项目中不需要的剪切到 tsconfig.json 中 exclude 去：

"src/jinx/BgmBtn.ts",

"src/jinx/bone.ts",

"src/jinx/Dom.ts",

"src/jinx/jutils.ts",

"src/jinx/TelCode.ts",

"src/jinx/video.ts",

*/

