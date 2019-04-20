
namespace pgame {
export class LoseLayer extends Dlg {
    private findBtn:eui.Button
    private closeBtn:eui.Button
    constructor() {
        super(LoseLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.onFind, this)
    }

    private onFind() {
        uiMgr.go(SceneId.game)
        uiMgr.close()
    }
}   //end of class
}   //end of module
