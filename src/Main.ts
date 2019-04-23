declare var BIN_VER
// declare var as

//
namespace pgame {
class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    public getAsset(source: string, compFunc:Function, thisObject: any): void {
        function onGetRes(data: any): void {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            let data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    }
}
class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
        function onGetRes(e:string):void {
            compFunc.call(thisObject, e);
        }
        function onError(e:RES.ResourceEvent):void {
            if(e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                errorFunc.call(thisObject);
            }
        }
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
        RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
    }
}

export class Main extends eui.UILayer {
    private loadingUi:LoadingUI
    constructor() {
        super()   
        this.top = this.bottom = this.left = this.right = 0 
    }
    //
    protected createChildren(): void {
        super.createChildren();

        carry.addListener('share_back', this.onShareBack, this)
        carry.addListener('enter_game', this.startCreateScene, this)
        this.loadingUi = new LoadingUI()
        this.addChild(this.loadingUi)
        
        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        /*
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })
        */ 
        /*
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause(); //进入后台暂停游戏
        }
        */
        /*
        egret.lifecycle.onResume = () => {
            // egret.ticker.resume(); //进入前台恢复游戏    
            // 用处1： 假如有识别是否关注二维码的，长按识别去到关注页面，玩家点返回按钮就会进入此回调，即可在此刷新玩家是否关注等数据。
            // 用处2： iOS设备微信端在页面中跳外链后浏览器下端有块前进后退的功能条导致适配出问题
        }
        */
        
    }

    // 创建场景界面    
    private startCreateScene() {
        if( this.loadingUi.isEgReady() && as.isAsReady() ) {
            carry.removeListener('enter_game')
        }
        else {
            return
        }

        // 初始化: jinx && scene && dlg
        jinx.init(this.stage, this.resize, this)
        this.addChild( uiMgr.initScene() )
        this.addChild( uiMgr.initDlg() )

        // kone warning : 你要看看是否需要在正式发布的时候把这些给注释掉
        if(carry.urlParam.stest) {
            var tag = carry.urlParam.stest
            if(tag == 'loading') {
                return
            }
            
            // 
            this.loadingUi.close()
            jinx.resetRem()
            return
        }

        // 
        if(as.otherShare.posterUrl && as.myShare.shareId != as.otherShare.shareId) { //别人海报
            uiMgr.go(SceneId.poster, {
                isMe:false,
                oldUrl: as.otherShare.posterUrl
            })
        }
        else {
            uiMgr.go(SceneId.home)
        }
        this.loadingUi.close()        
        jinx.resetRem()
    }

    private resize() {
        uiMgr.fitUi()
    }

    private onShareBack(ev) {
        uiMgr.closeById(DlgId.share)
    }
}
}
