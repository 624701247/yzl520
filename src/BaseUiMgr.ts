// TypeScript file
var ktest;
namespace pgame {
    export enum UiAni {
        nil = 1, //没动画

        slide_up,    //上滑
        slide_down,  //下滑
        slide_left,  //左滑
        slide_right, //右滑

        pop //弹出
    }
    export abstract class BaseUiMgr {
        constructor() {}
        // 
        private sceneCont:eui.Group
        private lastScene:Scene
        private curScene:Scene

        // 
        private dlgCont:eui.Group
        private curDlgGp:eui.Group


        public updatePoster() {
            if(this.curScene.name == 'poster') {
                // this.curScene.update()
            }
        }

        // 
        private wait_turnAni: boolean = false //等待切换场景动画播放完
        public initScene() {
            var gp = new eui.Group()
            gp.top = gp.bottom = gp.left = gp.right = 0
            gp.name = 'scene-cont'
            ktest = this.sceneCont = gp
            return gp
        }
        public initDlg() {
            var gp = new eui.Group()
            gp.width = 0, gp.height = 0
            gp.x = 0, gp.y = 0
            gp.name = 'dlg-cont'
            this.dlgCont = gp
            return gp
        }

        // 切换场景
        // @param sid: 场景id
        // @param parm: 场景参数
        // @param ani:切换场景动画
        public go(sid: SceneId, parm?:any, ani:UiAni = UiAni.nil) {  
            let newScene:Scene = this.createScene(sid, parm)
            if(newScene == null) {
                console.error('没有该场景：' + sid)
                return 
            }

            this.goScene(newScene, ani)
        }
        // 
        public goScene(newScene:Scene, ani:UiAni = UiAni.nil, isGoLast:boolean = false) {
            if(this.wait_turnAni) {
                console.log('等待，切换场景中~')
                return 
            }
            this.wait_turnAni = true
            // console.log('is Go Last', isGoLast)
            newScene.fitUi()

            if(ani == UiAni.nil) {
                if(isGoLast) {
                    newScene.visible = true
                    this.sceneCont.swapChildren(newScene, this.curScene)
                }
                else {
                    this.sceneCont.addChild(newScene)
                }
                this.onGoSceneEnd(newScene, isGoLast)
            }
            else if(ani == UiAni.slide_up || ani == UiAni.slide_down || ani == UiAni.slide_left || ani == UiAni.slide_right) {
                this.aniSlideScene(newScene, ani, isGoLast)
            }
        }
        // 回到上一个场景
        public back(ani:UiAni = UiAni.nil) {
            if(this.lastScene) {
                this.goScene(this.lastScene, ani, true)
            }
            else {
                console.error('不存在上一场景')
            }
        }
        // 上下左右滑动动画
        private aniSlideScene(newScene:Scene, ani:UiAni, isGoLast:boolean) {
            let newStartV, newStartH;
            let conEndtV, conEndtH;
            if(ani == UiAni.slide_up) {
                newStartV = jinx.schei
                newStartH = 0
            }
            else if(ani == UiAni.slide_down) {
                newStartV = -jinx.schei
                newStartH = 0
            }
            else if(ani == UiAni.slide_left) {
                newStartV = 0
                newStartH = jinx.scwid
            }
            else if(ani == UiAni.slide_right) {
                newStartV = 0
                newStartH = -jinx.scwid
            }
            let aniTime = Math.max( Math.abs(newStartV), Math.abs(newStartH)) * 0.7
            conEndtV = -newStartV
            conEndtH = -newStartH

            // 新场景进场动画
            newScene.verticalCenter = newStartV
            newScene.horizontalCenter = newStartH
            if(isGoLast) {
                newScene.visible = true
            }
            else {
                this.sceneCont.addChild(newScene)
            }
            this.sceneCont.verticalCenter = 0
            this.sceneCont.horizontalCenter = 0

            egret.Tween.get(this.sceneCont).to({
                verticalCenter: conEndtV,
                horizontalCenter: conEndtH
            }, aniTime)
            .call(function() {
                if(isGoLast) {
                    this.sceneCont.swapChildren(newScene, this.curScene)
                }
                this.sceneCont.verticalCenter = 0
                this.sceneCont.horizontalCenter = 0
                newScene.verticalCenter = 0
                newScene.horizontalCenter = 0
                this.onGoSceneEnd(newScene, isGoLast)
            }, this)
        }
        private onGoSceneEnd(newScene:Scene, isGoLast:boolean = false) {
            // var num = this.sceneCont.numChildren
            // if(num == 3) {
            //     this.lastScene = <Scene>this.sceneCont.getChildAt(1)
            //     this.curScene =  <Scene>this.sceneCont.getChildAt(2)
            //     this.sceneCont.removeChildAt(0)
            // }
            // else if(num == 2) {
            //     this.lastScene = <Scene>this.sceneCont.getChildAt(0)
            //     this.curScene =  <Scene>this.sceneCont.getChildAt(1)
            // }
            // else if(num == 1) {
            //     this.curScene =  <Scene>this.sceneCont.getChildAt(0)
            // }
            if(isGoLast) {
                this.lastScene = this.curScene
            }
            else {
                if(this.lastScene) {
                    this.sceneCont.removeChild(this.lastScene)
                }
                this.lastScene = this.curScene
            }
            this.curScene = newScene

            // 
            if(this.lastScene) {
                this.lastScene.visible = false
                this.lastScene.onBack()
            }
            this.curScene && this.curScene.onCome()

            this.wait_turnAni = false
        }

