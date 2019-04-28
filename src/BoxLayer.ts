
namespace pgame {
export class BoxLayer extends Dlg {
    private openBtn:eui.Button

    private fxImg:eui.Image
    private jqImg:eui.Image

    // private backBtn:eui.Button

    private is520:boolean

    constructor(is520:boolean) {
        super(BoxLayerSkin)

        this.fxImg.visible = !is520
        this.jqImg.visible = is520
        this.is520 = is520


        egret.Tween.get(this.openBtn, {loop: true})
        .to({scaleX: 1.15, scaleY: 1.15}, 600)
        .to({rotation: 10}, 50)
        .to({rotation: -10}, 50)
        .to({rotation: 10}, 50)
        .to({rotation: -10}, 50)
        .to({rotation: 10}, 50)
        .to({rotation: -10}, 50)
        .to({rotation: 0}, 25)
        .to({scaleX: 1, scaleY: 1}, 600)


        jinx.addTapEvent(this.openBtn, this.ontapOpen, this)
        carry.addListener(as.action.gameLottery, this.onLottery, this)
        carry.addListener('net_time_out', this.onTimeout, this)


        // jinx.addTapEvent(this.backBtn, backHome, this)

        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onremove, this)
    }
    private onTimeout(ev) {
        carry.weakHint('网络超时！')
        jinx.recoverTapEvent(this.openBtn)
    }

    public onremove() {
        carry.removeListener(as.action.gameLottery)
        carry.removeListener('net_time_out')
    }

    private ontapOpen() {
        as.gameLottery(this.is520)
        soundEff.initLottery()
        return true
    }

    private onLottery(ev) {
        soundEff.playLottery()

        jinx.recoverTapEvent(this.openBtn)
        var mpid = ev.data
        uiMgr.close()
        if(mpid == -1) {
            uiMgr.open(DlgId.lose)
        }
        else {
            var prizeInfo:as.PrizeInfo = as.myPrizes[mpid]
            goPrize(prizeInfo)
        }
    }
}   //end of class
}   //end of module
