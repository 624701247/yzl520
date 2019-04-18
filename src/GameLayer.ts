
namespace pgame {
export class GameLayer extends Scene {
    private playBtn:eui.Button

    private boneGp:eui.Group

    private testBtn:eui.Button
    
    constructor() {
        super(GameLayerSkin)

        jinx.addTapEvent(this.playBtn, function() {
            console.log('on tap play')
            // uiMgr.go(SceneId.home, null, UiAni.slide_left)
            uiMgr.back(UiAni.slide_left)
        }, this)

        // 
        jinx.addTapEvent(this.testBtn, function() {
            console.log('on tap test')
            return true
        }, this, -1)
    }

    public onCome() {
        carry.addListener('test', function() {
            jinx.recoverTapEvent(this.testBtn)
        }, this)
        super.onCome()
    }

    public onBack() {
        carry.removeListener('test')
    }

}   //end of class
}   //end of module
