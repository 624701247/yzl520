
namespace pgame {
export class ZdyLayer extends Dlg {
    private closeBtn:eui.Button
    constructor() {
        super(ZdyLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)
    }
}   //end of class
}   //end of module