        // 打开对话框
        public open(did:DlgId,parm?:any, ani:UiAni = UiAni.nil) {    
            let gp = new eui.Group()
            gp.width = jinx.scwid, gp.height = jinx.schei
            gp.x = 0, gp.y = 0
            this.dlgCont.addChild(gp)
            this.curDlgGp = gp
            this.curDlgGp.name = 'gp-dlg-' + did

            // mask
            let rect = new eui.Rect()
            rect.fillColor = 0x000000
            rect.alpha = 0.7
            rect.top = rect.bottom = rect.left = rect.right = 0
            this.curDlgGp.addChild(rect)

            // 
            let dlg:Dlg = this.createDlg(did, parm)
            if(dlg == null) {
                console.error('没有该对话框：' + did)
                return 
            }
            dlg.fitUi()
            dlg.verticalCenter = 0, dlg.horizontalCenter = 0

            this.curScene && this.curScene.onOpenDlg()
            if(ani == UiAni.pop ) {
                this.aniPop(dlg)
            }
            else {
                this.curDlgGp.addChild(dlg)
            }
        }
        private aniPop(dlg) {
            var oldSc = dlg.scaleX
            dlg.scaleX = dlg.scaleY = 0
            this.curDlgGp.addChild(dlg)
            egret.Tween.get(dlg)
            .to({scaleX:oldSc + 0.1, scaleY: oldSc + 0.1}, 330)
            .to({scaleX:oldSc, scaleY:oldSc}, 80)
        }

        // 关闭对话框
        // @param dlg: 需要关闭的对话框， 如果传 null 则默认关闭当前对话框
        public close(dlg?:Dlg) {
            if(dlg) {
                this.dlgCont.removeChild(dlg.parent)
            }
            else if(this.curDlgGp) {
                this.dlgCont.removeChild(this.curDlgGp)
                this.curDlgGp = null
            }
            
            if(this.dlgCont.numChildren == 0) {
                this.curScene && this.curScene.onCloseDlg()    
            }
        }

        // 关闭指定 DlgId 的对话框
        public closeById(did: DlgId) {
            var gpName = 'gp-dlg-' + did
            for(var idx = 0; idx < this.dlgCont.numChildren; idx++) {
                let dlgGp:any = this.dlgCont.getChildAt(idx)
                if(dlgGp.name == gpName) {
                    this.dlgCont.removeChild(dlgGp)
                }
            }   
            if(this.dlgCont.numChildren == 0) {
                this.curScene && this.curScene.onCloseDlg()    
            }
        }

        // 关闭全部对话框
        public closeAll() {
            this.dlgCont.removeChildren()
            this.curScene && this.curScene.onCloseDlg()
        }

        // 
        public fitUi() {
            this.curScene && this.curScene.fitUi()

            // 
            for(var idx = 0; idx < this.dlgCont.numChildren; idx++) {
                let dlgGp:any = this.dlgCont.getChildAt(idx)
                dlgGp.width = jinx.scwid, dlgGp.height = jinx.schei
                dlgGp.getChildAt(1).fitUi()
            }
        }

        protected abstract createScene(sid:SceneId, parm):Scene
        protected abstract createDlg(did:DlgId, parm):Dlg
    }
}
