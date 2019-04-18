// TypeScript file
namespace jinx {

// 弃用，换用 carry.WeakHint

// 弱提示 egret 版本
// export class WeakHint extends eui.Group{
//     constructor(txt) {
//         super()

//         this.height = 120
//         this.width = 1476
//         this.horizontalCenter = 0
//         this.verticalCenter = 30


//         //
//         let lb = new eui.Label()
//         lb.size = 60
//         lb.text = txt
//         lb.horizontalCenter = 0
//         lb.verticalCenter = 0

//         //
//         let rect = new eui.Rect()
//         this.addChild(rect)
//         rect.alpha = 0.6
//         rect.fillColor = 0x000000
//         rect.height = this.height
//         rect.width = 100 + lb.width
//         rect.horizontalCenter = 0
//         rect.verticalCenter = 0
//         rect.ellipseWidth = 30
//         rect.ellipseHeight = 30

//         this.addChild(lb)

//         egret.Tween.get(this, {loop:false})
//         .to({verticalCenter: -30}, 300) 
//         .wait(400)
//         .call(function() {
//             this.parent.removeChild(this)
//         }, this)
//     }
// }

}   //end of jinx