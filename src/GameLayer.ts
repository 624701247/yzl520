
namespace pgame {
export class GameLayer extends Scene {
  
    constructor(isAgain:boolean = false) {
        super(GameLayerSkin)

        this.minX = jinx.scwid -this.gameMap.width
        
        jinx.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this)
        jinx.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)


        // this.boxStatus.init()

        if(isAgain) {
            this.guideGp.visible = false
        }


        jinx.addTapEvent(this.backBtn, backHome, this)
    }

    private backBtn:eui.Button

    private guideTxGp:eui.Group
    private aniGuideStar() {
        for(let idx = 1; idx < this.guideTxGp.numChildren; idx++) {
            let star = this.guideTxGp.getChildAt(idx)
            let oldy = star.y
            setTimeout(function() {
                egret.Tween.get(star, {loop: true})
                .to({y: oldy - 20}, 400)
                .to({y: oldy}, 400)
                .wait(100)
            }, idx * 150);
        }
    }
    private aniGuide() {
        this.guideTxGp.scaleY = 0

        setTimeout(function() {
            egret.Tween.get(this.guideTxGp) 
            .to({scaleY: 1.2}, 200)
            .to({scaleY: 1}, 200)
            .call(this.aniGuideStar, this)
            console.log('sdfsdf')
        }.bind(this), 200);
    }

    public onCome() {
        this.aniGuide()
    }

    private curX:number
    private minX
    private gameMap:GameMap
    private guideGp: eui.Group

    // private boxStatus:BoxStatus
    public onCloseDlg() {   
        // this.boxStatus.init()
    }

    private onBegin(ev:egret.TouchEvent) {
        this.curX = ev.stageX
        this.guideGp.visible = false
    }
    private onMove(ev:egret.TouchEvent) {
        let nx = this.gameMap.x + (ev.stageX - this.curX)
        // console.log('nx', nx)
        if(nx > 0) {
            nx = 0
        }
        else if(nx < this.minX) {
            nx = this.minX
        }
        this.gameMap.x = nx
        this.curX = ev.stageX
    }

    public onBack() {
    }

}   //end of class
}   //end of module
