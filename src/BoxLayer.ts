
namespace pgame {
export class BoxLayer extends Dlg {
    private openBtn:eui.Button

    private fxImg:eui.Image
    private jqImg:eui.Image

    constructor(is520:boolean) {
        super(BoxLayerSkin)

        this.fxImg.visible = !is520
        this.fxImg.visible = is520

        jinx.addTapEvent(this.openBtn, this.ontapOpen, this)
        carry.addListener(as.action.gameLottery, this.onLottery, this)
        carry.addListener('net_time_out', this.onTimeout, this)

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
        as.gameLottery()
        return true
    }

    private onLottery(ev) {
        jinx.recoverTapEvent(this.openBtn)
        var mpid = ev.data
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
