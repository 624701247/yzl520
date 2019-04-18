// TypeScript file
namespace jinx {
// 给定一个 eui.Group 控件 euiCont，计算出刚好罩在其上面的浮动的div的 style.cssText
var getCssTextByEuiCont = function(euiCont:eui.Group) {
    let cssText = ''

    // 宽高
    let wid;
    if(!isNaN(euiCont.percentWidth)) {
        wid = euiCont.percentWidth / 100 * jinx.scwid
    }
    else if(euiCont.width != 0) {
            wid = euiCont.width
    }
    else {
        wid = (jinx.scwid - euiCont.left - euiCont.right)
    }
    // 
    let hei;
    if(!isNaN(euiCont.percentHeight)) {
        hei = euiCont.percentHeight / 100 * jinx.schei
    }
    else if(euiCont.height != 0) {
            hei = euiCont.height
    }
    else {
        hei = (jinx.schei - euiCont.top - euiCont.bottom)
    }
    // 
    wid *= euiCont.scaleX * euiCont.parent.scaleX
    hei *= euiCont.scaleY * euiCont.parent.scaleY
    cssText += 'width:' + wid / 100 + 'rem;', cssText += 'height:' + hei / 100 + 'rem;';

    //坐标 左右
    if(!isNaN(euiCont.horizontalCenter)) {
        if(euiCont.horizontalCenter == 0) {
            cssText += 'margin:auto; left:0; right:0;'
        }
        else {
            cssText += 'left:' + horizontalCenter2leftRem(wid, euiCont.horizontalCenter) + 'rem;'
        }
    }
    else if(!isNaN(euiCont.left)) {
        cssText += 'left:' + euiCont.left / 100 + 'rem;'
    }
    else if(!isNaN(euiCont.right)) {
        cssText += 'right:' + euiCont.right / 100 + 'rem;'
    }
    else {
        cssText += 'left:' + (euiCont.x + euiCont.anchorOffsetX) / 100 + 'rem;'
    }
    //坐标 上下
    if(!isNaN(euiCont.verticalCenter)) {
        if(euiCont.verticalCenter == 0) {
            cssText += 'margin:auto; top:0; bottom:0;'
        }
        else {
            cssText += 'top:' + verticalCenter2topRem(hei, euiCont.verticalCenter) + 'rem;'
        }
    }
    else if(!isNaN(euiCont.top)) {
        cssText += 'top:' + euiCont.top / 100 + 'rem;'
    }
    else if(!isNaN(euiCont.bottom)) {
        cssText += 'bottom:' + euiCont.bottom / 100 + 'rem;'
    }
    else {
        cssText += 'top:' + (euiCont.y + euiCont.anchorOffsetY) / 100 + 'rem;'
    }

    return cssText
}

// exml horizontalCenter 值转化成html5标签的left值
var horizontalCenter2leftRem = function(wid, horizontalCenter) {
    let left = (jinx.scwid - wid) / 2 + horizontalCenter 
    return left / 100
}

// exml verticalCenter 值转化成html5标签的top值
var verticalCenter2topRem = function(hei, verticalCenter) {
    let top = (jinx.schei - hei) / 2 + verticalCenter
    return top / 100
}

var count = 0; //创建的Dom对象计数

export class Dom {
    protected el_cont: HTMLElement
    private contGp:eui.Group

    // @param contGp: 生成的div标签将罩在该控件上。 kone warning： 该控件的父节点必须是全屏的，
    // @param isAutoRemove: 是否开启随着contGp被销毁而自动销毁
    // @param clsName: 自定义的css3类名
    constructor(contGp:eui.Group, clsName?:string, isAutoRemove:boolean = true) {
        var node = document.createElement('div')
        // 
        node.id = 'cont-auto-' + count
        count++
        // 
        node.className = 'cont-auto'
        clsName && (node.className += ' ' + clsName)
        // 
        node.style.cssText = getCssTextByEuiCont(contGp)
        document.body.appendChild(node)

        this.el_cont = node
        this.contGp = contGp

        if(isAutoRemove) {
            contGp.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this)
        }
    }

    public fitUi() {
        this.el_cont.style.cssText = getCssTextByEuiCont(this.contGp)
    }

    public setInnerHTML(str) {
        this.el_cont.innerHTML = str
    }

    public getContEl() {
        return this.el_cont
    }

    public show() {
        // this.el_cont.style.display = 'block'  //kone warning：  这样写显示出来的效果不好
        carry.removeClass(this.el_cont, 'cont-hide')
    }

    public hide() {
        // this.el_cont.style.display = 'none'
        carry.addClass(this.el_cont, 'cont-hide')
    }

    public remove() {
        if(this.el_cont) {
            this.el_cont.remove()
            this.el_cont = null
        }
    }
}

}