// TypeScript file
// 点击事件封装，防止按钮快速多次点击    
namespace jinx {
    var bList = {}
    var spTime = 1500 //发送网络请求后等待该时间，然后转菊花
    var toTime = 3000 // 又等了n久仍然没有响应，网络超时时间

    // 获取按钮对象唯一的哈希值标识
    function getTagByBtn(btn:any) {
        return btn.name + '-' + btn.hashCode
    }

    // 等待一段时间无响应，转起菊花
    function onTimeout() { 
        var tag = getTagByBtn(this)
        if(bList[tag]) {
            carry.spinner.show()
            bList[tag].spInShow = true
            bList[tag].toTimer = setTimeout(onNetErr.bind(this), toTime);
        }
    }

    //又等了n久仍然没有响应，则弱提示超时
    function onNetErr() {
        var tag = getTagByBtn(this)
        if(bList[tag]) {
            carry.spinner.hide()
            bList[tag].spInShow = false
            carry.weakHint('网络超时，请检查网络是否断开！', 2500)
            recoverTapEvent(this, false)
            carry.dispEvent('net_time_out', this.name)
        }
    }

    export function addTapEvent(btn:any, func, that, waitTime:number = 400) {
        if(carry.isLocal == false && btn.alpha == 0.33) {
            btn.alpha = 0
        }
        var tag1 = getTagByBtn(btn)
        if(bList[tag1] == null) {
            bList[tag1] = false
        }
        else {
            console.log('该按钮已经注册过点击事件了', btn)
            return
        }
        btn.enabled = true
        btn.touchEnabled = true
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(ev:egret.Event) {
            if(this == null) {
                // console.log('按钮已经移除了')
                return 
            }    

            var tag = getTagByBtn(this)    
            if(bList[tag]) {
                console.log('触摸等待')
                return
            }

            var hasNetEv = func.call(that, ev)

            if(bList[tag] == null) {
                // console.log('按钮点完就被移除了')
                return 
            }

            if(hasNetEv) { //需要等待网络事件响应
                bList[tag] = {}
                bList[tag].spTimer = setTimeout(onTimeout.bind(this), spTime);
            }
            else if(waitTime > 0) { //触摸等待固定时间
                bList[tag] =  true
                setTimeout(function() {
                    recoverTapEvent(this, false)
                }.bind(this), waitTime)
            }
        }, btn)

        btn.addEventListener(egret.Event.REMOVED_FROM_STAGE, function(ev:egret.Event) {
            recoverTapEvent(this)
            var tag = getTagByBtn(btn)    
            delete bList[tag]
        }, btn)
    }

    function _rcvTapEv(btn) {
        var tag = getTagByBtn(btn)
        var info = bList[tag]
        if(info) {
            if(info.spTimer) {
                clearTimeout(info.spTimer)
            }
            if(info.toTimer) {
                clearTimeout(info.toTimer)
            }
            if(info.spInShow) {
                carry.spinner.hide()
            }
            bList[tag] = false
        }
    }
    // 恢复按钮的触摸等待 
    /* 
    js 是单线程运行的。
    上文执行完 “var hasNetEv = func.call(that, ev)” 之后，假如马上收到了网络事件回调，
    那么线程会跑去执行回调，回调执行完之后在继续执行 “var hasNetEv = func.call(that, ev)” 之后的内容。
    所有这里用 setTimeout 0 的方法可以让 “var hasNetEv = func.call(that, ev)” 所在方法执行完后再去处理回调
    */
    export function recoverTapEvent(btn, isWait0:boolean = true) {
        if(isWait0) {
            setTimeout(function() {
                _rcvTapEv(btn)
            }, 0);
        }
        else {
            _rcvTapEv(btn)
        }
    }

    // kone point  removeTapEvent 不知道怎么写哦。
    /* 算了，要remove事件按如下写法吧！
    this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ontapStart, this)
    this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ontapStart, this)
    */
}