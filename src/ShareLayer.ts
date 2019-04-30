
namespace pgame {
export class ShareLayer extends Dlg {
    private closeBtn:eui.Button

    private qq1Img:eui.Image
    private qq2Img:eui.Image
    private qq3Img:eui.Image
    private qq4Img:eui.Image

    // private 
    
    private aniQQ(id) {
        if(id == 1) {
            var oldTop = this.qq1Img.top
            if(oldTop) {
                egret.Tween.get(this.qq1Img, {loop: true})
                .to({top: oldTop - 40}, 1000)
                .to({top: oldTop}, 1000)
            }
        }
        // if(id == 1) {
        //     let pp = this['p' + id + 'Img']
        //     if(pp) {
        //         let oldTop1 = pp.top
        //         let oldRight1 = pp.right 
        //         egret.Tween.get(pp, {loop: true})
        //         .to({
        //             top: oldTop1 - 30,
        //             right: oldRight1 - 30 
        //         }, 700)
        //         .to({
        //             top: oldTop1,
        //             right: oldRight1 
        //         }, 700)
        //     }
        // }
        if(id == 4) {
            var oldTop = this.qq4Img.top
            if(oldTop) {
                egret.Tween.get(this.qq4Img, {loop: true})
                .wait(200)
                .to({top: oldTop - 30}, 800)
                .to({top: oldTop}, 800)
            }
        }
    }

    constructor() {
        super(ShareLayerSkin)
        // this.top = this.bottom = this.left = this.right = 0

        for(let idx = 1; idx <= 4; idx++) {
            let qq = this['qq' + idx + 'Img']
            let oldTop = qq.top
            qq.top -= 600
            egret.Tween.get(qq)
            .wait( (idx - 1) * 200)
            .to({top: oldTop}, 800)
            .call(function() {
                this.aniQQ(idx)
            }, this)

            let pp = this['p' + idx + 'Img']
            if(pp) {
                let oldTop1 = pp.top
                pp.top -= 600
                egret.Tween.get(pp)
                .wait( (idx - 1) * 200)
                .to({top: oldTop1}, 800)
            }
        }


        
        


        // mask
        /*
        let rect = new eui.Rect()
        rect.fillColor = 0x000000
        rect.alpha = 0.6
        rect.top = rect.bottom = rect.left = rect.right = 0
        this.addChild(rect)
        */

        let contGp = new eui.Group()
        contGp.top = contGp.bottom = contGp.left = contGp.right = 0
        this.addChild(contGp)
        
        // 静态分享图
        /*
        let img = new egret.Bitmap(RES.getRes('share_png'))
        img.anchorOffsetX = img.width, img.anchorOffsetY = 0
        img.x = jinx.scwid, img.y = 0  //设置坐标
        // 
        let rr = jinx.scwid / (img.width + (jinx.scwid - img.x))
        if(rr < 1) {
            img.scaleX = img.scaleY = rr
        }
        this.addChild(img)*/ 
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
