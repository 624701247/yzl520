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
            
            //控制台打开
            // pgame.uiMgr.open(3) 
            // pgame.uiMgr.go(0)

            // 
            // uiMgr.open(DlgId.qrcode)
            // uiMgr.open(DlgId.rule, null, UiAni.pop)
            // uiMgr.open(DlgId.login)
            // uiMgr.open(DlgId.share)
            // uiMgr.open(DlgId.myprize)
            // uiMgr.open(DlgId.swprize)

            // 
            // uiMgr.go(SceneId.wheel)

            //情况1：自己的，已经生成过海报
            // goPoster({isMe:true, oldUrl:'http://172.18.11.118:1131/resource/assets/cont_qrcode.png'}) 
            //情况2：自己的，首次生成海报
            // goPoster({isMe:true, oldUrl:''}) 
            //情况3：打开好友分享的海报
            // goPoster({isMe:false, oldUrl:'http://172.18.11.118:1131/resource/assets/cont_qrcode.png'}) 
            
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
        else if(as.myShare.posterUrl) { //自己的海报
            uiMgr.go(SceneId.poster, {
                isMe:true,
                oldUrl: as.myShare.posterUrl
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

/*  kone readme
// 
其他设备新clone项目要初始化一些东西
1、 cd node   npm install
2、 如果有，引进相应的第三方库

// 
default.res.json 被我去掉了一些基本没用的eui资源加载，如下：
    checkbox_select_disabled_png,checkbox_select_down_png,checkbox_select_up_png,checkbox_unselect_png,
    radiobutton_select_disabled_png,radiobutton_select_down_png,radiobutton_select_up_png,radiobutton_unselect_png,
    selected_png,
    button_down_png,button_up_png,
    border_png,header_png,thumb_png,track_png,tracklight_png,handle_png,off_png,on_png,thumb_pb_png,track_pb_png,
    track_sb_png,
    description_json,
    roundthumb_png //滚动视图滚动条用到的

    {
        "url": "config/description.json?3322",
        "type": "json",
        "name": "description_json"
    },

*/ 