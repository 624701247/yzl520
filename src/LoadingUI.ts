class LoadingUI extends egret.Sprite {
    private el_page:HTMLElement  
    private el_proTxt1:HTMLElement  //百分比
    private el_proTxt2:HTMLElement
    // private el_proBar:HTMLElement  //进度条
    // private fullProWid:number   //进度条走满宽度

    // private otherCount:number = 0   //egret机制外加载资源计数
    // private otherTotalCount:number  //egret机制外加载资源总数

    private ver:string = BIN_VER + ''
    private isThemeLoadEnd: boolean = false;
    private isResourceLoadEnd: boolean = false;
    private egReady:boolean = false  //是否 所有资源加载完毕

    public constructor() {
        super();   
        this.loadEgretRes()
        
        this.el_page = document.getElementById('loadingScene')  
        // this.el_proBar = document.getElementById('loadingPro')
        this.el_proTxt1 = document.getElementById('loadingPerc1')  
        this.el_proTxt2 = document.getElementById('loadingPerc2')  
        // this.fullProWid = document.getElementById('loadingBar').offsetWidth
    }

    //初始化Resource资源加载库
    private loadEgretRes() {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json?" + this.ver, "resource/");
    }
    private onConfigComplete() {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json?" + this.ver, this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, function() {
            this.isThemeLoadEnd = true;
            this.finish()
        }, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("loading");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "loading") { //设置加载进度界面
            this.showLoadingUi()
            RES.loadGroup("preload");
        }
        else if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.finish()
        }
    }
    // 资源组加载出错
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);//忽略加载失败的项目
    }
    // 资源组加载进度
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    // 资源组加载出错
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    // 
    private finish() {
        if(this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.egReady = true
            var ev = new Event('enter_game')
            document.dispatchEvent(ev)
        }   
    }
    public isEgReady() {
        return this.egReady
    }

    private showLoadingUi() {
        // loading 页面播放龙骨动画
        //1、 less:  @z-egret 必须高于 @z-loading 
        //2、 相应龙骨资源必须写在 loading 组中
        /*
        let bone = new jinx.Bone('loading', 'armatureName')
        bone.x = jinx.scwid / 2
        bone.y = jinx.schei * 0.48
        bone.play('newAnimation')
        this.addChild(bone)
        */ 

        // this.loadOther()
    }

    public setProgress(current:number, total:number):void {
        let per = current / total
        if(per > 1) {
            per = 1
        }
        per = Math.floor(per * 100) // n%
        
        // this.el_proBar.style.width = per / 100 * this.fullProWid + 'px'   
        
        if(this.el_proTxt1) {
            this.el_proTxt1.innerHTML = per + ''; //舍弃小数部分
        }
        if(this.el_proTxt2) {
            this.el_proTxt2.innerHTML = per + '';
        }
    }

    public close() {
        if(this.parent)  {
            this.parent.removeChild(this)
        }
        this.el_page.remove()
    }

    //kone todo： egret的机制无法预加载的东西,比如gif，在这里预加载
    /*
    private onOtherLoad(isSucc, src) {
        if(isSucc) {
            this.otherCount++
        }
        else {
            console.error('加载资源失败', src)
        }
    }
    private loadOther() {
        var count = 0
        var gas = ['qi_dai', 'shuai', 'shuo_de_dui', 'wen_wo', 'xiang', 'yong_xing_gan_shou', 'zai_ma']
        this.otherTotalCount = gas.length
        for(var idx = 0; idx < this.otherTotalCount; idx++) {
            carry.loadImg('resource/gif/' + gas[idx] + '.gif?' + BIN_VER, this.onOtherLoad, this)
        }
    }
    */
}