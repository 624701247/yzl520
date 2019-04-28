
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

        // this.timer = new egret.Timer(400 * 3)
        // this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this)
    }
    // private onTimer() {
    //     soundEff.playBoxJump()
    //     console.log('sss')
    // }

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


            // this.timer = setInterval(function() {
            //     soundEff.playBoxJump()    
            // }, 400 * 3) 
            // this.timer.start()
            // console.log('star')
            
        }
    }
    private onremove() {
        // clearInterval(this.timer)
        // console.log('rrrrr')
        // this.timer.stop()
    }
    // private timer:egret.Timer = null

    private ontapBox() {
        // clearInterval(this.timer)
        console.log('ttttt')
        // this.timer.stop()

        soundEff.initBoxJump()

        if(this.is520) {
            uiMgr.close()   
            uiMgr.open(DlgId.box520)
        }
    }
}   //end of class





export class BoxStatus1 extends eui.Component {
    private wordImg5:eui.Image
    private wordImg2:eui.Image
    private wordImg0:eui.Image

    private is520:boolean


    constructor() {
        super()
        this.skinName = BoxStatus1Skin
    }

    public init() {
         var inf = as.getMMCount()
        // this.wordImg5.visible = (inf.remain5 > 0)
        // this.wordImg2.visible = (inf.remain2 > 0)
        // this.wordImg0.visible = (inf.remain0 > 0)
        if(inf.remain5 == 0) {
            this.wordImg5.texture = RES.getRes('txt_que_png')
        } else {
            this.wordImg5.texture = RES.getRes('w5_png')
        }

        if(inf.remain2 == 0) {
            this.wordImg2.texture = RES.getRes('txt_que_png')
        } else {
            this.wordImg2.texture = RES.getRes('w2_png')
        }

        if(inf.remain0 == 0) {
            this.wordImg0.texture = RES.getRes('txt_que_png')
        } else {
            this.wordImg0.texture = RES.getRes('w0_png')
        }
    }
}   //end of class


export var getIs520 = function() {
    var inf = as.getMMCount()
    var iss = (inf.remain5 > 0) && (inf.remain2 > 0) && (inf.remain0 > 0)
    return iss
}

}   //end of module
