
namespace pgame {
export class ZdyLayer extends Dlg {
    private closeBtn:eui.Button
    private txtInp:eui.EditableText

    private resetBtn:eui.Button
    private okBtn:eui.Button
    constructor() {
        super(ZdyLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.resetBtn, this.ontapReset, this)
        jinx.addTapEvent(this.okBtn, this.ontapOk, this)
    }

    private ontapReset() {
        this.txtInp.text = ''
    }

    private ontapOk() {
        var str = this.txtInp.text
        if(!str) {
            carry.weakHint('请输入您的告白宣言')
            return 
        }

        curPosterInfo.txt = str
        uiMgr.close()

        // goPoster({
        //     isMe:true,
        //     oldUrl: '',
        //     txt: curPosterInfo.txt,
        //     obj: curPosterInfo.obj
        // })
    }
}   //end of class
}   //end of module
