
namespace pgame {
export class ShareLayer extends Dlg {
    private closeBtn:eui.Button
    constructor() {
        super(null)
        this.top = this.bottom = this.left = this.right = 0

        // mask
        let rect = new eui.Rect()
        rect.fillColor = 0x000000
        rect.alpha = 0.6
        rect.top = rect.bottom = rect.left = rect.right = 0
        this.addChild(rect)

        let contGp = new eui.Group()
        contGp.top = contGp.bottom = contGp.left = contGp.right = 0
        this.addChild(contGp)
        
        // 静态分享图
        /**/ 
        let img = new egret.Bitmap(RES.getRes('share_png'))
        img.anchorOffsetX = img.width, img.anchorOffsetY = 0
        img.x = jinx.scwid, img.y = 0  //设置坐标
        // 
        let rr = jinx.scwid / (img.width + (jinx.scwid - img.x))
        if(rr < 1) {
            img.scaleX = img.scaleY = rr
        }
        this.addChild(img)
        // end of 静态分享图


        // 分享龙骨动画
        /*
        let bone = new jinx.Bone('fenxiang', 'armatureName')        
        bone.x = jinx.scwid, bone.y = 0 //设置坐标，请将龙骨动画锚点设置到右上角
        bone.play('newAnimation')
        contGp.addChild(bone)
        // end of 分享龙骨动画
        */
        
        jinx.addTapEvent(contGp, this.ontapClose, this)
    }

    // 适配ui
    public fitUi() {
    }
}   //end of class
}   //end of module
