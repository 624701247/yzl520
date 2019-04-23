
namespace pgame {
export class GameMap extends eui.Component {
    constructor() {
        super()
        this.skinName = GameMapSkin

        

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onadd, this)
    }

    private onadd() {
        for(let idx = 0; idx < this.starGp.numChildren; idx++) {
            let star = this.starGp.getChildAt(idx)
            this.aniStar(star)
            jinx.addTapEvent(star, function() {                
                this.ontapStar(idx)
            }, this)
        }
    }

    private aniStar(star)  {
        var gap = carry.randomInt(70, 90) / 100
        egret.Tween.get(star, {loop: true})
        // .wait(gap)
        .to({scaleX: 1, scaleY: 1}, 400)
        .to({scaleX: gap, scaleY: gap}, 400)
        .to({scaleX: 1, scaleY: 1}, 400)
    }

    private ontapStar(idx) {
        console.log('ss', idx)

        // 产品展示页 或者  惊喜宝箱页
        // uiMgr.go(SceneId.prod, idx)
        uiMgr.go(SceneId.box)
    }

    private starGp:eui.Group


}   //end of class
}   //end of module

