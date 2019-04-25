
namespace pgame {
export class ProdLayer extends Dlg {
    private findBtn:eui.Button
    private sharedBtn:eui.Button

    private wordImg5:eui.Image
    private wordImg2:eui.Image
    private wordImg0:eui.Image
    private boxBtn:eui.Button

    private backBtn:eui.Button

    constructor(prodId) {
        super(ProdLayerSkin)

        jinx.addTapEvent(this.findBtn, this.ontapFind, this)
        jinx.addTapEvent(this.sharedBtn, this.ontapLove, this)

        jinx.addTapEvent(this.backBtn, backHome, this)

        console.log('sss', prodId)
        prodId = prodId + 1
        for(var idx = 1; idx <= 7; idx++) {
            this['prodImg' + idx].visible = (prodId == idx)
        }


        var inf = as.getMMCount()
        this.wordImg5.visible = (inf.remain5 > 0)
        this.wordImg2.visible = (inf.remain2 > 0)
        this.wordImg0.visible = (inf.remain0 > 0)

        if(this.wordImg5.visible && this.wordImg2.visible &&　this.wordImg0.visible) {
            egret.Tween.get(this.boxBtn, {loop: true})
            .to({scaleX: 1.2, scaleY: 1.2}, 400)
            .to({scaleX: 1.2, scaleY: 1}, 400)
            .to({scaleX: 1.2, scaleY: 1.2}, 400)
            jinx.addTapEvent(this.boxBtn, this.ontapBox, this)
        }
    }
    private ontapBox() {
        uiMgr.close()
        uiMgr.open(DlgId.box520)
    }

    // private ontapFind() {
    //     uiMgr.back()
    // }

    private ontapFind() {
        // uiMgr.go(SceneId.game)
        uiMgr.close()
    }

    private ontapLove() {
        uiMgr.closeAll()
        uiMgr.go(SceneId.selobj)
    }
}   //end of class
}   //end of module
