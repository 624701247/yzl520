
namespace pgame {
export class GameMap extends eui.Component {
    constructor() {
        super()
        this.skinName = GameMapSkin

        

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onadd, this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onremove, this)
    }

    private onadd() {
        for(let idx = 0; idx < this.starGp.numChildren; idx++) {
            let star = this.starGp.getChildAt(idx)
            this.aniStar(star)
            jinx.addTapEvent(star, function() {                
                this.ontapStar(idx)
            }, this)
        }

        carry.addListener(as.action.winMM, this.onWinMM, this)
    }
    private onremove() {
        carry.removeListener(as.action.winMM)
    }

    private aniStar(star)  {
        var gap = carry.randomInt(70, 90) / 100
        egret.Tween.get(star, {loop: true})
        // .wait(gap)
        .to({scaleX: 1, scaleY: 1}, 400)
        .to({scaleX: gap, scaleY: gap}, 400)
        .to({scaleX: 1, scaleY: 1}, 400)
    }

    private curId:number
    private ontapStar(idx) {
        console.log('ss', idx)

        soundEff.initBoxJump()

        this.curId = idx

        var rd = Math.random()

        // ktest
        if( (carry.isLocal || carry.isDemo) && carry.urlParam.krd ) {
            rd = carry.urlParam.krd
        }

        if(rd < 0.5) {
            uiMgr.open(DlgId.prod, this.curId)
        } else if(rd < 0.8) {
            carry.spinner.show()
            as.winMM()
        } else {
            uiMgr.open(DlgId.boxjx)
        }
    }
    private onWinMM(ev) {
        carry.spinner.hide()
        if(ev.data) {
            uiMgr.open(DlgId.win52, ev.data)
        } else {
            uiMgr.open(DlgId.prod, this.curId)
        }
    }

    private starGp:eui.Group


}   //end of class
}   //end of module

