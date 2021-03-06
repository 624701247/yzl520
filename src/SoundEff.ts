// TypeScript file
namespace pgame {
class SoundEff {
    
    constructor()  {   
    }

    // 跳宝箱
    private bjSound: egret.Sound
    public playBoxJump() {
        this.initBoxJump()
        this.bjSound.play(0, 1) 
    }
    public initBoxJump() {
        if(!this.bjSound) {
            this.bjSound = RES.getRes("box_out_mp3"); 
        }
    }


     // 中 520 
    private mmSound: egret.Sound
    public playMM() {
        this.initMM()
        this.mmSound.play(0, 1) 
    }
    public initMM() {
        if(!this.mmSound) {
            this.mmSound = RES.getRes("box_jump_mp3"); 
        }
    }

    // 生成海报
    private poSound: egret.Sound
    public playPoster() {
        this.initPoster()
        this.poSound.play(0, 1) 
    }
    public initPoster() {
        if(!this.poSound) {
            this.poSound = RES.getRes("poster_mp3"); 
        }
    }

    // 开奖
    private dpSound: egret.Sound
    public playDrawPrize() {
        this.initDrawPrize()
        this.dpSound.play(0, 1) 
    }
    public initDrawPrize() {
        if(!this.dpSound) {
            this.dpSound = RES.getRes("draw_prize_mp3"); 
        }
    }

    // 抽奖
    // private lSound: egret.Sound
    // public playLottery() {
    //     this.initLottery()
    //     this.lSound.play(0, 1) 
    // }
    // public initLottery() {
    //     if(!this.lSound) {
    //         this.lSound = RES.getRes("lot_mp3"); 
    //     }
    // }


    // 
    private bgSounds = {
        'love': null,
        'xunbao1': null,
        'xunbao2': null
    }
    private bgChs = {
        'love': null,
        'xunbao1': null,
        'xunbao2': null
    }
    private curKey:string = ''
    public curIsPlay:boolean = false
    // 
    public playBgm(key) {
        this.stopBgm()
        var sound = this.initBgm(key)
        this.bgChs[key] = sound.play(0, 0) 
        this.curKey = key
        this.curIsPlay = true
        jinx.BgmBtn.onChange(true)
    }
    // 
    public stopBgm() {
        if(!this.curIsPlay) {
            return
        }
        this.bgChs[this.curKey] && this.bgChs[this.curKey].stop()
        // this.curKey = null
        this.bgChs[this.curKey] = null
        this.curIsPlay = false
        jinx.BgmBtn.onChange(false)
    }
    // 
    public initBgm(key) {
        if(!this.bgSounds[key]) {
            this.bgSounds[key] = RES.getRes(key + "_mp3"); 
        }
        return this.bgSounds[key]
    }

    public ctrlBgm() {
        this.curKey = this.curKey || 'love'
        if(this.curIsPlay) {
            this.stopBgm()
        } else {
            this.playBgm(this.curKey)
        }
        return this.curIsPlay
    }
}
export var soundEff = new SoundEff()
}