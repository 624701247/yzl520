
namespace pgame {
export class CouponPrizeLayer extends Dlg {
    private findBtn:eui.Button

    private closeBtn:eui.Button
    constructor(pinfo:as.PrizeInfo) {
        super(CouponPrizeLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.onFind, this)
    }

    private onFind() {
        uiMgr.go(SceneId.game)
        uiMgr.close()
    }
}   //end of class
}   //end of module
