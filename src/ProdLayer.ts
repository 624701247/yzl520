
namespace pgame {
export class ProdLayer extends Scene {
    private findBtn:eui.Button
    private loveBtn:eui.Button
    constructor(prodId) {
        super(ProdLayerSkin)

        jinx.addTapEvent(this.findBtn, this.ontapFind, this)
        jinx.addTapEvent(this.loveBtn, this.ontapLove, this)

        console.log('sss', prodId)
    }

    private ontapFind() {
        uiMgr.back()
    }

    private ontapLove() {
        uiMgr.go(SceneId.selobj)
    }
}   //end of class
}   //end of module
