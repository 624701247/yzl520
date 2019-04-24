
namespace pgame {
export class WheelLayer extends Scene {
    private wheelImg:eui.Image
    private pointBtn:eui.Button
    private wheelGp:eui.Group

    private wait_ui:boolean = false

    public fitUi() {
        super.fitUi()
        jinx.fitMaxSize(this.wheelGp, jinx.scwid - 30, null)
    }

    constructor() {
        super(WheelLayerSkin)

        this.pointBtn.name = 'point'
        jinx.addTapEvent(this.pointBtn, this.ontapPoint, this)

        this.timer = new egret.Timer(25)
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this)
    }

    private timer:egret.Timer 
    private curRate:number
    private count:number
    private loRot:number
    private mpId:number
    private onTimer() {
        this.count++
        if(this.count < 40) { //加速
            if(this.count % 4 == 0) {
                this.curRate += 3
            }
        }
        else if(this.count < 100) { //匀速
        }
        else if(this.count < 140) { //减速度
            if(this.loRot == null) { //还没收到数据，继续匀速
                this.count = 40
            }
            else if(this.count % 4 == 0) {
                if(this.curRate > 3) {
                    this.curRate -= 3
                }
            }
        }
        else if(this.loRot != null) { //停下来
            if( Math.abs(this.wheelImg.rotation - this.loRot) <= this.curRate ) {
                this.wheelImg.rotation = this.loRot
                this.timer.stop()
                setTimeout(this.onEnd.bind(this), 1300);
                return         
            }
        }
        this.wheelImg.rotation += this.curRate
    }
    private aniWheel() {
        this.wheelImg.rotation = this.wheelImg.rotation % 360
        this.count = 0
        this.curRate = 5
        this.loRot = null
        this.mpId = -1
        this.timer.start()
    }

    private onEnd() {
        this.wait_ui = true
        if(this.mpId != -1) {
            carry.weakHint('中奖id:' + this.mpId)
        }
        else {
            carry.weakHint('没中奖')
        }
    }

    public onCome() {
        carry.addListener(as.action.gameLottery, this.onLottery, this)
        carry.addListener('net_time_out', this.onTimeout, this)
    }
    public onBack() {
        carry.removeListener(as.action.gameLottery)
        carry.removeListener('net_time_out')
    }

    private onLottery(ev) {
        jinx.recoverTapEvent(this.pointBtn)
        this.mpId = ev.data
        if(this.mpId != -1) {
        }
        this.setFailRot()
    }
    private onTimeout(ev) {
        console.log('网络超时', ev.data)
        this.setFailRot()
    }
    private setFailRot() {
        if(this.loRot == null) {
            if(Math.random() < 0.5) {
                this.loRot = 90
            }
            else {
                this.loRot = -90
            }
        }

        // 
        if(this.loRot > 180) {
            this.loRot -= 360
        }
    }

    private ontapPoint() {
        if(this.wait_ui) {
            setTimeout(function() {
                uiMgr.back()
            }, 800);
            return 
        }

        this.aniWheel()
        as.gameLottery() //抽奖
        return true
    }
}   //end of class
}   //end of module
