
namespace pgame {
export class HomeDescLayer extends Dlg {
    // private closeBtn:eui.Button

    public fitUi() {
    }

    constructor() {
        super(HomeDescLayerSkin)

        this.top = this.bottom = this.left = this.right = 0

        jinx.addTapEvent(this, this.ontapClose, this)
    }
}   //end of class
}   //end of module
