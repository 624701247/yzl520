
namespace pgame {
export class GhwzLayer extends Dlg {
    private closeBtn:eui.Button

    private len:number
    private curId:number = 0
    constructor() {
        super(GhwzLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        this.len = txtArr[ curPosterInfo.obj ].length

        if(curPosterInfo.obj) {
            this.titleLb.textFlow = <Array<egret.ITextElement>>[ 
                { text: "想对", style:{'bold': false} },
                { text: curPosterInfo.obj, style:{'bold': true} },
                { text:"说的话", style:{'bold': false} }
            ];
        }
        if(curPosterInfo.txt) {
            this.txtLb.text = curPosterInfo.txt
        }

        jinx.addTapEvent(this.lastBtn, this.ontapLast, this)
        jinx.addTapEvent(this.nextBtn, this.ontapNext, this)
        jinx.addTapEvent(this.okBtn, this.ontapOk, this)
    }

    private ontapLast() {
        if(this.curId == 0) {
            return
        }
        this.curId--
        this.updateStatus()
    }
    private ontapNext() {
        if(this.curId == this.len - 1) {
            return 
        }
        this.curId++
        this.updateStatus()
    }
    private updateStatus() {
        this.txtLb.text = txtArr[ curPosterInfo.obj ][ this.curId ]

        this.lastBtn.visible = !(this.curId == 0)
        this.nextBtn.visible = !(this.curId == this.len - 1)
    }
    private ontapOk() {
        curPosterInfo.txt = this.txtLb.text
        uiMgr.close()
    }

    private titleLb:eui.Label
    private txtLb:eui.Label

    private lastBtn:eui.Button
    private nextBtn:eui.Button
    private okBtn:eui.Button
}   //end of class
}   //end of module
