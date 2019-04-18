// TypeScript file
namespace jinx {

//
export class ItemKey {
    public static pname = 'inp_name'
    public static tel = 'inp_tel'
    public static addr = 'inp_addr'
}
export var getItem = function(key:string) {
    return window.localStorage.getItem(key)
}
export var setItem = function(key:string, val:string) {
    if(val != null && val != '') {
        window.localStorage.setItem(key, val)
    }
}


/*验证码 eg:
*/ 


export class TelCode {
    private getLb:eui.Label
    private totalCount:number
    private getTxt:string

    private wait_cd = false
    private count:number
    private timer:egret.Timer

    constructor(getLb:eui.Label, totalCount:number = 60) {
        this.getLb = getLb
        this.getTxt = getLb.text || '获取验证码'
        this.totalCount = totalCount        

        this.updateCountShow(this.getTxt)

        this.getLb.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this)
        
        this.timer = new egret.Timer(1000)
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this)
    }


    // 点击了请求验证码，请调此方法开始倒数
    // @return : 返回是否再倒数中
    public countDown() {
        if(this.wait_cd) {
            return true
        }
        this.wait_cd = true
        this.count = this.totalCount
        this.updateCountShow(this.count + 's')      
        this.timer.start()
    }

    private onTimer(ev) {
        this.count--
        if(this.count <= 0) {
            this.count = 0
            this.updateCountShow(this.getTxt)
            this.timer.stop()
            this.wait_cd = false
            return
        } 
        else {
            this.updateCountShow(this.count + 's')
        }
    }
    private updateCountShow(val) {
        this.getLb.text = val
    }
    private onRemove() {
        this.timer.stop()
    }
}


}