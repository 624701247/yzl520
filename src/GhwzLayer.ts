
namespace pgame {
export class GhwzLayer extends Dlg {
    private closeBtn:eui.Button

    private len:number
    private curId:number = 0
    private txtList: any[]

    private oldTxt:string
    private oldObj:string

    constructor() {
        super(GhwzLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapCancel, this)

        this.oldObj = curPosterInfo.obj
        this.oldTxt = curPosterInfo.txt

        this.txtList = getAllTxtArr()
        // this.len = txtArr[ curPosterInfo.obj ].length
        this.len = this.txtList.length
        for(var idx = 0; idx < this.txtList.length; idx++) {
            if(this.txtLb.text == this.txtList[idx].txt) {
                this.curId = idx
                break
            }
        }

        this.txtLb.text = this.txtList[this.curId].txt //curPosterInfo.txt

        if(curPosterInfo.obj) {
            this.titleLb.textFlow = <Array<egret.ITextElement>>[ 
                { text: "想对", style:{'bold': false} },
                { text: curPosterInfo.obj, style:{'bold': true} },
                { text:"说的话", style:{'bold': false} }
            ];
        }
        

        jinx.addTapEvent(this.lastBtn, this.ontapLast, this)
        jinx.addTapEvent(this.nextBtn, this.ontapNext, this)
        jinx.addTapEvent(this.okBtn, this.ontapOk, this)
    }

    private ontapCancel() {
        curPosterInfo.obj = this.oldObj
        curPosterInfo.txt = this.oldTxt
        uiMgr.close()
    }

    private ontapLast() {
        if(this.curId == 0) {
            this.curId = this.len - 1
        }
        else {
            this.curId--
        }
        this.updateStatus()
    }
    private ontapNext() {
        if(this.curId == this.len - 1) {
            this.curId = 0
        }  
        else {
            this.curId++
        }
        this.updateStatus()
    }
    private updateStatus() {
        // this.txtLb.text = txtArr[ curPosterInfo.obj ][ this.curId ]
        this.txtLb.text = this.txtList[this.curId].txt


        curPosterInfo.obj = this.txtList[this.curId].obj
        if(curPosterInfo.obj) {
            this.titleLb.textFlow = <Array<egret.ITextElement>>[ 
                { text: "想对", style:{'bold': false} },
                { text: curPosterInfo.obj, style:{'bold': true} },
                { text:"说的话", style:{'bold': false} }
            ];
        }

        // this.lastBtn.visible = !(this.curId == 0)
        // this.nextBtn.visible = !(this.curId == this.len - 1)
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
