var as = {};

/*------------------初始化基础数据 start---------------------*/
as.domains = "http://"+document.domain+"/Mb1x/";
as.AppID = "ccd5e2a5f42911e6bb186c92bf3148fb";
as.AppKey = "f6458914132f4ec4994108f73bdd9052";

//默认头像
as.defineAvatar = "http://cdn.aiwanpai.com/s/d.jpg";

as.shareLink = as.domains + "index.html";
as.shareTitle = "测试分享标题";
as.shareDesc = "测试分享语";
as.shareImgUrl = as.domains + "share.jpg";
as.success = function() {
    if(SGame && typeof SGame.shareSuccessCallback == "function") SGame.shareSuccessCallback();
};
as.appSuccess = function() {
    if(SGame && typeof SGame.shareSuccessCallback == "function") SGame.shareSuccessCallback();
};

as.openid = "";
as.wxUserInfo = {};
as.isSubscribe = false; //是否关注
as.rankName = "rank";//排行榜名称
as.statisticsType = 1;//1 数说，2 派加
as.datastory = "";//数说统计代码，默认使用爱玩派统计
as.piplusUrl = "";//派加统计代码PI_COLLECT
/*------------------初始化基础数据 end-----------------------*/

/*------------------HDP初始化 start---------------------*/
HDP.init(as.AppID, as.AppKey);
weixinGetConfig();

//隐藏分享到朋友圈
hideMenuItemsTimeLink();
//隐藏微信右上角功能(默认隐藏分享到朋友圈)
// hideMenuItems([]);
//隐藏微信右上角菜单
// hideOptionMenu();

//以下初始化不需要使用可以注释掉
as.weixin   = HDP.weixin();             //微信
as.redis    = HDP.redis();              //keyvaluestore
as.func     = HDP.getFunction();        //自定义函数
as.rand     = HDP.rand();               //抽奖（旧版）
as.lottery  = HDP.getLottery();         //抽奖（新版）
as.piplus   = HDP.getPiplus();          //派加接口
as.terran   = HDP.getTerran();          //Terran接口相关
as.co       = HDP.getAppCooperation();  //协作
as.rank     = HDP.rank();               //排行榜  // kone todo  重新写一个················································ 
as.jpgCdn   = HDP.getJpgCDN();          //图片路径转换
as.wxMultimedia = HDP.wxMultimedia();   //语音
as.file     = HDP.getFile();            //上传图片
/*------------------HDP初始化 end-----------------------*/

/*------------------微信相关 start---------------------*/
//设置统计方式
as.setStatisticsType = function(){
    as.weixin.setStatisticsType(as.statisticsType);
};
as.setStatisticsType();
//设定数说统计代码
as.setDatastory = function(){
    if(as.datastory != "") as.weixin.setDatastory(as.datastory);
};
as.setDatastory();
//设定派加统计代码
as.setPiplusStaits = function(){
    //值为false时，需要在html页头部引入统计代码
    //isLoadPiplus暂时强制设置为false
    var isLoadPiplus = false;
    if(as.piplusUrl != "") as.weixin.setPiplusStaits(as.piplusUrl, isLoadPiplus);
};
as.setPiplusStaits();

