// TypeScript file
namespace jinx {

/*
eg:

let slideBanner = new jinx.SlideBanner(this.bannerGp.width, this.bannerGp.height)
slideBanner.addItems([
    new eui.Image(RES.getRes('btn_bgm_close_png')),
    new eui.Image(RES.getRes('btn_bgm_open_png')),
    new eui.Image(RES.getRes('avt_1_png')),
    new eui.Image(RES.getRes('qr_png'))
])
this.bannerGp.addChild(slideBanner)

*/

export class SlideBanner extends eui.Group {
    private scroll:eui.Scroller
    private contGp:eui.Group
    private typ:number // 1左右， 2上下

    private startPos
    private startTime

    private itemNum:number
    private curId:number
    private wait_ani:boolean = false

    private moveSize:number

    constructor(wid:number, hei:number, typ:number = 1, loop:boolean = true) {
        super()
        this.typ = typ
        this.width = wid, this.height = hei

        if(this.typ == 1) {
            this.moveSize = this.width
        }
        else if(this.typ == 2) {
            this.moveSize = this.height
        }

        this.scroll = new eui.Scroller()
        this.scroll.top = this.scroll.bottom = this.scroll.left = this.scroll.right = 0
        this.addChild(this.scroll)

        var viewGp = new eui.Group()
        this.scroll.viewport = viewGp

        this.contGp = new eui.Group()
        viewGp.addChild(this.contGp)

        this.scroll.scrollPolicyH = eui.ScrollPolicy.OFF
        this.scroll.scrollPolicyV = eui.ScrollPolicy.OFF
        this.scroll.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this)
        this.scroll.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this)
    }

    public addItems(items:any[]) {
        this.curId = 0
        this.itemNum = items.length
        for(let idx = 0; idx < items.length; idx++) {
            this.addItem(items[idx], idx)
        }
    }
    private addItem(item:any, id) {
        item.width = this.width, item.height = this.height
        if(this.typ == 1) {
            item.x = id * this.width
            item.y = 0
        }
        else if(this.typ == 2) {
            item.x = 0
            item.y = id * this.height
        }
        this.contGp.addChildAt(item, id)
    }

    private onBegin(ev:egret.TouchEvent) {
        this.startPos = [ev.localX, ev.localY]
        // console.log('start', ev.localX, ev.localY)
        this.startTime = (new Date()).getTime()
    }
    private onEnd(ev:egret.TouchEvent) {
        var endTime = (new Date()).getTime()
        // console.log(this.startTime, endTime, 'time')
        // console.log('widht', ev.target.width, ev.target.height)
        if(endTime - this.startTime > 2000) {
            return 
        }

        var a = ev.localX - this.startPos[0] 
        var b = ev.localY - this.startPos[1]
        // console.log(a, b, 'asdf')
        if( Math.abs(a) > Math.abs(1.5 * b) && this.typ == 1) {
            if(a > 0) {
                console.log('滑向右')
                this.aniSlide(-1)
            }
            else {
                console.log('滑向左')
                this.aniSlide(1)
            }
        }
        else if( Math.abs(b) > Math.abs(1.5 * a)  && this.typ == 2) {
            if(b > 0) {
                console.log('滑向下')   
                this.aniSlide(1)
            }
            else {
                console.log('滑向上')
                this.aniSlide(-1)
            }
        }
        // console.log('end', ev.localX, ev.localY)
    }

    private aniSlide(dir) {
        if(this.wait_ani) {
            return 
        }
        this.wait_ani = true

        this.curId += dir
        console.log('vv', this.curId)

        var jumpInfo;
        if(this.curId == this.itemNum) { 
            jumpInfo = {
                item: this.contGp.getChildAt(0),
                newP: this.itemNum * this.moveSize,
                oldId: 0
            };
            console.log('循环回第一个~')
        }
        else if(this.curId == -1) {
            jumpInfo = {
                item: this.contGp.getChildAt(this.itemNum - 1),
                newP: -1 * this.moveSize,
                oldId: this.itemNum - 1
            };
            console.log('循环回最后一个~')
        }

        var option;
        if(this.typ == 1) {
            if(jumpInfo) {
                jumpInfo.oldP = jumpInfo.item.x
                jumpInfo.item.x = jumpInfo.newP
            }
            option = {x: -this.curId * this.moveSize}
        }
        else if(this.typ == 2) {
            if(jumpInfo) {
                jumpInfo.oldP = jumpInfo.item.y
                jumpInfo.item.y = jumpInfo.newP
            }
            option = {y: -this.curId * this.moveSize}
        }
        
        // 
        egret.Tween.get(this.contGp).to(option, 200)
        .call(function() {
            if(jumpInfo) {
                if(this.typ == 1) {
                    this.contGp.x = -jumpInfo.oldP
                    jumpInfo.item.x = jumpInfo.oldP
                }
                else if(this.typ == 2) {
                    this.contGp.y = -jumpInfo.oldP
                    jumpInfo.item.y = jumpInfo.oldP
                }
                this.curId = jumpInfo.oldId
                console.log('xh', this.curId)
            }
            
            this.wait_ani = false
        }, this)
    }
}

}
