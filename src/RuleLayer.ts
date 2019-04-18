
namespace pgame {
export class RuleLayer extends Dlg {
    private closeBtn:eui.Button
    private knowBtn:eui.Button

    constructor() {
        super(RuleLayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)
        this.knowBtn && jinx.addTapEvent(this.knowBtn, this.ontapClose, this)
    }
}   //end of class
}   //end of module
