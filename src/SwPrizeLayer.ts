// 实物奖品奖品页面、提交领奖信息页面
declare var sarea
declare var areaData

namespace pgame {
export class SwPrizeLayer extends Dlg {
    private formGp:eui.Group
    private nameInp:eui.EditableText
    private telInp:eui.EditableText
    private addrInp:eui.EditableText
    private submitBtn:eui.Button
    // 地区选择器 
    private shenInp:eui.EditableText
    private shiInp:eui.EditableText
    private quInp:eui.EditableText
    private areaBtn:eui.Button

    // 
    private infoGp:eui.Group
    private nameLb:eui.Label
    private telLb:eui.Label
    private addrLb:eui.Label
    private changeBtn:eui.Button
    private okBtn:eui.Button

    // 
    private prizeImg:eui.Image

    // 
    private pinfo:as.PrizeInfo

    constructor(pinfo:as.PrizeInfo) {
        super(SwPrizeLayerSkin)
        this.pinfo = pinfo || as.myPrizes[0]

        // kone todo 奖品图
        var resinfo = as.getPrizeResInfo(this.pinfo)
        this.prizeImg.texture = RES.getRes(resinfo.resName)
        
        
        if(this.pinfo.name) {
            this.initSucc()
        }
        else {
            this.initForm()
        }

        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this)
        carry.addListener(as.action.saveLotteryInfo, this.onSave, this)
        // 
        jinx.addTapEvent(this.submitBtn, this.ontapSubmit, this)
        jinx.addTapEvent(this.okBtn, this.ontapClose, this)
        jinx.addTapEvent(this.changeBtn, this.ontapChange, this)

        // 
        if(this.shenInp) {
            sarea.addSelEventListener(this.onArea.bind(this))
            sarea.init(areaData, null, 'area')
            jinx.addTapEvent(this.areaBtn, this.ontapArea, this)
        }
    }
    private onArea(data, tag) {
        console.log(tag + ' ：sel ', data)
        this.shenInp.text = data[0] || '-'
        this.shiInp.text = data[1] || '-'
        this.quInp.text = data[2] || '-'
    }
    private ontapArea() {
        sarea.open([this.shenInp.text, this.shiInp.text, this.quInp.text])
    }

    private onRemove() {
        carry.removeListener(as.action.saveLotteryInfo)
    }

    private initForm() {
        this.formGp.visible = true
        this.infoGp.visible = !this.formGp.visible

        this.nameInp.text = this.pinfo.name || ''
        this.telInp.text = this.pinfo.phone || ''
        this.addrInp.text = this.pinfo.address || ''

        // 
        if(this.shenInp && this.pinfo.area) {
            var oldArea = this.pinfo.area.split('/')
            this.shenInp.text = oldArea[0] || ''
            this.shiInp.text = oldArea[1] || ''
            this.quInp.text = oldArea[2] || ''
        }
    }

    private initSucc() {
        this.formGp.visible = false
        this.infoGp.visible = !this.formGp.visible
        
        var clr = this.nameLb.textColor
        this.nameLb.textFlow = <Array<egret.ITextElement>>[ 
            { text: "姓名：", style:{"textColor":0x999999} },
            { text: this.pinfo.name, style:{"textColor":clr} }
        ];
        this.telLb.textFlow = <Array<egret.ITextElement>>[ 
            { text: "手机：", style:{"textColor":0x999999} },
            { text: this.pinfo.phone, style:{"textColor":clr} }
        ];

        var addr = this.pinfo.address
        if(this.shenInp && this.pinfo.area) {
            var tmp = this.pinfo.area.split('/')
            var shen = tmp[0] || ''
            var shi = tmp[1] || ''
            var qu = tmp[2] || ''
            var area = shen
            if(shen != shi) {
                area += shi
            }
            if(shi != qu) {
                area += qu
            }
            addr = area + addr
        }
        this.addrLb.textFlow = <Array<egret.ITextElement>>[ 
            { text: "地址：", style:{"textColor":0x999999} },
            { text: addr, style:{"textColor":clr} }
        ];

        // this.nameLb.text = '姓名：' + this.pinfo.name
        // this.telLb.text = '手机：' + this.pinfo.phone
        // this.addrLb.text = '地址：' + this.pinfo.addr
    }

    private ontapSubmit() {
        if(this.nameInp.text == '') {
            carry.weakHint(this.nameInp.prompt)
            return 
        }
        if(this.telInp.text == '') {
            carry.weakHint(this.telInp.prompt)
            return 
        }
        if(!carry.checkIsTel(this.telInp.text)) {
            carry.weakHint('手机号码格式不对')
            return 
        }

        var area = '';
        if(this.shenInp) {
            if(this.shenInp.text == '') {
                carry.weakHint('请选择省市区')
                return
            }
            area = this.shenInp.text + '/' + this.shiInp.text + '/' + this.quInp.text
        }

        if(this.addrInp.text == '') {
            carry.weakHint(this.addrInp.prompt)
            return 
        }
        
        as.saveLotteryInfo(this.pinfo, this.nameInp.text, this.telInp.text, area, this.addrInp.text)
        return true
    }
    private onSave(ev) {
        jinx.recoverTapEvent(this.submitBtn)
        if(ev.data) {
            this.initSucc()
        }
    }
    private ontapChange() {
        this.initForm()
    }
}   //end of class
}   //end of module
