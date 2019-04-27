
namespace pgame {
export class ProdLayer extends Dlg {
    private findBtn:eui.Button
    private sharedBtn:eui.Button

    // private boxStatus:BoxStatus

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

        // this.boxStatus.init()

    }

    // private ontapFind() {
    //     uiMgr.back()
    // }

    private ontapFind() {
        uiMgr.close()
    }

    private ontapLove() {
        uiMgr.closeAll()

        soundEff.playBgm('love')
        uiMgr.go(SceneId.selobj)
    }
}   //end of class
}   //end of module
