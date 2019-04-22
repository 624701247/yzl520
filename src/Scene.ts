// TypeScript file
namespace pgame {

export class Scene  extends eui.Component {
    constructor(skinName) {
		super()
        this.skinName = skinName
        this.top = this.bottom = this.left = this.right = 0
        this.addBgmBtn()
    }

    // 适配ui
    protected bgImg:any
    public fitUi() {
        // console.log('scene fit ui', jinx.rr)
        if(this.bgImg) {
            jinx.fitCover(this.bgImg)
        }
    }

    protected addBgmBtn() {
        let btn = new jinx.BgmBtn()
        btn.right = btn.top = 10
        this.addChild(btn)
    }

    // 场景出现(切换场景结束后)回调  监听网络事件写在这里
    public onCome() {
    }

    // 场景退出回调 移除网络事件监听写在这里
    public onBack() {
    }

    // 对话框弹出挡住了该场景
    public onOpenDlg() {
    }
    public onCloseDlg() {   
    }
}

}