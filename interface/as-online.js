var HDP;
var Backbone;
var getCookieNoDecodeURIComponent;
var weixinGetConfig;
var hideMenuItemsTimeLink;
var carry;

var as;
!function(as) {
    // kone todo 填写上正确的
    var appId = '111111111111111111';
    var addKey = '22222222222222222';
    var appShortCode = 'aaaa';
    // 
    var asReady = false
    var wxInfoReady = false
    var initReady = false   
    var onActionReady = function() {
        if(wxInfoReady && initReady) {
            asReady = true
            carry.dispEvent('enter_game')
        }
    }
    // 
    var hfile; 
    var hco;
    var hlottery;
    var hfunc;

    /*打点统计
    as.statistics = function(cmd) {
        //数说按钮监控
        try{
            DS && (typeof DS.sendBtnName == "function") && DS.sendBtnName(cmd);
        }catch(e){}   

        // ??? 我们的监控
        var table = HDP.getTable("click_statistics");
        table.set('openid', as.wxUserInfo.openid);
        table.set('nickname', as.wxUserInfo.nickname)
        table.set('cmd', cmd);
        table.save({
            "success": function(res) {
                // console.log('打点成功', res)
            },
            "error": function(res) {
                // console.log('打点失败', res)
            }
        });
    };
    */
    
    /* 微信相关*/    
    // kone todo : 
    // hdp后台配置上授权的公众号，并且运行平台选中“微信平台”
    // 设置分享语
    as.wxUserInfo = {
        avatar: '',
        nickname: '',
        openid: '',
        country:'',
        province: '',
        city:'',
        sex: 1,
        subscribe: ''
    };
    var weixin;
    var shareTitle = document.title
    var shareDesc = document.title + '-desc'
    // 
    var setWxShare = function() {
        var linkUrl = (window.location.origin + window.location.pathname);
        var title = shareTitle; 
        var desc = shareDesc;
        var iconUrl = window.location.origin + '/' + appShortCode + '/share.jpg?1'

        var onShareSucc = function() {
            carry.dispEvent('share_back');
        };
        weixin.initShare({
            "link": linkUrl, //链接
            "appMessageTitle": title, //标题
            "appMessageDesc": desc, //分享语
            "appMessageImgUrl": iconUrl, //分享图标
            "appMessageShareSucc": onShareSucc,
            "timelineTitle": desc,
            "timelineImgUrl": iconUrl,
            "timelineShareSucc": onShareSucc
        });
    };
    var getWxInfo = function(cbFunc) {
        var defineAvatar = "http://cdn.aiwanpai.com/s/d.jpg";
        weixin.getUserInfoV2({
            "success": function(res) {
                if(res) {
                    if(res.nickname) {
                        if (res.nickname.indexOf('"') > -1) {
                            res.nickname = res.nickname.replace(/"/g, '“');
                        }
                        if (res.nickname.indexOf("'") > -1) {
                            res.nickname = res.nickname.replace(/'/g, "‘");
                        }
                    }
                    if(res.avatar == "") {
                        res.avatar = defineAvatar;
                    }
                    as.wxUserInfo = res;
                }
                else {
                    carry.weakHint('数据错误：获取不到微信用户信息')
                }
                cbFunc(true);
            },
            "error": function(res) {
                if(!carry.isLocal) {
                    alert('weixin.getUserInfoV2 错误：' + JSON.stringify(res))
                }
                cbFunc(false);
            }
        });
    };
    var initWx = function(func) {
        weixinGetConfig();
        weixin = HDP.weixin();
        hideMenuItemsTimeLink();  //默认要隐藏分享到朋友圈

        //kone todo 设置统计方式 
        weixin.setStatisticsType(2); //0 ??, 1 数说，2 派加
        weixin.setPiplusStaits("", false); //默认设定派加统计代码
        // weixin.setDatastory(''); //设定数说统计代码
        setWxShare();
        getWxInfo(func)
    };

    /*自定义HDP接口*/
    var toolsRequest = function() {
        var bizhttp;
        var addr = '/gialengameehvi/'
        if(carry.isLocal || carry.isDemo) {
            bizhttp = "http://demo.biz.aiwanpai.com" + addr;
        }
        else {
            bizhttp = "//biz.aiwanpai.com" + addr;
        }

        // 
        var BizInterface = Backbone.Model.extend({});
        var bizInterface = new BizInterface();
        var query = HDP.Query(bizInterface);
        var encoder = HDP.getEncoder();

        return function(name, param, func) {
            param = param || {}
            query.findQuery(bizhttp + name + "?wxu_session=" + getCookieNoDecodeURIComponent("hdp_wxu_s_" + appId), {
                requestbody: true,
                data: encoder.encode(JSON.stringify(param)),
                success: function(res) {
                    if(res) {
                        func(res)
                    }       
                    else {
                        alert('请求' + name + '成功。但返回数据为null')
                        func({})
                    }
                },
                error: function(res) {
                    var msg = res && res.msg
                    msg = msg || (res && res.code)
                    carry.weakHint('请求' + name + '失败：' + msg)
                    // alert('请求' + name + '错误：' + JSON.stringify(res))
                    func({})
                }
            });
        }
    }();
    //
    var saveTable = function(tableName, value, callback) {
        var table = HDP.getTable(tableName);
        for (var key in value) {
            table.set(key, value[key]);
        }
        table.save({
            "success": function(res) {
                callback(res);
            },
            "error": function(res) {
                callback(null);
            }
        });
    };

    // 初始化数据
    var initGameData = function(func) {
        func() 
    }

    // 获取我的奖品列表
    var userPrize = function(func) {
        hlottery.getUserLotteryResult({
            "page" : 1,
            "size" : 5,
            "success": function(res) {
                console.log(res)
                if(res && res.data) {
                    as.myPrizes = res.data || []
                    setPrizeRotAndType()
                    queryFun("getUserInfo", {'openid': as.wxUserInfo.openid}, function(rdata) {
                        if(rdata && rdata[0]) {
                            var data = rdata[0]

                            for(var idx = 0; idx < as.myPrizes.length; idx++) {
                                var info = as.myPrizes[idx]
                                if(info.prizeType == 1) {
                                    info.name = data.name
                                    info.phone = data.phone   
                                    info.area = data.area
                                    info.address  = data.address
                                }
                            }
                        }
                        func();
                    });
                }
                else {
                    func();
                }
            },
            "error": function(res) {
                var code = res && res.code || '' 
                carry.weakHint('获取中奖列表失败，code:' + code)
                func();
            }
        });
    }


    // 通讯事件名
    as.action = {}

    as.myShare = {shareId:''}
    as.otherShare = {shareId:''}
    as.myPrizes = [] //我的奖品

    /* 抽奖相关 *****************************************************************************/ 
    as.action.gameLottery = 'game_Lottery'
    as.action.saveLotteryInfo = 'save_Lottery_Info'
    // 
    as.gameLottery = function() {
        carry.dispEvent(as.action.gameLottery, {prizeName:''})
    }
    // select * from [user_info] where openid = #{openid}
    // 提交领奖信息 
    // 需要在数据管理中建个表  user_info ,设计好需要的表列字段
    as.saveLotteryInfo = function(mpId, name, phone, area, address) {
        var info = as.myPrizes[mpId]
        var valuedata = {
            "openid": as.wxUserInfo.openid,
            "nickname": as.wxUserInfo.nickname,
            "avatar": as.wxUserInfo.avatar,

            "prize_sn": info.prizeSn,
            "prize_name": info.prizeName,

            "name": name,
            "phone": phone,
            "area": area,
            "address": address
        };
        saveTable("user_info", valuedata, function(obj) {
            var isSucc = false
            if(obj) { //返回这样的 {id: "a8f437c07eec4cd8b1b8f449fc0f34dd"}
                info.name = name
                info.phone = phone
                info.area = area
                info.address = address
                carry.weakHint('保存信息成功')
                isSucc = true
            }
            else {
                carry.weakHint('提交表单失败')   
            }
            carry.dispEvent(as.action.saveLotteryInfo, isSucc)
        });
    }
    /* end of */


    /* 登录注册 ********************************************************************************/
    as.action.getCode = 'get_Code'
    as.action.login = 'login'
    // 获取验证码
    as.getCode = function() {
        setTimeout(function() {
            carry.dispEvent(as.action.getCode, true)   
        }, 1000)
    }
    // 登录
    as.login = function() {
        setTimeout(function() {
            carry.dispEvent(as.action.login, true)      
        }, 10000)
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
    // createMyQr() //先在合适的地方调用该方法
    /* end of */ 


    as.isAsReady = function() {
        return asReady
    }
    as.init = function() {
        HDP.init(appId, addKey);
        // hfile = HDP.getFile(); 
        // hco = HDP.getAppCooperation();  //协作
        // hlottery = HDP.getLottery(); //抽奖（新版）
        // hfunc = HDP.getFunction();

        initWx(function() {
            if(carry.isDemo && carry.urlParam.wxtest) {
                carry.clog(as.wxUserInfo.openid)
            }
            wxInfoReady = true
            onActionReady()
        });
    }
}(as || (as = {}))
