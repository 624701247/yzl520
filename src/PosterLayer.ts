
namespace pgame {
    
interface PosterParm {
    isMe:boolean;  //是自己的海报，还是查看好友分享的海报
    oldUrl:string; //自己或好友分享的海报链接
}
export function goPoster(parm:PosterParm) {
    uiMgr.go(SceneId.poster, parm)
}

var posterDom:jinx.Dom
export class PosterLayer extends Scene {
    //初始化 设置海报图片、上传的照片；是自己的还是好友分享的，
    public static init() {
    }

    // 
    private posterGp:eui.Group
    private dkImg:eui.Image
    private headGp:eui.Group
    private headImg:eui.Image
    private qrImg:eui.Image
    private nameLb:eui.Label
    private oldPosterImg:eui.Image

    // 
    private otherGp:eui.Group
    private createMyBtn:eui.Button
    // 
    private myGp:eui.Group
    private find520Btn:eui.Group
    private shareBtn:eui.Group

    
    // 第一：ui渲染出来后要等一段时间合成图片才会成功，否则可能会合成出黑图
    // 第二：进游戏可以先创建该对象，然后等玩家触发在添加到舞台
    private isWaitUiReady:boolean = false 

    private isWaitAniReady:boolean = false //海报弹出就绪

    private isQrReady:boolean = false //二维码是否加载就绪
    private isHeadReady:boolean = false //微信头像是否加载就绪
    private isOldPosterReady:boolean = false //旧海报纹理是否加载就绪
    private isPosterImgReady:boolean = false //海报img标签是否就绪

    // 
    private isMe:boolean
    private oldUrl:string
    constructor(parm:PosterParm) {
        super(PosterLayerSkin)
        this.isMe = parm.isMe
        this.oldUrl = parm.oldUrl


        this.myGp.visible = this.isMe
        this.otherGp.visible = !this.isMe
        if(this.isMe) {
            jinx.addTapEvent(this.find520Btn, this.ontapFind520, this)
            jinx.addTapEvent(this.shareBtn, this.ontapShare, this)
        }
        else  {
            jinx.addTapEvent(this.createMyBtn, this.ontapCreateMy, this)
        }

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this)
    }

    public onAdd() {
        carry.addListener(as.action.uploadBase64, this.onUpload, this)
        posterDom && posterDom.show()
        if(this.oldUrl) {
            this.createPosterImg(this.oldUrl)

            this.aniPosterReady()
            this.isWaitUiReady = true            
            jinx.url2Texture_eg(this.oldUrl, this.onCreateOldPosterEnd, this)
        }
        else {
            this.aniPosterReady()
            setTimeout(function() { 
                this.isWaitUiReady = true
                this.createPoster()
            }.bind(this), 200);

            this.oldPosterImg.visible = false
            jinx.dataurl2texture(as.getMyQrDataurl(), this.oncreateQrEnd, this)
            jinx.url2Texture_cvs(as.wxUserInfo.avatar, this.oncreateHeadEnd, this)
        }
    }


    public fitUi() {
        var info = jinx.fitMaxSize(this.posterGp, jinx.scwid - 40, null)  
        this.myGp.scaleX = this.myGp.scaleY = info.sc
    }

    // 合成海报,并提交生成的base64字符串
    private createPoster() {
        if(!this.isWaitUiReady || !this.isWaitAniReady) {
            return 
        }
        console.log('ccc')
        carry.spinner.show()
        let rect = new egret.Rectangle(0, 0, this.posterGp.width, this.posterGp.height)
        var rt:egret.RenderTexture = new egret.RenderTexture()
        rt.drawToTexture(this.posterGp, rect);
        var dataurl = rt.toDataURL("image/jpeg")
        this.createPosterImg(dataurl)
        as.uploadBase64(dataurl)
    }

    private oncreateQrEnd(texture) {
        console.log('二维码渲染成功')
        this.qrImg.texture = texture
        this.isQrReady = true
        this.showAni()
    }
    private oncreateHeadEnd(texture) {
        console.log('微信头像渲染成功')
        this.headImg.texture = texture
        this.isHeadReady = true
        this.showAni()
    }
    private onCreateOldPosterEnd(texture) {
        this.oldPosterImg.visible = true
        this.oldPosterImg.texture = texture
        this.isOldPosterReady = true
        this.showAni()
    }

    private showAni() {
        if(this.oldUrl) { //有旧海报显示
            if(this.isPosterImgReady && this.isOldPosterReady && this.isWaitUiReady) {
                this.aniPoster(function(){}, this)
            }
        }
        else { //显示新合成的海报
            if(this.isQrReady && this.isHeadReady) {
                this.aniPoster(function() {
                    this.isWaitAniReady = true
                    this.createPoster()
                }, this)
            }
        }
    }

    private onUpload(ev) {
        if(ev.data) {
            carry.weakHint('上传海报成功！')
        }
        carry.spinner.hide()
    }

    public onBack() {
        carry.removeListener(as.action.uploadBase64)
        posterDom && posterDom.hide()
    }
    //
    public onOpenDlg() {
        console.log('打开了对话框')
        posterDom && posterDom.hide()
    }
    // 
    public onCloseDlg() {
        console.log('所有对话框都光比了')
        posterDom && posterDom.show()
    }

    private ontapCreateMy() {
        uiMgr.go(SceneId.home)
    }
    private ontapFind520() {
        // alert('跳转到我的奖品')
        uiMgr.go(SceneId.game)
    }
    private ontapShare() {
        uiMgr.open(DlgId.share)
    }

    // 海报弹出动画
    private oriPosterSc:number
    private aniPosterReady() {
        carry.spinner.show()
        this.isWaitAniReady = false
        this.oriPosterSc = this.posterGp.scaleX
        this.posterGp.scaleX = this.posterGp.scaleY = 0
        console.log('ready', this.oriPosterSc)
    }
    private aniPoster(cbFunc, that) {
        carry.spinner.hide()
        console.log('ani go')
        var ss  = this.oriPosterSc + 0.1
        egret.Tween.get(this.posterGp).to({scaleX:ss, scaleY: ss}, 400).to({scaleX:this.oriPosterSc, scaleY:this.oriPosterSc}, 80)
        .call(cbFunc, that)
    }

    // 创建海报img标签
    private createPosterImg(url) {
        if(posterDom) {
            posterDom.remove()
        }
        posterDom = new jinx.Dom(this.posterGp, null, false)
        let str = '<img src="' + url + '" style="width:100%;height:100%; opacity:0;" />'
        posterDom.setInnerHTML(str)
        this.isPosterImgReady = true
    }
}   //end of class
}   //end of module
