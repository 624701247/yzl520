// TypeScript file
namespace pgame {
class SoundEff {
    private lSound: egret.Sound
    
    constructor()  {   
    }

    // 
    public playLottery() {
        if(!this.lSound) {
            this.lSound = RES.getRes("lottery_mp3"); 
        }
        this.lSound.play(0, 1) 
    }
}
export var soundEff = new SoundEff()
}