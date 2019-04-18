// TypeScript file

// egret.Sound 版本 bgm 
// todo 将音频跟bgm按钮分开出来
// 目前弃用，写进了打包ts的忽略列表， 换用 carry.bgm    
namespace jinx {

/* eg:
//step 1 初始化
jinx.Bgm.init({
    bgmResName: 'bg_mp3',
    openResName: 'btn_bgm_open_png', 
    closeResName: 'btn_bgm_close_png', 
    isWhirligig:true
}, true)

// step 2
// 注意 ： iOS 设备不允许默认打开bgm 必须触发打开，请尽快在有按钮的地方调用 Bgm.ctrl(true) 开启bgm
Bgm.ctrl(true)

// step 3 添加背景乐图标
let bgmIcon = new jinx.Bgm()
bgmIcon.x = jinx.scwid - 100
bgmIcon.y = 100
this.addChild(bgmIcon)

*/

export interface BgmInfo {
    bgmResName:string;
    openResName?: string;
    closeResName?: string;
    isWhirligig?: Boolean;
}

export class Bgm extends eui.Group { 

    private static isOpen:boolean 
    private static bgmInfo: BgmInfo

    private static soundCh: egret.SoundChannel
    private static sound: egret.Sound

    private static iconAry:Bgm[] = []


    private openImg:egret.Bitmap
    private closeImg:egret.Bitmap

    // 初始化
    public static init(bgmInfo:BgmInfo, isOpen:boolean = true) {
        Bgm.bgmInfo = bgmInfo

        // 
        if(egret.Capabilities.os == 'iOS' && isOpen == true) {
           isOpen = false
        }
        Bgm.isOpen = isOpen 

        Bgm.sound = RES.getRes(bgmInfo.bgmResName);
        Bgm.switchSound()  
    } 

    // 
    public static getCurBgmState() {
        return Bgm.isOpen
    }

    // 切换状态
    public static ctrl(isOpen?:boolean) {
        if(isOpen == null) {
            Bgm.isOpen = !Bgm.isOpen
        }
        else {
            Bgm.isOpen = isOpen
        }
        Bgm.switchSound()
        for(let icon of Bgm.iconAry) {
            icon.switchIcon()
        }
    }  

    private static switchSound() {
        if(Bgm.isOpen) {
            if(Bgm.soundCh) {
                Bgm.soundCh.volume = 1
                // Bgm.sound.play()
            }
            else {
                Bgm.soundCh = Bgm.sound.play()
                Bgm.soundCh.volume = 1
            }
        }
        else {
            if(Bgm.soundCh) {
                // Bgm.soundCh.stop()
                Bgm.soundCh.volume = 0
            }
        }
    }

    constructor(openRes?:string, closeRes?:string) {
        super()

        if(Bgm.bgmInfo == null) {
            console.error("jinx.bgm 还没有 初始化 init")
            return 
        }

        // 
        if(openRes == null) {
            openRes = Bgm.bgmInfo.openResName
        }
        if(closeRes == null) {
            closeRes = Bgm.bgmInfo.closeResName
        }

        // 
        let openImg =  this.createImg(openRes)
        let closeImg =  this.createImg(closeRes)

        this.width = Math.max(openImg.width, closeImg.width)
        this.height = Math.max(openImg.height, closeImg.height)
        this.anchorOffsetX = this.width / 2
        this.anchorOffsetY = this.height / 2

        openImg.x = this.width / 2, openImg.y = this.height / 2
        closeImg.x = this.width / 2, closeImg.y = this.height / 2
        this.addChild(openImg)
        this.addChild(closeImg)
        this.openImg = openImg
        this.closeImg = closeImg

        // 
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBtn, this)

        // 
        this.name = 'bgmIcon_' + Bgm.iconAry.length
        Bgm.iconAry.push(this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this)

        Bgm.ctrl(Bgm.isOpen)
    }

    private removeFromStage() {
        let id = parseInt( this.name.split('-')[1] )
        Bgm.iconAry.splice(id, 1)  
    }

    private createImg(res) {
        let img = new egret.Bitmap(RES.getRes(res))
        img.anchorOffsetX = img.width / 2
        img.anchorOffsetY = img.height / 2
        return img
    }
    private switchIcon() {
        console.log(this.name, Bgm.isOpen)
        if(Bgm.isOpen) {
            this.openImg.visible = true
            this.closeImg.visible = false
        }
        else {
            this.openImg.visible = false
            this.closeImg.visible = true
        }
        this.aniWhirligig()
    }

    // 
    private onClickBtn() {
        Bgm.ctrl()
    }

    // 按钮旋转动画
    private aniWhirligig() {
        if(!Bgm.bgmInfo.isWhirligig) {
            return 
        }   

        if(Bgm.isOpen) {
            egret.Tween.get(this, {loop: true})
            .to({rotation: 360}, 1000)
        }
        else {
            this.rotation = 0
            egret.Tween.removeTweens(this)
        }
    }
}  //end of bgm


}   //end of jinx
