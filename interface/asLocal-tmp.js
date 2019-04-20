var carry;

var as;
!function(as) {
    // 通讯事件名
    as.action = {}


    /* 微信相关 ************************************************************************/    
    as.wxUserInfo = {
        avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1795102168,472009350&fm=27&gp=0.jpg',
        nickname: 'jinx',
        openid: '1234',
        country:'',
        province: '',
        city:'',
        sex: 1,
        subscribe: ''
    };
    var getShareLink = function() {
        var url = (window.location.origin + window.location.pathname) + '?xx=1'
        return url
    }
    /* end of */


    /* 分享协作 ****************************************************************************/
    as.myShare = {
        share_id:'sid11111',
        posterUrl: ''
        // posterUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1795102168,472009350&fm=27&gp=0.jpg'
    }
    as.otherShare = {
        share_id:'sid222222',
        posterUrl: ''
        // posterUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1795102168,472009350&fm=27&gp=0.jpg'
    }
    /* end of */

    /*动态生成二维码 **************************************************************************/ 
    var qrcode;
    var createMyQr = function() {
        var url = getShareLink()
        var el = document.createElement('div')
        el.style.cssText = "width:100px; height:100px; position:absolute;z-index:1; top:-110px;"
        document.body.appendChild(el)
        el.id = 'cont-qrCode'
        if(qrcode) {
            qrcode.clear(); // clear the code.
            qrcode.makeCode(url);// make another code.
        }
        else {
            qrcode  = new QRCode(el, {
                text: url,
                width : 100,
                height : 100
            });
        }
    }
    as.getMyQrDataurl = function() {
        var el = document.getElementById('cont-qrCode')
        var img = el.querySelector('img')
        var cvs = el.querySelector('canvas')
        if(img && img.src) {
            return img.src
        }
        else if(cvs) {
            return cvs.toDataURL()
        }
        else {
            carry.weakHint('生成二维码失败')
            return ''
        }
    }
    /* end of */ 


    /* 上传照片 ****************************************************************************/
    as.uploadBase64 = 'uploadBase64',
    as.uploadBase64 = function(base64) {
        setTimeout(function() {
            carry.dispEvent(as.action.uploadBase64, true)
        }, 0);
    }
    /* end of */


    /* 抽奖相关 *****************************************************************************/ 
    as.myPrizes = [
        {
            prizeName:'实物',
            prizeId:'p01',
            name:'jinx',
            phone:'15626476235',
            address:'北京山顶尾'
        }
        // {
        //     prizeName:'卡券',
        //     prizeId:'p01',
        //     name:'jinx',
        //     phone:'15626476235',
        //     address:'北京山顶尾'
        // }
    ]
    as.action.gameLottery = 'game_Lottery'
    as.action.saveLotteryInfo = 'save_Lottery_Info'
    as.gameLottery = function() {
        setTimeout(function() {
            carry.dispEvent(as.action.gameLottery, -1)
        }, 50);
    }
    as.saveLotteryInfo = function(pinfo, name, phone, area, address) {    
        console.log('saveLotteryInfo', arguments)
        var info = pinfo || as.myPrizes[0]
        info.name = name
        info.phone = phone
        info.area = area
        info.address = address
        carry.dispEvent(as.action.saveLotteryInfo, true)
    }
    as.PrizeType = {
        sw : 'sw',
        coupon: 'coupon'
    }    
    var pResInfo = []
    as.getPrizeResInfo = function(pinfo) {
        pinfo = pinfo || {}
        var prizeName = pinfo.prizeName
        if(!pResInfo[prizeName]) {
            var name = ''
            var typ = ''
            switch(prizeName) {
                case '名字1':
                    name = 'prize_1_png'
                    break
                case '卡券':
                    name = 'prize_2_png'
                    typ = as.PrizeType.coupon
                    break
                case '实物':
                    name = 'prize_3_png'
                    typ = as.PrizeType.sw
                    break
                default:
                    name = ''
                    typ = ''
                    break
            }
            pResInfo[prizeName] = {
                resName: name,
                prizeType: typ
            }
        }
        return pResInfo[prizeName]
    }
    /* end of */


    /* 登录注册 ********************************************************************************/
    as.action.getCode = 'get_Code'
    as.action.login = 'login'
    as.getCode = function() {
        setTimeout(function() {
            carry.dispEvent(as.action.getCode, true)   
        }, 1000)
    }
    as.login = function() {
        setTimeout(function() {
            carry.dispEvent(as.action.login, true)      
        }, 10000)
    }
    /* end of */


    /******************************************************************************************/ 
    var onActionReady = function() {
        asReady = true
        carry.dispEvent('enter_game')
    }
    var asReady = true
    as.isAsReady = function() {
        return asReady
    }
    as.init = function() {

        createMyQr()

        onActionReady()
    }
    /**/
}(as || (as = {}))