//分享设置
as.setShare = function(link, title, desc, imgurl) {
    as.weixin.initShare({
        "link": (link != "") ? link : as.shareLink,
        "appMessageTitle": (title != "") ? title : as.shareTitle,
        "appMessageDesc": (desc != "") ? desc : as.shareDesc,
        "appMessageImgUrl": (imgurl != "") ? imgurl : as.shareImgUrl,
        "appMessageShareSucc": as.appSuccess,

        "timelineTitle": (desc != "") ? desc : as.shareDesc,
        "timelineImgUrl": (imgurl != "") ? imgurl : as.shareImgUrl,
        "timelineShareSucc": as.success
    });
};
as.setShare("", "", "", "");
//获取用户微信信息
as.getWxUserInfo = function(callback) {
    as.weixin.getUserInfoV2({
        "success": function(res) {
            if (res && res.nickname) {
                if (res.nickname.indexOf('"') > -1) {
                    res.nickname = res.nickname.replace(/"/g, '“');
                }
                if (res.nickname.indexOf("'") > -1) {
                    res.nickname = res.nickname.replace(/'/g, "‘");
                }
            }
            if (res && res.avatar == "") {
                res.avatar = as.defineAvatar;
            }
            if(res && res.openid){
                as.wxUserInfo = res;
                as.openid = res.openid;
            }
            
            if (typeof callback == "function") {
                callback(as.openid)
            };
        },
        "error": function(res) {
            if (typeof callback == "function") {
                callback("")
            };
        }
    });
};
//判断是否关注了公众号
as.isAttention = function(callback) {
    as.weixin.isSubscribe({
        "success": function(res) {
            as.isSubscribe = (res["subscribe"] == 1) ? true : false;
            if (typeof callback == "function")
                callback(as.isSubscribe);
        },
        "error": function(res) {
            if (typeof callback == "function")
                callback(false);
        }
    });
};
//领取卡券
as.addCard = function(cardId, openid, callback) {
    as.weixin.addCard({
        "cardId": cardId,
        "code": "",
        "openid": openid,
        "succ": function(res) {
            console.log('领取卡券成功');
            if (typeof callback == "function")
                callback(true);
        },
        "error": function(res) {
            console.log('领取卡券失败');
            if (typeof callback == "function")
                callback(false);
        }
    });
};
/*------------------微信相关 end---------------------*/

/*------------------keyvaluestore start---------------------*/
as.setRedisKeyValue = function(key, value, callback) {
    var redisOp = {
        "param": {
            "valueKey": key,
            "value": value
        },
        "success": function(res) {
            var bool = res.code == "180001";
            if (typeof callback == "function") callback(bool);
        },
        "error": function(res) {
            if (typeof callback == "function") callback(false);
        }
    };
    as.redis.set(redisOp);
};
as.getRedisKeyValue = function(key, callback) {
    var redisOp = {
        "param": {
            "valueKey": key
        },
        "success": function(res) {
            if (res.code == "181001") {
                if (typeof callback == "function") callback(res["returnMap"][key]);
            } else {
                if (typeof callback == "function") callback(null);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    };
    as.redis.get(redisOp);
};
as.getRedisList = function(key, callback){
	var redisOp = {
        "param": {
            "valueKey": key
        },
        "success": function(res) {
            if (res.code == "181001") {
                if (typeof callback == "function") callback(res["returnMap"]);
            } else {
                if (typeof callback == "function") callback(null);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    };
    as.redis.getList(redisOp);
};
/*------------------keyvaluestore end-----------------------*/

/*------------------自定义函数 start---------------------*/
//单语句查询  kone 2 getLiveUrl
as.queryFun = function(funName, data, callback) {
    as.func.runFunction(funName, {
        "param": data,
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    });
};
//插入，修改，多语句查询
as.queryFunV2 = function(funName, data, callback) {
    as.func.runFunctionV2(funName, {
        "param": data,
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    });
};
/*------------------自定义函数 end---------------------*/

/*------------------抽奖相关（新版）start---------------------*/
//读取抽奖次数
as.getUserLotteryCount = function(callback){
    as.lottery.getUserLotteryCount({
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
//抽奖
as.gameLottery = function(callback) {
    as.lottery.gameLottery({
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
//领奖
as.drawPrize = function(prizeSn, mobile, callback){
    as.lottery.drawPrize({
        "prizeSn" : prizeSn,
        "mobile"  : mobile,
        "success" : function(res){
            if (typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
//核销奖品
as.consumePrize = function(prizeSn, callback){
    as.lottery.consumePrize({
        "prizeSn" : prizeSn,
        "success" : function(res){
            if (typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
//获取用户中奖列表
as.getUserLotteryResult = function(page, size, callback){
    as.lottery.getUserLotteryResult({
        "page" : page,
        "size" : size,
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
//读取单个奖品
as.getUserLotteryResultByPrizeSn = function(prizeSn, callback){
    as.lottery.getUserLotteryResultByPrizeSn({
        "prizeSn" : prizeSn,
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
/*------------------抽奖相关（新版）end-----------------------*/

/*------------------抽奖相关（旧版）start---------------------*/
//抽奖
as.gameRand = function(callback) {
    as.rand.rand({
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({
                "result": false
            });
        }
    });
};
//获取用户中奖列表
as.getUsersPrize = function(callback){
    as.rand.getUsersPrize({
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback({"result": false});
        }
    });
};
/*------------------抽奖相关（旧版）end-----------------------*/

/*------------------协作相关 start---------------------*/
//从当前链接中获取邀请码 hdp_cooperation_id
as.getCodeFromCurrentUrl = function(callback){
    as.co.getCodeFromCurrentUrl(function(cooperationId){
        if(typeof callback == "function") callback(cooperationId);
    });
};
//根据邀请码重置分享链接
as.cooperationSetShareLink = function(resourceId, desc){
    if(resourceId != ""){
        if(as.shareLink.indexOf("?") > 0){
            var link = as.shareLink+"&hdp_cooperation_id="+resourceId;
        }else{
            var link = as.shareLink+"?hdp_cooperation_id="+resourceId;
        }
        as.setShare(link, "", desc, "");
    }
};
//生成邀请码
as.insertResourceId = function(jsonStr, callback){ 
    if (typeof(jsonStr) != 'string') {
        jsonStr = JSON.stringify(jsonStr);
    }
    as.co.uploadAppCooperationInfo({
        "param"     : {
            "jsonStr" : jsonStr
        },
        "success"   : function(res){
            if(res && res.success){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback("");
            }
        },
        "error"     : function(res){
            if(typeof callback == "function") callback("");
        }
    });
};
//生成或更新邀请码
as.saveAppCooperationInfo = function(cooperationId, jsonStr, callback){ 
    if (typeof(jsonStr) != 'string') {
        jsonStr = JSON.stringify(jsonStr);
    }
    as.co.saveAppCooperationInfo({
        "param"     : {
            "cooperationId" : cooperationId,
            "jsonStr" : jsonStr
        },
        "success"   : function(res){
            if(res && res.success){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback("");
            }
        },
        "error"     : function(res){
            if(typeof callback == "function") callback("");
        }
    });
};
//判断当前邀请码状态，分辨邀请者身份
as.checkResourceId = function(resourceId, callback){
    as.co.checkAppCooperationInfoSelfOrNot({
        "param"     : {
            "resourceId" : resourceId
        },
        "success"   : function(res){
            if(res && res.success){
                //res.content :"not exist"非邀请链接;"true"自己的分享链接;"false"他人的分享链接
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback("not exist");
            }
        },
        "error"     : function(res){
            if(typeof callback == "function") callback("not exist");
        }
    });
};
//读取用户所有邀请码
as.getResourceId = function(callback){
    as.co.queryCurrentUserAppCooperationInfoIdList({
        "success"   : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"     : function(res){
            if(typeof callback == "function") callback([]);
        }
    });
};
//读取当前邀请码信息
as.getUserInfoByResourceId = function(resourceId, callback){
    as.co.queryCurrentAppCooperationInfo({
        "param"     : {
            "resourceId" : resourceId
        },
        "success"   : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"     : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//为邀请码点赞 kone todo
as.addPraise = function(resourceId, callback){
    as.co.praise({
        "param": {
            "resourceId" : resourceId
        },
        "success": function(res){
            if(typeof callback == "function") callback(res);
        },
        "error": function(res){
            if(typeof callback == "function") callback(false);
        }
    });
};
//为邀请码点赞
as.addPraiseV2 = function(resourceId, remark, callback){
    as.co.praiseV2({
        "param": {
            "resourceId" : resourceId,
            "remark"     : remark
        },
        "success": function(res){
            if(typeof callback == "function") callback(res);
        },
        "error": function(res){
            if(typeof callback == "function") callback(false);
        }
    });
};
//读取邀请码的点赞数
as.getPraise = function(resourceId, callback) {
    as.co.getPraiseRecordTotalByResourceId({
        "param" : {
            "resourceId" : resourceId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(0);
        }
    });
};
//判断用户是否为邀请码点赞
as.checkUserPraise = function(resourceId, callback){
    as.co.checkCurrentUserPraiseOrNot({
        "param" : {
            "resourceId" : resourceId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(false);
        }
    });
};
//点赞日志
as.getPraiseLog = function(resourceId, page, size, callback){
    as.co.queryPraiseRecordListByResourceId({
        "param"   : {
            "resourceId" : resourceId,
            "page"       : page,
            "size"       : size
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"   : function(res){
            if(typeof callback == "function") callback([]);
        }
    });
};
//为邀请码评论
as.addComment = function(resourceId, content, callback){
    as.co.comment({
        "param"   : {
            "resourceId" : resourceId,
            "content"    : content,
            "parentId"   : "",
            "remark"     : ""
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"   : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//评论列表
as.queryCommentList = function(resourceId, page, size, callback){
    as.co.queryAppCooperationInfoCommentRecordList({
        "param"   : {
            "resourceId" : resourceId,
            "page"       : page,
            "size"       : size,
            "ascending"  : false
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"   : function(res){
            if(typeof callback == "function") callback([]);
        }
    });
};
//读取邀请码评论数
as.queryCommentCount = function(resourceId, callback){
	as.co.getAppCooperationInfoCommentRecordTotal({
	    "param"   : {
	        "resourceId" : resourceId
	    },
	    "success" : function(res){
	        if(typeof callback == "function") callback(res);
	    },
	    "error"   : function(res){
	        if(typeof callback == "function") callback(0);
	    }
	});
};
//当前用户对邀请码的评论总数
as.queryCommentCountByUser = function(resourceId, callback){
    as.co.getCurrentUserAppCooperationInfoCommentRecordTotal({
        "param"   : {
            "resourceId" : resourceId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error"   : function(res){
            if(typeof callback == "function") callback(0);
        }
    });
};
/*------------------协作相关 end-----------------------*/

/*------------------排行榜相关 start---------------------*/
/*
 * 提交成绩
 *  rankName  : 排行榜名字
 *  score     : 游戏分数
 *  spendTime : 游戏耗时
 */ 
as.rankSubmitScore = function(score, spendTime, callback){
    as.rank.saveRankScore({
        "param" : {
            "rankName"  : as.rankName,
            "score"     : score,
            "spendTime" : spendTime
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//查询排行榜(包含当前用户的排行记录)
as.rankQueryRankList = function(page, size, callback){
    as.rank.queryRankList({
        "param" : {
            "rankName"    : as.rankName,
            "selfInclude" : true,
            "page"        : page,
            "size"        : size
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//查询当前用户排名
as.rankQueryUserRankRecord = function(callback){
    as.rank.queryUserRankRecord({
        "param" : {
            "rankName"    : as.rankName
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//查询当前用户的记录
as.rankQueryRankHistory = function(callback){
    as.rank.queryRankHistory({
        "param" : {
            "rankName"    : as.rankName
        },
        "success" : function(res){
            console.log(res, "rankQueryUserRankRecord success");
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            console.log(res.response, "rankQueryUserRankRecord error");
            if(typeof callback == "function") callback(null);
        }
    });
};
/*------------------排行榜相关 end-----------------------*/

/*------------------派加接口相关 start---------------------*/
//读取用户积分
as.getIntegral = function(callback){
    as.piplus.readUserIntegral({
        "success" : function(res){
        	if(res && res.integral){
        		if(typeof callback == "function") callback(res.integral);
        	}else{
        		if(typeof callback == "function") callback(0);
        	}
        },
        "error" : function(res){
            if(typeof callback == "function") callback(0);
        }
    });
};
//判断当前用户是否会员
as.checkMember = function(callback){
	as.piplus.isMember({
	    "success" : function(res){
	        if(typeof callback == "function") callback(res);
	    },
	    "error" : function(res){
	        if(typeof callback == "function") callback({"isMember":false,"integral":0});
	    }
	});
};
//查询当前用户会员信息
as.readMember = function(callback){
	as.piplus.readMember({
	    "success" : function(res){
	        if(typeof callback == "function") callback(res);
	    },
	    "error" : function(res){
	        if(typeof callback == "function") callback({"status":false});
	    }
	});
};
//同步会员信息
as.commonSaveUserInfo = function(user_name, mobile, province, city, area, address, birthday, tags, callback){
    as.piplus.saveUserInfo({
        "param" : {
            "user_name" : user_name,
            "mobile"    : mobile,
            "province"  : province,
            "city"      : city,
            "area"      : area,
            "address"   : address,
            "birthday"  : birthday,
            "tags"      : tags
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"status":false});
        }
    });
};
//获取省份
as.getProvinces = function(callback) {
    as.piplus.getProvinces({
        "success": function(res) {
            if (res.http_status && res.errmsg == "success") {
                if (typeof callback == "function") callback(res.data);
            } else {
                if (typeof callback == "function") callback([]);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback([]);
        }
    });
};
//获取城市
as.getCity = function(regionId, callback) {
    as.piplus.getCity({
        "param": {
            "regionId": regionId
        },
        "success": function(res) {
            if (res.http_status && res.errmsg == "success") {
                if (typeof callback == "function") callback(res.data);
            } else {
                if (typeof callback == "function") callback([]);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback([]);
        }
    });
};
//获取区域
as.getArea = function(regionId, callback) {
    as.piplus.getCity({
        "param": {
            "regionId": regionId
        },
        "success": function(res) {
            if (res.http_status && res.errmsg == "success") {
                if (typeof callback == "function") callback(res.data);
            } else {
                if (typeof callback == "function") callback([]);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback([]);
        }
    });
};
/*------------------派加接口相关 end-----------------------*/

/*------------------Terran接口相关 start---------------------*/
//读取用户积分
as.terranUserPoints = function(callback){
    as.terran.getUserPoints({
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//判断当前用户是否会员
as.terranIsMember = function(callback){
    as.terran.isMember({
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//查询当前用户会员信息
as.terranReadMember = function(callback){
    as.terran.readMember({
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
/*------------------Terran接口相关 end-----------------------*/

/*------------------图片路径转换 start---------------------*/
as.getJpgCdnUrl = function(imgUrl, callback){
    as.jpgCdn.getJpgCDNUrl({
        "param": {
            "imgUrl" : imgUrl
        },
        "success": function(res) {
            if(res && res.success){
                if (typeof callback == "function") callback(res.content);
            }else{
               if (typeof callback == "function") callback(null); 
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    });
};
as.getCdnImg = function(imgName, callback){
    if(typeof callback == "function")
        callback(as.jpgCdn.getCDNImg(imgName));
};
as.designImg = function(imgName, height, callback){
    if(typeof callback == "function")
        callback(as.jpgCdn.designImg(imgName, height));
};
/*------------------图片路径转换 end-----------------------*/

/*------------------上传照片相关 start---------------------*/
as.uploadFile = function(file, callback){
    as.file.uploadFile(file, as.AppID, {
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
as.uploadBase64 = function(base64, callback){
    as.file.uploadBase64(base64, as.AppID, {
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
/*------------------上传照片相关 end-----------------------*/

/*------------------微信语音 start---------------------*/
//开始录音
as.startRecord = function(callback) {
    if (typeof wx != "undefined" && wx != void 0) {
        var completeFn = function(res) {
            if (res["errMsg"] == "startRecord:ok") {
                if (typeof callback == "function") callback(true);
            }
        }

        wx.startRecord({
            cancel: function() {
                alert('用户拒绝授权录音');
                if (typeof callback == "function") callback(false);
            },
            complete: completeFn,
        });
        // if (typeof callback == "function") callback(true);
    } else {
        if (typeof callback == "function") callback(false);
    }
};
//停止录音
as.stopRecord = function(callback) {
    if (typeof wx != "undefined" && wx != void 0) {
        wx.stopRecord({
            success: function(res) {
                if (typeof callback == "function") callback(res.localId);
            }
        });
    } else {
        if (typeof callback == "function") callback("");
    }
};
//上传语音到微信服务器
as.uploadVoice = function(localId, callback) {
    if (typeof wx != "undefined" && wx != void 0 && localId != "") {
        wx.uploadVoice({
            "localId": localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            "isShowProgressTips": 1, // 默认为1，显示进度提示
            "success": function(res) {
                if (typeof callback == "function") callback(res.serverId);
            }
        });
    } else {
        if (typeof callback == "function") callback("");
    }
};
//下载微信服务语音到本地
as.downloadVoice = function(serverId, callback) {
    if (typeof wx != "undefined" && wx != void 0 && serverId != "") {
        wx.downloadVoice({
            "serverId": serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            "isShowProgressTips": 1, // 默认为1，显示进度提示
            "success": function(res) {
                if (res && res.localId) {
                    if (typeof callback === "function") callback(res.localId);
                } else {
                    if (typeof callback === "function") callback("");
                }
            }
        });
    } else {
        if (typeof callback === "function") callback("");
    }
};

//保存录音
as.saveUserVoice = function(vid, serverId, callback) {
    as.wxMultimedia.record({
        "param": {
            "vId": vid,
            "serverId": serverId
        },
        "success": function(res) {
            if (res && res.code == 10000) {
                if (typeof callback == "function") callback(true);
            } else {
                if (typeof callback == "function") callback(false);
            }
        },
        "error": function(res) {
            if (typeof callback == "function") callback(false);
        }
    });
};
//读取单个录音
as.getUserVoice = function(vid, callback) {
    try {
        as.wxMultimedia.get({
            "param": {
                "vId": vid
            },
            "success": function(res) {
                if (typeof callback == "function") callback(res);
            },
            "error": function(res) {
                if (typeof callback == "function") callback(null);
            }
        });
    } catch (e) {
        if (typeof callback == "function") callback(null);
    }
};

//播放声音
as.playVoice = function(localId, voiceStatus, voiceUrl, serverId, callback) {
    if (localId != "") {
        as.playRecord(localId, function() {
            if (typeof callback == "function") callback(true, null);
        });
    } else if ((voiceStatus == "CONVERT_SUCCESS" || voiceStatus == 6) && voiceUrl != "") {
        var dom = document.getElementsByTagName("body")[0];
        var nDiv = document.createElement("div");
        nDiv.style.width = "0px";
        nDiv.style.height = "0px";
        nDiv.style.position = "absolute";
        var sound = document.createElement("audio");
        sound.src = voiceUrl;
        //sound.preload= "preload";
        //sound.src = src;
        nDiv.appendChild(sound);
        dom.appendChild(nDiv);
        sound.addEventListener("ended", function() {
            if (typeof callback === "function") callback(true, null);
        }, false);
        sound.play();
    } else if (serverId != "") {
        as.downloadVoice(serverId, function(res) {
            as.playRecord(res, function() {
                if (typeof callback == "function") callback(true, res);
            });
        });
    } else {
        if (typeof callback === "function") callback(false, null);
    }
};
//播放录音(微信)
as.playRecord = function(localId, callback) {
    if (typeof wx != "undefined" && wx != void 0 && localId != "") {
        wx.playVoice({
            localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
        });

        wx.onVoicePlayEnd({
            success: function(res) {
                if (typeof callback === "function") callback(true);
            }
        });
    } else {
        if (typeof callback === "function") callback(false);
    }
};
//停止播放录音(微信)
as.stopVoice = function(localId) {
    if (typeof wx != "undefined" && wx != void 0 && localId != "") {
        wx.stopVoice({
            localId: localId
        });
    }
};
/*------------------微信语音 end---------------------*/

/*------------------其它 start---------------------*/
/*
 * tableName 要存的表的名字 kone 1 liveUrl  {'url':'http:xxxxxxx'} 
 * data 为字典结构
 * 例如 data = {}
 *    data["key"] = value;
 */
as.saveTable = function(tableName, value, callback) {
    var table = HDP.getTable(tableName);
    for (var key in value) {
        table.set(key, value[key]);
    }
    table.save({
        "success": function(res) {
            if (typeof callback == "function") callback(res);
        },
        "error": function(res) {
            if (typeof callback == "function") callback(null);
        }
    });
};
/*------------------其它 end-----------------------*/

/*------------------ 以下为定制化接口 ---------------------*/
as.bizInterface = null;

//从当前链接中获取受助方openid
as.getRecipientIdFromCurrentUrl = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.getRecipientIdFromCurrentUrl(function(recipientId){
        if(typeof callback == "function") callback(recipientId);
    });
};
//从当前链接中获取转赠请求uuid
as.getRequestMsgIdFromCurrentUrl = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.getRequestMsgIdFromCurrentUrl(function(msgId){
        if(typeof callback == "function") callback(msgId);
    });
};
//参加集碎片活动
as.createUserFragmentInfo = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.createUserFragmentInfo({
        "param" : {},
        "success" : function(bool){
            if(typeof callback == "function") callback(bool);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(false);
        }
    });
};
//抽取碎片
as.drawFragment = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.drawFragment({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//协助抽取碎片
as.helpDrawFragment = function(recipientId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.helpDrawFragment({
        "param" : {
            "recipientId" : recipientId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//检查用户是否集齐碎片
as.checkUserComplete = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.checkUserComplete({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(false);
        }
    });
};
//查询某个用户所集碎片信息
as.queryUserFragmentInfo = function(userId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.queryUserFragmentInfo({
        "param" : {
            "userId" : userId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};
//查询碎片列表
as.queryFragmentList = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.queryFragmentDTOList({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback([]);
        }
    });
};
//兑换奖励（旧版）
as.prizeRand = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.prizeRand({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};
//兑换奖励（新版）
as.prizeLottery = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.prizeLottery({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//生成索取碎片请求信息
as.generateFragmentRequirementMsg = function(fragmentNum, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.generateFragmentRequirementMsg({
        "param" : {
            "fragmentNum" : fragmentNum
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//生成赠送碎片请求信息
as.generateFragmentPresentMsg = function(fragmentNum, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.generateFragmentPresentMsg({
        "param" : {
            "fragmentNum" : fragmentNum
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//根据请求信息赠送/领取碎片
as.transferFragment = function(msgId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.transferFragment({
        "param" : {
            "msgId" : msgId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//查询碎片请求信息详情
as.getFragmentRequestMsgDTO = function(msgId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.getFragmentRequestMsgDTO({
        "param" : {
            "msgId" : msgId
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//查询当前用户的集碎片信息
as.queryCurrentUserFragmentInfo = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }
    as.bizInterface.queryCurrentUserFragmentInfo({
        "param" : {},
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback(null);
        }
    });
};

//多奖池抽奖（旧版）
as.bizManyLottery = function(appId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    if(appId == undefined || appId == null || appId == ""){
        if(typeof callback == "function") callback({"result":false});
    }

    as.bizInterface.manyLottery({
        "param" : {
            "appId" : appId
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"result":false});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};
//多奖池抽奖（新版）
as.bizManyRand = function(lotteryAppId, prizePool, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    if(lotteryAppId == undefined || lotteryAppId == null || lotteryAppId == ""){
        if(typeof callback == "function") callback({"result":false});
    }

    as.bizInterface.manyRand({
        "param" : {
            "lotteryAppId" : lotteryAppId,
            "prizePool"    : prizePool
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"result":false});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};
//奖品码抽奖（旧版）
as.consumeNumberLottery = function(serialNumber, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    if(serialNumber == null || serialNumber == ""){
        if(typeof callback == "function") callback({"result":false});
    }

    as.bizInterface.consumeNumberLottery({
        "param" : {
            "serialNumber" : serialNumber
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                var code = "";
                if(res && res.code) code = res.code;
                if(typeof callback == "function") callback({"result":false,"code":code});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};
//奖品码抽奖（新版）
as.consumeNumberRand = function(serialNumber, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    if(serialNumber == null || serialNumber == ""){
        if(typeof callback == "function") callback({"result":false});
    }

    as.bizInterface.consumeNumberRand({
        "param" : {
            "serialNumber" : serialNumber
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                var code = "";
                if(res && res.code) code = res.code;
                if(typeof callback == "function") callback({"result":false,"code":code});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};
//发送验证码
as.ueswtSendSmsCode = function(phone, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.ueswtSendSmsCode({
        "param" : {
            "phone" : phone
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"returnstatus":"Failed"});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"returnstatus":"Failed"});
        }
    });
};
//发送普通短信
as.ueswtSendSmsMessage = function(phone, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.ueswtSendSmsMessage({
        "param"   : {
            "phone" : phone
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"returnstatus":"Faild"});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"returnstatus":"Faild"});
        }
    });
};
//kolon判断是否会员
as.kolonIsMember = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.kolonIsMember({
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false});
        }
    });
};
//果本，发送用户注册验证码
as.goobenSendSmsCode = function(mobile, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.goobenSendSmsCode({
        "param"   : {
            "mobile" : mobile
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"errmsg":"error"});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"errmsg":"error"});
        }
    });
};
//果本，判断当前用户是否注册会员
as.goobenIsMember = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.goobenIsMember({
        "param"   : {},
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"errmsg":"error"});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"errmsg":"error"});
        }
    });
};
//果本，获取当前用户会员信息
as.goobenGetMemberInfo = function(callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.goobenGetMemberInfo({
        "param"   : {},
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"errmsg":"error"});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"errmsg":"error"});
        }
    });
};
//果本，注册会员
as.goobenRegMember = function(name, mobile, captchaCode, birthday, province, provinceCode, city, cityCode, section, sectionCode, address, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.goobenRegMember({
        "param"   : {
            "name" : name,
            "mobile" : mobile,
            "captchaCode" : captchaCode,
            "birthday" : birthday,
            "province" : province,
            "provinceCode" : provinceCode,
            "city" : city,
            "cityCode" : cityCode,
            "section" : section,
            "sectionCode" : sectionCode,
            "address" : address
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                if(typeof callback == "function") callback({"errmsg":"error","errcode":-1});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"errmsg":"error","errcode":-1});
        }
    });
};
//果本，获取门店列表
as.goobenGetShop = function(provinceCode, cityCode, sectionCode, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.goobenGetShop({
        "param"   : {
            "provinceCode" : provinceCode,
            "cityCode" : cityCode,
            "sectionCode" : sectionCode
        },
        "success" : function(res){
            if(res && res.success && res.content){
                var content = res.content;
                if(content.errmsg == "success"){
                    if(typeof callback == "function") callback(content.data);
                }else{
                    if(typeof callback == "function") callback([]);
                }
            }else{
                if(typeof callback == "function") callback([]);
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback([]);
        }
    });
};
//南航，手机号抽奖
as.csairPhoneRand = function(csairAppId, sessionId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.csairPhoneRand({
        "param"   : {
            "csairAppId" : csairAppId,
            "sessionId"  : sessionId
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                var code = "";
                if(res && res.code) code = res.code;
                if(typeof callback == "function") callback({"result":false,"code":code});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false,"code":500});
        }
    });
};
//南航，获取用户中奖日志
as.csairUserResult = function(csairAppId, sessionId, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.csairUserResult({
        "param"   : {
            "csairAppId" : csairAppId,
            "sessionId"  : sessionId
        },
        "success" : function(res){
            if(res && res.success && res.content){
                if(typeof callback == "function") callback(res.content);
            }else{
                var code = "";
                if(res && res.code) code = res.code;
                if(typeof callback == "function") callback({"result":false,"code":code});
            }
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"success":false,"code":500});
        }
    });
};
//领取南航优惠券
as.csairDrawCoupon = function(sessionId, prizeSn, mobile, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.csairDrawCoupon({
        "param" : {
            "prizeSn"   : prizeSn,
            "sessionId" : sessionId,
            "mobile"    : mobile
        },
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            if(typeof callback == "function") callback({"result":false});
        }
    });
};

//南航，发送验证码
as.getCode = function(phone_number, callback) {
    var url = "https://lucky.csair.com/bluegate/marketing/validate/send";
    $.get(url, {
        "app_id" : as.AppID,
        "phone_number" : phone_number
    }, function(res){
        if(typeof callback == "function") callback(res);
    }, "json");
};
//南航，校验验证码
as.checkCode = function(phone_number, code, callback) {
    var url = "https://lucky.csair.com/bluegate/marketing/validate";
    $.get(url, {
        "app_id" : as.AppID,
        "phone_number" : phone_number,
        "code" : code
    }, function(res){
        if(typeof callback == "function") callback(res);
    }, "json");
};

//合并图片
as.mergePictures = function(fileName, width, height, imgData, fontData, callback){
    if(as.bizInterface == null){
        as.bizInterface = HDP.getBizInterface();
    }

    as.bizInterface.mergePictures({
        "param" : {
            "fileName" : fileName,
            "width"    : width,
            "height"   : height,
            "imgData"  : imgData,
            "fontData" : fontData
        },
        
        "success" : function(res){
            if(typeof callback == "function") callback(res);
        },
        "error" : function(res){
            console.log(res);
            if(typeof callback == "function") callback({"success":false});
        }
    });
};