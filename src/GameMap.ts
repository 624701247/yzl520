
namespace pgame {
export class GameMap extends eui.Component {
    constructor() {
        super()
        this.skinName = GameMapSkin

        

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onadd, this)
    }

    private onadd() {
        for(let idx = 0; idx < this.starGp.numChildren; idx++) {
            jinx.addTapEvent(this.starGp.getChildAt(idx), function() {
                this.ontapStar(idx)
            }, this)
        }
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
