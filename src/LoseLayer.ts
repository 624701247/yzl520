
namespace pgame {
export class LoseLayer extends Dlg {
    private findBtn:eui.Button
    private backBtn:eui.Button
    constructor() {
        super(LoseLayerSkin)

        jinx.addTapEvent(this.backBtn, backHome, this)

        jinx.addTapEvent(this.findBtn, this.onFind, this)
    }

    private onFind() {
        // uiMgr.go(SceneId.game, true)
        uiMgr.closeAll()
        uiMgr.go(SceneId.home)
    }
}   //end of class
}   //end of module
