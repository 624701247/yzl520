// TypeScript file
namespace jinx {

/* eg :
private mtc:jinx.MultiTouch
let rt = new eui.Rect(jinx.scwid, jinx.schei)
rt.x = 0, rt.y = 0
this.mtc = new jinx.MultiTouch(rt)
this.mtc.addObj(too, tag, true, true)
this.mtc.removeObjByTag(tag)

//请参考之前做过的 diy毕业照 nh-graduate-diy
*/

interface Bird {
    obj:any;
    tag:string;

    // 
    dragEnable:boolean;
    draging:boolean;
    dragDistance:egret.Point;

    // 
    multiScaleEnable: boolean;
    multiScaleing:boolean;
    // touchPoints: egret.Point[];
    distance: number;
    defAngle:number;
    curBirdRotation:number;
}

export class MultiTouch {
    private estage: any; // egret 舞台
    private ctrlRt:eui.Rect
 
    private birds:Bird[] = [] //可被操作的对象
    private curBird:Bird

    private touchPoints:egret.Point[] = [null, null]

    private curPointAry:any[] = [null, null]
    // private isFirstPiont:boolean = true

    constructor(rt: eui.Rect) {
        if(jinx.stage == null) {
            console.error('请先调用 jinx.init 给 jinx.stage 赋值上游戏舞台')
        }
        this.estage = jinx.stage

        this.ctrlRt = rt


        this.estage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageBegin, this)
        this.estage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageMove, this)
        this.estage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageEnd, this)
    }
    
    // 
    public addObj(obj, tag:string = '', dEnable, mEnable) {
        if(tag == '') {
            tag = this.birds.length + ''
        }
        this.birds.push({
            obj: obj,
            tag: tag,
            // 
            dragEnable: dEnable,
            draging:false,
            dragDistance: new egret.Point(),

            // 
            multiScaleEnable: mEnable,
            multiScaleing:false,
            distance:0,
            defAngle:0,
            curBirdRotation:0
        })
        return this.birds.length - 1
    }
    public removeObjByTag(tag:string) {
        for(let idx = 0; idx < this.birds.length; idx++) {
            if(this.birds[idx].tag == tag) {
                this.birds.splice(idx, 1)
                break
            }
        }
    }


    private onStageBegin(evt:egret.TouchEvent) {
        //不在可操作区域
        if(!this.ctrlRt.hitTestPoint(evt.stageX, evt.stageY)) { 
            return 
        }

        let isFirst:boolean //是否是第一触点
        if(this.curPointAry[0] == null) {
            isFirst = true
            this.curPointAry[0] = evt.touchPointID
        }
        else if(this.curPointAry[1] == null) {
            isFirst = false
            this.curPointAry[1] =  evt.touchPointID
            this.touchPoints[1] = new egret.Point(evt.stageX, evt.stageY);
        }
        else {
            return
        }

        // 
        for(let idx = this.birds.length - 1; idx >= 0; idx--) {
            let bird = this.birds[idx]

            if(bird.obj.hitTestPoint(evt.stageX, evt.stageY)) {
                if(bird.dragEnable) {
                    if(isFirst) { 
                        bird.draging = true
                        bird.dragDistance.x =  evt.stageX - bird.obj.x
                        bird.dragDistance.y = evt.stageY - bird.obj.y
                    }
                }


                if(bird.multiScaleEnable) {
                    if(isFirst) {  //第一触点要点在物体上才能缩放
                        this.touchPoints[0] = new egret.Point(evt.stageX, evt.stageY);
                    }
                 }

                this.curBird = bird
                break
            }

        }


        // 有两点触摸
        if(this.curBird) {
            if(this.touchPoints[0] && this.touchPoints[1]) {
                this.curBird.distance = this.getTouchDistance( this.touchPoints );
                this.curBird.defAngle = this.getTouchAngle( this.touchPoints );
                this.curBird.multiScaleing = true
            }
        }
    }

    private onStageMove(evt:egret.TouchEvent) {
        // carry.clog('bbb:' + evt.touchPointID + ' ')

        //不在可操作区域
        if(!this.ctrlRt.hitTestPoint(evt.stageX, evt.stageY)) { 
            return 
        }

        if(this.curBird == null) {
            return 
        }


        // 
        if(this.curBird.multiScaleEnable && this.curBird.multiScaleing) {
            if(evt.touchPointID == this.curPointAry[0]) {      //第一点
                this.touchPoints[0] = new egret.Point(evt.stageX, evt.stageY)
            }
            else if(evt.touchPointID == this.curPointAry[1]) { //第二点
                this.touchPoints[1] = new egret.Point(evt.stageX, evt.stageY)
            }

            

             // 有两点触摸
            if(this.touchPoints[0] && this.touchPoints[1]) {
                var newdistance = this.getTouchDistance(this.touchPoints);
                this.curBird.obj.scaleX = this.curBird.obj.scaleY = newdistance / this.curBird.distance

                var newangle = this.getTouchAngle(this.touchPoints);
                this.curBird.obj.rotation = this.curBird.curBirdRotation + newangle - this.curBird.defAngle;
            }
        }

        // 
        // carry.clog(this.curBird.dragEnable + ' ' +  this.curBird.draging + ' ' + this.curBird.multiScaleing + ' ' + evt.touchPointID)
        if(this.curBird.dragEnable && this.curBird.draging && this.curBird.multiScaleing == false && evt.touchPointID == this.curPointAry[0]) {
            this.curBird.obj.x = evt.stageX - this.curBird.dragDistance.x;
            this.curBird.obj.y = evt.stageY - this.curBird.dragDistance.y;

            // carry.clog('cccccc')
        }
    }

    private onStageEnd(evt:egret.TouchEvent) {
        if(evt.touchPointID == this.curPointAry[0]) {      //第一点
            this.curPointAry[0] = null
            this.touchPoints[0] = null
            // carry.clog('kill 第一点')
        }
        else if(evt.touchPointID == this.curPointAry[1]) { //第二点
            this.curPointAry[1] = null
            this.touchPoints[1] = null
        }

        if(this.curBird == null) {
            return 
        }
        


        if(this.touchPoints[0] == null && this.touchPoints[1] == null) {
            this.curBird.multiScaleing = false
            this.curBird.draging = false
            this.curBird = null
        }

        if(this.curBird && this.curBird.multiScaleEnable) {
            let obj = this.curBird.obj
            obj.width *= obj.scaleX;
            obj.height *= obj.scaleY;
            obj.scaleX = 1;
            obj.scaleY = 1;
            obj.anchorOffsetX = obj.width / 2;

            obj.anchorOffsetY = obj.height / 2;
            this.curBird.curBirdRotation = obj.rotation;
        }
    }



    //计算触摸两点的距离
    private getTouchDistance(touchPoints):number {
        var dis:number = 0
        dis = egret.Point.distance(touchPoints[0], touchPoints[1])
        return dis;
    }
    //计算触摸两点的角度
    private ccc:number = 0.017453292; //2PI/360
    private getTouchAngle( touchPoints):number {
        var ang:number = 0;
        var p1:egret.Point = touchPoints[0];
        var p2:egret.Point = touchPoints[1];
        ang = Math.atan2((p1.y - p2.y), (p1.x - p2.x)) / this.ccc;
        return ang;
    }

}

}   //end of jinx
