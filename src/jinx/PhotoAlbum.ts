// TypeScript file

declare var EXIF

/* eg： 
var phoAlbum = new jinx.PhotoAlbum(this.getPicGp)
phoAlbum.setCallBack(this.ongetPho, this)
phoAlbum.setCompress(500, 400) //压缩图片尺寸
phoAlbum.create()
*/

namespace jinx {

export class PhotoAlbum extends Dom {
    private el_inp: HTMLElement
    private reader:FileReader

    private maxWid:number = -1
    private maxHei:number = -1
    private needCompress:boolean = false

    private cutWid:number = -1
    private cutHei:number = -1
    private needCut:boolean = false

    private cbFun:Function
    private that:Object



    constructor(contGp:eui.Group, clsName?:string, isAutoRemove:boolean = true) {
        super(contGp, clsName, isAutoRemove)

        if(typeof(EXIF) == 'undefined') {
            console.error('请先引入 exif.js')
            return 
        }
    }

    public setCallBack(cbFun, that) {  
        this.cbFun = cbFun
        this.that = that
    }

    //压缩转化出来的图片
    // @param maxWid: 转化的图片最大宽度
    // @param maxHei: 转化的图片最大高度
    // 当两个参都有设置时，以较小的那个值为参考按比例缩放原图
    public setCompress(maxWid:number = -1, maxHei:number = -1) {
        this.maxWid = maxWid
        this.maxHei = maxHei
        this.needCompress = true
    }

    // 给定宽高，使获取的图片居中裁剪铺满此宽高
    public setBespreadCut(wid:number, hei:number) {
        this.cutWid = wid
        this.cutHei = hei
        this.needCut = true
    }

    public create(inpId:string = 'inp-img') {
        let str = ''
        str += `
        <span style="width:100%; height:100%; display: block;"></span>
        <input
            id="` + inpId + `"
            type="file"
            class="inp-uploading"
            accept="image/*"
            capture="camera"
            style="
                position: absolute;
                width:100%;
                height:100%;
                top:0;
                left:0;
                opacity:0;"
        >
        `
        // multiple="multiple"  多选，一次可以调起多张
        // accept="image/*"  设定上传文件的类型
        // capture="camera" 调起摄像头

        this.setInnerHTML(str)
        this.el_inp = document.getElementById(inpId)
        this.el_inp.onchange = this.onchange.bind(this)
    }

    // 
    private onchange(ev:any) {
        let file = ev.target.files[0]

        //
        var reader = new FileReader(); //新建FileReader对象
        reader.readAsDataURL(file); //读取为base64
        this.reader = reader

        reader.onprogress = this.onprogress.bind(this)

        reader.onabort = this.onabort.bind(this)

        reader.onerror = this.onerror.bind(this)

        //onloadend 读取完成触发，无论成功还是失败
        // reader.onloadend = this.onFileLoad.bind(this)

        // onload 文件读取成功完成时触发
        reader.onload = this.onFileLoad.bind(this)
    }

    private onprogress(e) {
        //这个是定时触发的事件，文件较大的时候较明显
        // Math.round(e.loaded / e.total * 100) + '%' ;        
    }
    private onabort() {
        console.log('abort'); //用作取消上传功能
    }
    private onerror() {
        carry.weakHint('读取相册失败~')
    }

    private onFileLoad() {
        var img = new Image();
        img.src = this.reader.result;
        img.onload = this.onImgLoad.bind(this);
    }

    private onImgLoad(ev) {
        this.getExifOrientation(ev.target, function(rotation) {
            let dataurl;
            let cvs;
            if(carry.urlParam.ktest_rot) {
                rotation = parseInt(carry.urlParam.ktest_rot)
            }
            if(this.needCompress || rotation != 0) { //压缩、转换方向
                console.log('压缩', this.needCompress, rotation)
                cvs = this.compressImg(ev.target, rotation)
            }

            if(this.needCut) { //裁剪
                if(cvs) {
                    console.log('压缩过的图上裁剪')
                    cvs = this.cutImg(cvs) 
                }
                else {
                    console.log('原图裁剪')
                    cvs = this.cutImg(ev.target) 
                }
            }

            if(cvs) {
                dataurl = cvs.toDataURL();
            }
            else {
                dataurl = this.reader.result
            }

            this.cbFun.call(this.that, dataurl)
        }, this)
    }

