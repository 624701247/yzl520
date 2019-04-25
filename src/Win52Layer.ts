
namespace pgame {
export class Win52Layer extends Dlg {
    private closeBtn:eui.Button
    private winNoImg:eui.Image

    private descImg:eui.Image

    private findBtn:eui.Button
    private sharedBtn:eui.Button

    private backBtn:eui.Button

    private boxStatus:BoxStatus

    constructor(winNo) {
        super(Win52LayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.ontapFind, this)
        jinx.addTapEvent(this.sharedBtn, this.ontapLove, this)

        jinx.addTapEvent(this.backBtn, backHome, this)

        this.winNoImg.texture = RES.getRes('m' + winNo + '_png')  

        if(winNo == 5) {
            this.descImg.texture = RES.getRes('txt_lack2_png')
        } else {
            this.descImg.texture = RES.getRes('txt_lack5_png')
        }

       this.boxStatus.init()
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
