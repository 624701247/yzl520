// TypeScript file


/* eg： 
// 
jinx.BgmBtn.init()
let btn = new jinx.BgmBtn()
btn.x = 500
btn.y = 200
this.addChild(btn)
*/


namespace jinx {

var openResName = 'btn_bgm_open_png'    //打开图标
var closeResName = 'btn_bgm_close_png'  //关闭图标
var isAniWhirligig = true  //是否需要播放状态按钮旋转动画

 export class BgmBtn extends eui.Group { 
    private static btnAry:BgmBtn[] = []
    private static initReady:boolean = false

    private openImg:egret.Bitmap
    private closeImg:egret.Bitmap

    private btnId:string 

    // 
    constructor(openRes?:string, closeRes?:string) {
        super()       
        let openImg =  this.createImg(openRes || openResName)
        let closeImg =  this.createImg(closeRes || closeResName)

        this.width = Math.max(openImg.width, closeImg.width)
        this.height = Math.max(openImg.height, closeImg.height)

        openImg.x = closeImg.x = this.width / 2
        openImg.y = closeImg.y = this.height / 2

        this.addChild(openImg)
        this.addChild(closeImg)
        this.openImg = openImg
        this.closeImg = closeImg

        // 
        this.btnId = 'btn-bgm-' + BgmBtn.btnAry.length
        BgmBtn.btnAry.push(this)
        
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this)
        jinx.addTapEvent(this, this.ontapBtn, this)        

        // 
        // if(!BgmBtn.initReady) {
            // carry.bgm.onGetIsPlay(BgmBtn.onChange)
            // BgmBtn.initReady = true
        // }
        // 
        // carry.bgm.getIsPlay()

        this.switchState(pgame.soundEff.curIsPlay)
    }

    public static onChange(isOpen:boolean) {
        for(let btn of BgmBtn.btnAry) {
            btn.switchState(isOpen)
        }
    }

    private createImg(resName) {
        let img = new egret.Bitmap(RES.getRes(resName))
        img.anchorOffsetX = img.width / 2
        img.anchorOffsetY = img.height / 2
        return img
    }

    private removeFromStage() {
        for(let idx = 0; idx < BgmBtn.btnAry.length; idx++) {
            if(BgmBtn.btnAry[idx].btnId == this.btnId) {
                BgmBtn.btnAry.splice(idx, 1)          
            }
        }
    }

    private switchState(isOpen) {
        this.openImg.visible = isOpen
        this.closeImg.visible = !isOpen
        this.aniWhirligig(isOpen)
    }
    // 按钮旋转动画
    private aniWhirligig(isOpen) {
        if(!isAniWhirligig) {
            return 
        }   

        if(isOpen) {
            egret.Tween.get(this.openImg, {loop: true})
            .to({rotation: 360}, 1000)
        }
        else {
            this.openImg.rotation = 0
            egret.Tween.removeTweens(this.openImg)
        }
    }

    // 
    private ontapBtn() {
        // carry.bgm.ctrl()
        var isp = pgame.soundEff.ctrlBgm()
    }
}


}   //end of jinx
