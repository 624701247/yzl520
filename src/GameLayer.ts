
namespace pgame {
export class GameLayer extends Scene {
  
    constructor() {
        super(GameLayerSkin)

        this.minX = jinx.scwid -this.bgame.width
        
        jinx.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this)
        jinx.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)
    }

    private curX:number
    private minX
    private bgame:eui.Group

    private onBegin(ev:egret.TouchEvent) {
        this.curX = ev.stageX
    }
    private onMove(ev:egret.TouchEvent) {
        let nx = this.bgame.x + (ev.stageX - this.curX)
        // console.log('nx', nx)
        if(nx > 0) {
            nx = 0
        }
        else if(nx < this.minX) {
            nx = this.minX
        }
        this.bgame.x = nx
        this.curX = ev.stageX
        // this.guideImg.visible = false
    }

    public onCome() {
    }

    public onBack() {
    }

}   //end of class
}   //end of module
