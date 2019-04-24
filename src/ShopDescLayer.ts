
namespace pgame {

// 
export class ShopItem extends eui.Component {
    private shopLb:eui.Label
    private addrLb:eui.Label

    constructor() {
        super()
        this.skinName = ShopItemSkin
    }

    public init(sinfo) {
        this.shopLb.text = sinfo.stop
        this.addrLb.text = sinfo.addr
        this.height += this.addrLb.height - 28
    }
}   //end of class


export class ShopDescLayer extends Dlg {
    private closeBtn:eui.Button
    private knowBtn:eui.Button

    private scroll:eui.Scroller
    private scrollGp:eui.Group

    private shenInp:eui.EditableText
    private shiInp:eui.EditableText
    // private quInp:eui.EditableText
    private areaBtn:eui.Button


    constructor() {
        super(ShopDescLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)
        this.knowBtn && jinx.addTapEvent(this.knowBtn, this.ontapClose, this)



        sarea.addSelEventListener(this.onArea.bind(this))
        sarea.init(areaData, 2, 'area')
        this.shenInp.text = '上海'
        this.shiInp.text = '上海'
        // this.quInp.text = '松江区'
        this.getCurSinfo()
        jinx.addTapEvent(this.areaBtn, this.ontapArea, this)

        this.scroll.scrollPolicyH = eui.ScrollPolicy.OFF //水平方向不给滑动
    }

    private getCurSinfo() {
        // [this.quInp.text]['items']
        var olist = areaData[this.shenInp.text]['items'][this.shiInp.text]['items'] || []

        this.scrollGp.removeChildren()
        
         // 
        var curY = 0
        
        var item:ShopItem
        var len = olist.length
        for(var idx = 0; idx < len; idx++) {
            item = new ShopItem()
            // item.horizontalCenter = 0
            item.x = 0
            item.y = curY
            item.init(olist[idx])
            this.scrollGp.addChild(item)
            curY += item.height + 20 
        }

        this.scroll.viewport.scrollV = 0
    }

    private onArea(data, tag) {
        console.log(tag + ' ：sel ', data)
        this.shenInp.text = data[0] || ''
        this.shiInp.text = data[1] || ''
        // this.quInp.text = data[2] || ''

        this.getCurSinfo()
    }
    private ontapArea() {
        sarea.open([this.shenInp.text, this.shiInp.text])
    }

}   //end of class
}   //end of module
