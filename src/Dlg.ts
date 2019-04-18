// TypeScript file
namespace pgame {

export class Dlg extends eui.Component {
    constructor(skinName) {
        super()
        this.skinName = skinName
    }

    protected ontapClose() {
        uiMgr.close(this)
    }

    // 适配ui
    public fitUi() {
        // console.log('dlg fit ui:', jinx.rr)
        if(jinx.rr < 1) {
            this.scaleX = this.scaleY = jinx.rr
        }   
    }
}
}