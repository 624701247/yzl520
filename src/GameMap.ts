
namespace pgame {
export class GameMap extends eui.Component {
    constructor() {
        super()
        this.skinName = GameMapSkin

        

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onadd, this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onremove, this)
    }

    

    

    private onadd() {
        for(let idx = 0; idx < this.starGp.numChildren; idx++) {
            let star = this.starGp.getChildAt(idx)
            this.aniStar(star)
            jinx.addTapEvent(star, function() {                
                this.ontapStar(idx)
            }, this)
        }

        // carry.addListener(as.action.winMM, this.onWinMM, this)
    }
    private onremove() {
        // carry.removeListener(as.action.winMM)
    }

    private aniStar(star)  {
        var gap = carry.randomInt(70, 90) / 100

        var waitBLBL = carry.randomInt(600, 1400)
        var blblAlp = 1
        var rot = 0
        if(Math.random() < 0.5) {
            rot = carry.randomInt(10, 30)
        }
        if(Math.random() < 0.7) {
            blblAlp = 0
        }
        
        egret.Tween.get(star, {loop: true})
        .to({scaleX: 1, scaleY: 1, rotation: 0}, 400)
        .to({scaleX: gap, scaleY: gap, rotation: rot}, 400)
        .to({scaleX: 1, scaleY: 1, rotation: 0}, 400)
        // .wait(waitBLBL)
        // .to({alpha: blblAlp}, 50)
        // .to({alpha: 1}, 50) 
        // .to({alpha: blblAlp}, 50) 
        // .to({alpha: 1}, 50) 
    }

    private curId:number
    private ontapStar(idx) {
        console.log('ss', idx)

        soundEff.initBoxJump()

        this.curId = idx

        var rd = Math.random()

        // ktest
        if( (carry.isLocal || carry.isDemo) && carry.urlParam.krd ) {
            rd = carry.urlParam.krd
        }

        if( getIs520() ) {
            carry.dispEvent('full_520')
        } else if(rd < 0.5) {
            uiMgr.open(DlgId.prod, this.curId)
        } else if(rd < 0.8) {
            carry.spinner.show()
            // this.isTimeout = false
            is520Timeout = false
            as.winMM(-1, this.curId)
            setTimeout(function() {
                this.isTimeout = true
                carry.spinner.hide()
                console.log('win mm 超时')
            }.bind(this), 4000);
        } else {
            var has80 = false
            var has20 = false
            for(var ii = 0; ii < as.myPrizes.length; ii++) {
                var pinfo = as.myPrizes[ii]
                if(pinfo.prizeName == '88元现金券') {
                    has80 = true
                }
                if(pinfo.prizeName == '20元面膜券') {
                    has20 = true
                }
            }
            if(has80 && has20) {
                console.log('两个券都有，只出广告')
                uiMgr.open(DlgId.prod, this.curId)
            } else {
                uiMgr.open(DlgId.boxjx)
            }
        }
    }
    // private isTimeout:boolean = false
    // private onWinMM(ev) {
    //     if(this.isTimeout) {
    //         return
    //     }
    //     carry.spinner.hide()
    //     if(ev.data != -1) {
    //         uiMgr.open(DlgId.win52, ev.data)
    //     } else {
    //         uiMgr.open(DlgId.prod, this.curId)
    //     }
    // }

    

    private starGp:eui.Group


}   //end of class
}   //end of module


