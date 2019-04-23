
namespace pgame {
export class CouponPrizeLayer extends Dlg {
    private findBtn:eui.Button
    private getBtn:eui.Button

    // private closeBtn:eui.Button
    private prizeImg:eui.Image

    private resinfo: any
    private pinfo: as.PrizeInfo

    constructor(pinfo:as.PrizeInfo) {
        // super(CouponPrizeLayerSkin)
        super(WinPrizeSkin)

        // this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.onFind, this)
        jinx.addTapEvent(this.getBtn, this.ontapGet, this)

        this.resinfo = as.getPrizeResInfo(pinfo)
        this.pinfo = pinfo
        this.prizeImg.texture = RES.getRes(this.resinfo.resName)
    }

    private onFind() {
        uiMgr.go(SceneId.game)
        uiMgr.close()
    }

    private ontapGet() {
        var type = this.resinfo.prizeType
        if(type == as.PrizeType.coupon) {
            as.getCoupon()
        }
        else if(type == as.PrizeType.sw) {
            uiMgr.open(DlgId.swprize, this.pinfo)
        }
    }   
}   //end of class
}   //end of module
