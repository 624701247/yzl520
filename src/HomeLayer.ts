// TypeScript file
namespace pgame {

export function backHome() {
    uiMgr.go(SceneId.home)
    uiMgr.closeAll()
}

var isFirstHome:boolean = true

export class HomeLayer extends Scene {
    private loveBtn:eui.Button
    private find520Btn:eui.Button
    private myPrizeBtn:eui.Button
    private ruleBtn:eui.Button


    private titleImg:eui.Image
    private xin1Img:eui.Image
    private qq1Img:eui.Image

    private hand1Img:eui.Image
    private hand2Img:eui.Image

    public fitUi() {
        super.fitUi()
    }
    constructor() {
        super(HomeLayerSkin)

        egret.Tween.get(this.hand1Img, {loop:true})
        .to({scaleX:1.14, scaleY:1.14}, 500)
        .to({scaleX:1, scaleY:1}, 500)

        egret.Tween.get(this.hand2Img, {loop:true})
        .to({scaleX:1.14, scaleY:1.14}, 500)
        .to({scaleX:1, scaleY:1}, 500)


        egret.Tween.get(this.titleImg, {loop: true})
        .to({scaleX:1.1, scaleY:1.1}, 600)
        .to({scaleX:1, scaleY:1}, 600)

        egret.Tween.get(this.xin1Img, {loop: true})
        .to({scaleX:1.2, scaleY:1.2, rotation: 30}, 600)
        .to({scaleX:1, scaleY:1, rotation:0}, 600)

        var oldTop = this.qq1Img.top
        if(oldTop) {
            egret.Tween.get(this.qq1Img, {loop: true})
            .to({top: oldTop - 30}, 800)
            .to({top: oldTop}, 800)
        }


        // 
        jinx.addTapEvent(this.loveBtn, this.ontapLove, this)
        jinx.addTapEvent(this.find520Btn, this.ontapFind520, this)
        jinx.addTapEvent(this.myPrizeBtn, this.ontapMyprize, this)
        jinx.addTapEvent(this.ruleBtn, this.ontapRule, this)

        if(isFirstHome) {
            isFirstHome = false
            uiMgr.open(DlgId.homedesc, null, UiAni.nil)
        }
    }

    // 
    private ontapLove(ev:egret.Event) {
        // if(as.myShare.posterUrl) { //
        //     uiMgr.go(SceneId.poster, {
        //         isMe:true,
        //         oldUrl: as.myShare.posterUrl
        //     })
        // } else {
        //     uiMgr.go(SceneId.selobj)
        // }

        soundEff.playBgm('love')

        // 不显示以前的海报
        uiMgr.go(SceneId.selobj)
    }
    private ontapFind520() {
        soundEff.initBoxJump()
        soundEff.initMM()

        var rd = carry.randomInt(1, 2)
        soundEff.playBgm('xunbao' + 1)

        uiMgr.go(SceneId.game)
    }
    // 
    private ontapMyprize(ev:egret.Event) {
        soundEff.initBoxJump()

        uiMgr.open(DlgId.myprize)
    }
    // 
    private ontapRule(ev:egret.Event) {
        soundEff.initBoxJump()

        uiMgr.open(DlgId.rule)
    }
}

}
