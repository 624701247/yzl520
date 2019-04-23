
namespace pgame {
export class GhwzLayer extends Dlg {
    private closeBtn:eui.Button
    constructor() {
        super(GhwzLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)
    }
}   //end of class
}   //end of module
