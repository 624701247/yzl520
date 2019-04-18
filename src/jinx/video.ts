// TypeScript file
namespace jinx {

var videoAction = 'jinx-video-change'

export interface VideoInfo {
    wid:number;
    hei:number;
    url:string;
    poster?:string;
}

export class Video extends Dom {
    private el_video: any   //HTMLElement
    private isPlay:boolean = false

    constructor(contGp:eui.Group, clsName?:string, isAutoRemove:boolean = true) {
        super(contGp, clsName, isAutoRemove)
    }

    public create(videoInfo:VideoInfo) {
        let url = videoInfo.url
        let poster = videoInfo.poster || ''
        let wid = videoInfo.wid
        let hei = videoInfo.hei

        // let id = 'video-jinx'
        // id="` + id + `" 

        let str = ''
        str += `
        <video
            preload="preload"
            width="` + wid + `" 
            height="` + hei + `"
            style="width:100%; height:100%;"
            object-fit="contain"
            x5-video-player-fullscreen="true"
            webkit-playsinline="true" 
            x-webkit-airplay="true" 
            playsinline="true" 
        `
        if(egret.Capabilities.os == 'iOS') {
            str += `x5-video-player-type="h5"`
        }
        str += `>Your browser does not support the video tag.</video>`

        this.setInnerHTML(str)
        this.el_video = this.el_cont.querySelector('video')
        this.el_video.oncanplay = this.oncanplay.bind(this) //视频加载完成
        this.el_video.onerror = this.onerror.bind(this)     //视频加载失败，ios设备无法预加载，会进到这里回调里面
        this.el_video.onended = this.onended.bind(this)
        this.el_video.onplay = this.onplay.bind(this)       // 只要调用了 this.el_video.play() 就会触发
        this.el_video.src = url
    }

    // 视频状态改变回调事件
    public addChangeEvent(func, that) {
        carry.addListener(videoAction, func, that)
    }

    public getIsPlay() {
        return this.isPlay
    }

    // @param isPlay: 是否播放,不传递值则是 play\pause 切换
    // @param playTime: 设置播放时间
    public ctrl(isPlay?:boolean, playTime?:number) {
        if(this.el_video == null) {
            return 
        }

        if(isPlay == null) {
            isPlay = !this.getIsPlay()
        }

        if(isPlay) {
            if(playTime != null) {
                this.el_video.currentTime = playTime 
            }
            this.el_video.play()
        }
        else {
            this.el_video.pause()
        }
        this.isPlay = isPlay
        carry.dispEvent(videoAction)
    }

    // 
    private onplay() {
        // carry.clog('onplay')
    }
    public oncanplay() {
        // carry.clog('oncanplay')
    }
    public onerror() {
        // carry.clog('onerror')
    }
    public onended() {
        // carry.clog('onended')
        this.isPlay = false
        carry.dispEvent(videoAction)
    }
    // 

    public show() {
        super.show()
    }

    public hide() {
        super.hide()
        this.ctrl(false)
    }
}

}


// kone read me:
// controls="controls"

// 自动播放，只在pc端上有效, pc端不用等待 oncanplay ，直接调用this.el_video.play() 就能播放
// autoplay="autoplay"

// 视频封面
// poster="` + poster + `" 

//视频需要的格式是：
// MP4 = MPEG4 文件使用 H264 视频编解码器和AAC音频编解码器
// WebM = WebM 文件使用 VP8 视频编解码器和 Vorbis 音频编解码器
// Ogg = Ogg   文件使用 Theora 视频编解码器和 Vorbis音频编解码器
// src=""


/* 移动设备上默认调用系统浏览器播放视频的：
    1）、这样就是置顶，设置z-index有效，无法在其上面加个什么跳过按钮之类的；
    2）、也无法oncanplay、onended等一些回调 
加上如下属性即可搞定：
// 启用H5播放器
    x5-video-player-type="h5"  
*/

// 全屏设置，设置为 true 是防止横屏
//  x5-video-player-fullscreen="true"　

// IOS微信浏览器支持小窗内播放
// playsinline="true" 
// webkit-playsinline="true" 

//  ？？？
// x-webkit-airplay="true" 


// kone point ：  
// 我的魅族por7 在 x5-video-player-type="h5" 下无法小窗播放， 去掉该属性则可以。
// 有些android 设备，如小米、华为，无论如何都没办法小窗播放
        

// kone point  我的魅族，一定要 this.el_video.play() 一下，视频才能出来。
// kone point  ios 设备预先加载视频加载不了，oncanplay 可能触发不了