    //用 canvas绘制的方法压缩图片
    private compressImg(img, rotation) {
        let maxWid;
        let maxHei;
        if(this.needCompress) {  // 压缩图片尺寸
            maxWid = this.maxWid
            maxHei = this.maxHei
            let ratio = img.width / img.height
            if(maxWid == -1) {
            maxWid =  maxHei * ratio
            }
            else if(maxHei == -1) {
            maxHei =  maxWid / ratio
            }
            else {
                if(maxWid / maxHei <= ratio) {
                    maxHei =  maxWid / ratio
                }
                else {
                    maxWid =  maxHei * ratio
                }
            }
        }
        else {  //按图片原尺寸来
            maxWid = img.height
            maxHei = img.width
        }

        let rr = bespreadRect(img.width, img.height, maxWid, maxHei)
        // console.log('rr', maxWid, maxHei, rr)
        let tarWid = Math.ceil(img.width * rr)
        let tarHei = Math.ceil(img.height * rr)

        // 
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        if(rotation == 0) {
            canvas.width = tarWid
            canvas.height = tarHei
            ctx.drawImage(img, 0, 0, tarWid, tarHei);
            return canvas
        }   

        if(rotation == 180) {
            canvas.width = tarWid * 2
            canvas.height = tarHei * 2
            ctx.translate(tarWid, tarHei) //设置选择点位置
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(img, 0, 0, tarWid, tarHei);
            
            // 
            let targetCvs = document.createElement("canvas")
            targetCvs.width = tarWid
            targetCvs.height = tarHei
            let targetCtx = targetCvs.getContext("2d");
            targetCtx.drawImage(canvas, 0, 0, tarWid, tarHei,
            0, 0, tarWid, tarHei)
            return targetCvs
        }

        if(rotation == 90) {
            canvas.width = tarWid + tarHei
            canvas.height = Math.max(tarWid, tarHei) 
            ctx.translate(tarHei, 0) //设置选择点位置
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(img, 0, 0, tarWid, tarHei);

            // 
            let targetCvs = document.createElement("canvas")
            targetCvs.width = tarHei
            targetCvs.height = tarWid
            let targetCtx = targetCvs.getContext("2d");
            targetCtx.drawImage(canvas, 0, 0, tarHei, tarWid,
            0, 0, tarHei, tarWid)
            return targetCvs
        }

       if(rotation == -90) {
            canvas.width = Math.max(tarWid, tarHei) 
            canvas.height = tarWid + tarHei
            ctx.translate(0, tarWid) //设置选择点位置
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(img, 0, 0, tarWid, tarHei);

            // 
            let targetCvs = document.createElement("canvas")
            targetCvs.width = tarHei
            targetCvs.height = tarWid
            let targetCtx = targetCvs.getContext("2d");
            targetCtx.drawImage(canvas, 0, 0, tarHei, tarWid,
            0, 0, tarHei, tarWid)
            return targetCvs
        }
    }

    // 
    private cutImg(target) {
        let cutWid;
        let cutHei;
        let targetCvs = document.createElement("canvas")

        cutWid = Math.min(this.cutWid, target.width)
        cutHei = Math.min(this.cutHei, target.height)

        targetCvs.width = cutWid
        targetCvs.height = cutHei
        let targetCtx = targetCvs.getContext("2d");
        targetCtx.drawImage(target, (target.width - cutWid) / 2, (target.height - cutHei) / 2, cutWid, cutHei,
        0, 0, cutWid, cutHei)

        return targetCvs
    }

    private getExifOrientation(img, cbFun, that) {
        let orientation;
        let flag = EXIF.getData(img, function(flag) {                        
            orientation = EXIF.getTag(this, 'Orientation');
            if(orientation == null) {
                orientation = -1
            }
            cbFun.call(that, PhotoAlbum.getRotation(orientation))
        });
        if(flag == false) {
            orientation = -1
            cbFun.call(that, PhotoAlbum.getRotation(orientation))
        }
    }


    // 根据 Exif Orientation 获取egret的旋转值
    private static getRotation(ori) {
        let rotation;
        switch (ori) {
            case 1 && -1: 
                rotation = 0;
                break;
            case 6:
                rotation = 90;
                break;
            case 8:
                rotation = -90;
                break;
            case 3:
                rotation = 180;
                break;
            default:
                rotation = 0;
                break;
        }
        return rotation
    }

    /*test func 
    private createImgEl(dataUrl) {
        var node = document.createElement('div')
        node.style.cssText = `
            position: absolute;
            width:100%;
            height:100%;
            z-index:100;
            top:0;
            left:0;
        `

        var str = `<img  
            src="` + dataUrl + `"
            style="position: absolute;
                width:50%;
                bottom: 0;
                right:0;
                display: block;"
         />`
        node.innerHTML = str;
        document.body.appendChild(node)
    }
    */ 

}

}