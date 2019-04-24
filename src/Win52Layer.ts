
namespace pgame {
export class Win52Layer extends Dlg {
    private closeBtn:eui.Button
    private winNoImg:eui.Image

    private wordImg5:eui.Image
    private wordImg2:eui.Image
    private wordImg0:eui.Image
    private boxBtn:eui.Button
    private descImg:eui.Image

    private findBtn:eui.Button
    private sharedBtn:eui.Button

    constructor(winNo) {
        super(Win52LayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.ontapFind, this)
        jinx.addTapEvent(this.sharedBtn, this.ontapLove, this)

        this.winNoImg.texture = RES.getRes('m' + winNo + '_png')  

        if(winNo == 5) {
            this.descImg.texture = RES.getRes('txt_lack2_png')
        } else {
            this.descImg.texture = RES.getRes('txt_lack5_png')
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
