
namespace pgame {
export class BoxLayer extends Scene {
    private openBtn:eui.Button
    constructor() {
        super(BoxLayerSkin)

        jinx.addTapEvent(this.openBtn, this.ontapOpen, this)
        carry.addListener(as.action.gameLottery, this.onLottery, this)
        carry.addListener('net_time_out', this.onTimeout, this)
    }
    private onTimeout(ev) {
        carry.weakHint('网络超时！')
        jinx.recoverTapEvent(this.openBtn)
    }

    public onBack() {
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
