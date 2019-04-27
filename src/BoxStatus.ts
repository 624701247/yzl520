
namespace pgame {
export class BoxStatus extends eui.Component {
    private wordImg5:eui.Image
    private wordImg2:eui.Image
    private wordImg0:eui.Image
    private boxBtn:eui.Button

    private is520:boolean


    constructor() {
        super()
        this.skinName = BoxStatusSkin

        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onremove, this)
    }

    public init() {
         var inf = as.getMMCount()
        this.wordImg5.visible = (inf.remain5 > 0)
        this.wordImg2.visible = (inf.remain2 > 0)
        this.wordImg0.visible = (inf.remain0 > 0)

        this.is520 = (inf.remain5 > 0) && (inf.remain2 > 0) && (inf.remain0 > 0)

        if(this.is520) {
            egret.Tween.get(this.boxBtn, {loop: true})
            .to({scaleX: 0.5, scaleY: 0.5}, 400)
            .to({scaleX: 0.62, scaleY: 0.62}, 400)
            .to({scaleX: 0.5, scaleY: 0.5}, 400)
            jinx.addTapEvent(this.boxBtn, this.ontapBox, this)


            this.timer = setInterval(function() {
                soundEff.playBoxJump()    
            }, 400 * 3) 
            

        }
    }
    private onremove() {
        clearInterval(this.timer)
    }
    private timer = null

    private ontapBox() {
        if(this.is520) {
            uiMgr.close()   
            uiMgr.open(DlgId.box520)
        }
    }
}   //end of class
}   //end of module
