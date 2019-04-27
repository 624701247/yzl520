
namespace pgame {
export class Win52Layer extends Dlg {
    private closeBtn:eui.Button
    private winNoImg:eui.Image

    private descImg:eui.Image
    private descImg0:eui.Image
    private descImg1:eui.Image

    private findBtn:eui.Button
    private sharedBtn:eui.Button
    private sharedBtn0:eui.Button

    private backBtn:eui.Button

    // private boxStatus:BoxStatus


    private ontapgname() {
        uiMgr.closeAll()
        uiMgr.go(SceneId.game)
    }

    constructor(winNo) {
        super(Win52LayerSkin)

        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)

        jinx.addTapEvent(this.findBtn, this.ontapFind, this)
        jinx.addTapEvent(this.sharedBtn, this.ontapLove, this)
        jinx.addTapEvent(this.sharedBtn0, this.ontapgname, this)
        

        jinx.addTapEvent(this.backBtn, backHome, this)

        this.winNoImg.texture = RES.getRes('m' + winNo + '_png')  

        // if(winNo == 5) {
        //     this.descImg.texture = RES.getRes('txt_lack2_png')
        // } else if(winNo) {
        //     this.descImg.texture = RES.getRes('txt_lack5_png')
        // }


        if(winNo == 0) {
            this.sharedBtn0.visible = true
            this.findBtn.visible = false
            this.sharedBtn.visible = false
        }
        else {
            this.sharedBtn0.visible = false
            this.findBtn.visible = true
            this.sharedBtn.visible = true            
        }

        var inf = as.getMMCount()
        var curdid = 0
        this.descImg0.visible = false
        this.descImg1.visible = false
        if(inf.remain5 <= 0) {
            this['descImg' + curdid].texture = RES.getRes('txt_l5_png')
            this['descImg' + curdid].visible = true
            curdid++
        }
        if(inf.remain2 <= 0) {
            this['descImg' + curdid].texture = RES.getRes('txt_l2_png')
            this['descImg' + curdid].visible = true
            curdid++
        }
        if(inf.remain0 <= 0) {
            if( this['descImg' + curdid] ) {
                this['descImg' + curdid].texture = RES.getRes('txt_l0_png')
                this['descImg' + curdid].visible = true
            }
            curdid++
        }



    //    this.boxStatus.init()
    }

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
