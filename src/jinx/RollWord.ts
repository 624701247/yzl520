// TypeScript file
namespace jinx {


/* eg：文字从下往上循环滚动
var ary = [
    {name: '关羽', val: 99},
    {name: '张飞', val: 88},
    {name: '赵云', val: 77},
    {name: '马超', val: 66},
    {name: '黄忠', val: 55}
]

let rollWord = new jinx.RollWord(this.assistSc)
for(let idx = 0; idx < ary.length; idx++) {
    rollWord.addItem( this.createOneAssist(ary[idx].name, ary[idx].val + '') )
}
rollWord.run()

*/ 


export class RollWord {
    private itemHei:number
    private scroll:eui.Scroller
    private scrollView: eui.Group
    private timer:egret.Timer

    private curCount:number = 1
    private num:number = 0

    private firstItem:egret.DisplayObject

    constructor(scroll:eui.Scroller) {
        this.scroll = scroll
        this.scroll.touchEnabled = false
        
        this.scrollView = <eui.Group>this.scroll.viewport

        this.timer = new egret.Timer(1500)
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this)

        this.itemHei = this.scroll.height
    }

    public addItem(item:egret.DisplayObject) {
        item.height = this.itemHei
        item.anchorOffsetX = 0
        item.anchorOffsetY = item.height / 2
        item.y = this.scrollView.height + this.itemHei / 2
        this.scrollView.addChild(item)

        this.scrollView.height += item.height
        this.num++

        if(this.num == 1) {
            this.firstItem = item
        }
    }

    public run() {
        if(this.num < 2) {
            return 
        }

        this.scrollView.height += this.itemHei
        this.timer.start()
    }

    public stop() {
        this.timer.stop()
    }

    private onTimer() {
        // console.log('height', this.scrollView.height) //kone fuck: 这里的height居然等于  this.itemHei
        if(this.curCount == this.num) {
            this.firstItem.y = this.itemHei * (this.num + 1) - this.itemHei / 2
        }

         egret.Tween.get(this.scrollView, {loop: false})
        .to({
            scrollV: this.curCount * this.itemHei
        }, 400)
        .call(this.onAniRollEnd, this)    
    }

    // 
    private onAniRollEnd() {
        if(this.curCount == this.num) {
            this.firstItem.y = this.itemHei / 2
            this.scrollView.scrollV = 0

            this.curCount = 1
        }
        else {
            this.curCount++
        }
    }
}

}   //end of jinx
