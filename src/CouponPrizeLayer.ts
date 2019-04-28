
namespace pgame {
export class CouponPrizeLayer extends Dlg {
    private findBtn:eui.Button

    private getBtn:eui.Button
    private ylqImg:eui.Image

    // private closeBtn:eui.Button
    private prizeImg:eui.Image

    private resinfo: any
    private pinfo: as.PrizeInfo

    // private backBtn:eui.Button

    constructor(pinfo:as.PrizeInfo) {
        // super(CouponPrizeLayerSkin)
        super(WinPrizeSkin)

        // this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.onFind, this)



        

        // jinx.addTapEvent(this.backBtn, backHome, this)  

        this.resinfo = as.getPrizeResInfo(pinfo)
        this.pinfo = pinfo
        this.prizeImg.texture = RES.getRes(this.resinfo.resName)

        if(this.resinfo.prizeType == as.PrizeType.hx) {
            this.getBtn.visible = false
            this.ylqImg.visible = true
        } else {
            this.getBtn.visible = true
            this.ylqImg.visible = false
            jinx.addTapEvent(this.getBtn, this.ontapGet, this)
        }
    }   

    private onFind() {
        var rd = carry.randomInt(1, 2)
        soundEff.playBgm('xunbao' + rd)

        uiMgr.go(SceneId.game, true)
        uiMgr.close()
    }

    private ontapGet() {
        var type = this.resinfo.prizeType
        if(type == as.PrizeType.coupon) {
            as.getCoupon(this.pinfo)
        }
        else if(type == as.PrizeType.sw) {
            uiMgr.open(DlgId.swprize, this.pinfo, UiAni.nil)
        }
    }   
}   //end of class
}   //end of module
