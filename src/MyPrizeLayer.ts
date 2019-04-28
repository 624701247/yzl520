
namespace pgame {

export function goPrize(pinfo:as.PrizeInfo) {
    var resinfo = as.getPrizeResInfo(pinfo)
    switch(resinfo.prizeType) {
        case as.PrizeType.sw:
            uiMgr.open(DlgId.swprize, pinfo, UiAni.nil)
            break
        case as.PrizeType.coupon:
            uiMgr.open(DlgId.couponprize, pinfo)
            break
        case as.PrizeType.hx:
            uiMgr.open(DlgId.couponprize, pinfo)
            break
        default:
            carry.weakHint('奖品类型错误：' + resinfo.prizeType)
            break
    }
}

// 
export class PrizeItem extends eui.Component {
    // private iconImg:eui.Image
    // private nameLb:eui.Label
    private detailBtn:eui.Button
    private prizeImg:eui.Image
    constructor() {
        super()
        this.skinName = PrizeItemSkin
    }

    public init(pInfo:as.PrizeInfo) {
        var resinfo = as.getPrizeResInfo(pInfo)
        this.prizeImg.texture =  RES.getRes(resinfo.resName) 
        // this.nameLb.text = pInfo.prizeName + ''

        jinx.addTapEvent(this.detailBtn, function() {
            if(resinfo.prizeType == as.PrizeType.hx) {
                as.getCoupon(pInfo)
            }
            else {
                goPrize(pInfo)
            }
        }, this)
    }
}   //end of class



export class MyPrizeLayer extends Dlg {
    private okBtn:eui.Button
    private scroll:eui.Scroller
    private scrollGp:eui.Group

    private shopBtn:eui.Button

    private npLb:eui.Label

    private ontapShop() {
        uiMgr.open(DlgId.shopdesc)
    }
    constructor() {
        super(MyPrizeLayerSkin)
        
        jinx.addTapEvent(this.okBtn, this.ontapClose, this)
        jinx.addTapEvent(this.shopBtn, this.ontapShop, this)

        // 
        var curY = 0
        this.scroll.scrollPolicyH = eui.ScrollPolicy.OFF //水平方向不给滑动
        var item:PrizeItem
        var len = as.myPrizes.length
        for(var idx = 0; idx < len; idx++) {
            item = new PrizeItem()
            item.horizontalCenter = 0
            item.y = curY
            item.init(as.myPrizes[idx])
            this.scrollGp.addChild(item)
            curY += item.height + 10 
        }

        this.npLb.visible = (len == 0)

        // 如果只有一个奖品，垂直居中显示
        // if(len == 1) {
        //     item.verticalCenter = 0
        // }
    }
}   //end of class
}   //end of module
