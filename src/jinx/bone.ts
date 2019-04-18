// TypeScript file

namespace jinx {

export class Bone extends egret.DisplayObjectContainer{
    //龙骨动画所需定时器初始化，
    // 整个游戏只需注册一个该定时器即可，否则会定时器越多，龙骨动画效果会叠加越快
    private static _aniTime
    private static hasInit = false
    public static init() {
        if(Bone.hasInit == true) {
            // console.warn('不要重复初始化 bone')
            return
        }
        Bone.hasInit = true

        egret.startTick(Bone.onTicker, this);
    }
    public static onTicker(timeStamp:number) {
        if(!Bone._aniTime) {
            Bone._aniTime = timeStamp;
        }
        var now = timeStamp;
        var pass = now - Bone._aniTime;
        Bone._aniTime = now;

        dragonBones.WorldClock.clock.advanceTime(pass / 1000);
        return false;
    }

    //
    private _armature:dragonBones.Armature
    private _armatureDisplay    

    constructor(resName, armatureName) {
        super()

        Bone.init()

        //
        let fac = new dragonBones.EgretFactory();
        fac.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(RES.getRes(resName + "_ske_json")));
        fac.addTextureAtlasData(fac.parseTextureAtlasData(RES.getRes(resName + "_tex_json"), RES.getRes(resName + "_tex_png")));

        //
        this._armature = fac.buildArmature(armatureName);
        this._armatureDisplay = this._armature.getDisplay();
        dragonBones.WorldClock.clock.add(this._armature);

        this.addChild(this._armatureDisplay);        
    }

    //播放动画
    public play(aniName:string, time:number = 0) {
        this._armature.animation.play(aniName, time)
    }    

    // 停留在指定动画的指定帧（从0开始）
    public gotoAndStopByFrame(aniName, fid) {
        this._armature.animation.gotoAndStopByFrame(aniName, fid)
    }   

    public stop() {
        this._armature.animation.stop()
    }

    // 设置为全屏居中显示
    //@param isCompress : 是否压缩
    public setfillScreen(isCompress:Boolean = true) {
        this.x = jinx.scwid / 2
        this.y = jinx.schei / 2
        let sy = jinx.schei / jinx.designHei
        if(isCompress) {
            this.scaleY = sy
        }
        else {
            if(sy > 1) {
                this.scaleY = sy
            }
        }
    }

    //获取上个播放动画的名字
    public getLastAniName() {
        return this._armature.animation.lastAnimationName
    }
    public addEventListener(evName, func, that) {
        this._armature.addEventListener(evName, func, that)
    }
     public removeEventListener(evName, func, that) {
        this._armature.removeEventListener(evName, func, that)
     }

}


/* eg: 
let bone = new jinx.Bone('player', 'armatureName')
// bone.setfillScreen()
bone.x = jinx.scwid / 2
bone.y = jinx.schei / 2
this.addChild(bone)
bone.play('run', 1)
this.bone = bone
bone.addEventListener(dragonBones.AnimationEvent.COMPLETE, function(ev:dragonBones.AnimationEvent) {
    if(bone.getLastAniName() == 'newAnimation1') {
        bone.play('newAnimation2')        
    }
}, this)

*/


}   //end of jinx
 