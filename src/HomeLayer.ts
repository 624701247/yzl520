// TypeScript file
namespace pgame {
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
        uiMgr.go(SceneId.selobj)

    }
    private ontapFind520() {
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
