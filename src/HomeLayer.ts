// TypeScript file
namespace pgame {

export function backHome() {
    uiMgr.go(SceneId.home)
    uiMgr.closeAll()
}

export class HomeLayer extends Scene {
    private loveBtn:eui.Button
    private find520Btn:eui.Button
    private myPrizeBtn:eui.Button
    private ruleBtn:eui.Button

    public fitUi() {
        super.fitUi()
    }
    constructor() {
        super(HomeLayerSkin)

        // 
        jinx.addTapEvent(this.loveBtn, this.ontapLove, this)
        jinx.addTapEvent(this.find520Btn, this.ontapFind520, this)
        jinx.addTapEvent(this.myPrizeBtn, this.ontapMyprize, this)
        jinx.addTapEvent(this.ruleBtn, this.ontapRule, this)
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
        var rd = carry.randomInt(1, 2)
        soundEff.playBgm('xunbao' + rd)

        uiMgr.go(SceneId.game)
    }
    // 
    private ontapMyprize(ev:egret.Event) {
        uiMgr.open(DlgId.myprize)
    }
    // 
    private ontapRule(ev:egret.Event) {
        uiMgr.open(DlgId.rule)
    }
}

}
