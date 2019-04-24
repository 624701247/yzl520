// TypeScript file
declare namespace as {
    export function isAsReady():boolean;


    /* 微信相关 ************************************************************************/    
    export namespace wxUserInfo  {
        export const avatar: string;
        export const nickname: string;
        export const openid: string;
        export const country: string;
        export const province: string;
        export const city: string;
        export const sex: string;
        export const subscribe: string;
    }
    // export const isSubscribe:boolean; //是否订阅
    /* end of */


    /* 其他 活动相关 ****************************************************************************/ 
    // export namespace action {
    //     export const saveGameStart:string;
    // }
    // export const IsShowReward:boolean; //是否直接打开我的奖品界面
    // export function statistics(cmd:string);//打点统计调用
    // export const remainGameCount:number; //剩余游戏次数
    // export function saveGameStart():void; //开始游戏调用，扣减次数，积分等
    // export const isStart:boolean; //活动是否开始
    // export const isEnd:boolean;   //活动是否结束
    /* end of */



    /* 积分相关 *********************************************************************************/ 
    // export namespace action {
    //     export const doExchange:string;
    // }
    // export const point:number; //当前积分
    // export function doExchange():void; //积分兑换
    /* end of */



    /* 登录注册 ********************************************************************************/
    // export namespace action {
    //     export const getCode:string;
    //     export const login:string;
    //     export const reg:string;
    // }
    // export const isLogin:boolean; //是否登录
    // export const isReg:boolean;//是否注册了会员
    // export function getCode(tel:string):void; //获取验证码
    // export function login(tel:string, code:string):void; //登录
    // export function reg(tel:string, code:string):void; //注册
    /* end of */


    
    /* 分享协作 ****************************************************************************/
    export interface ShareRecord {//助力列表
        headImg:string; 
        nickname:string;
        description:string;
    }
    export const shareRecords:ShareRecord[]
    interface ShareInfo { // 协作信息
        shareId:string; //协作id
        posterUrl:string; //生成的海报链接
        count5:number;    //反复集齐， 反复抽
        count2:number; 
        count0:number;
    }
    export const myShare:ShareInfo; //我的协作信息
    export const otherShare:ShareInfo;  //点开好友的协作信息
    export function assHe():void; //为TA助力
    /* end of */

    
    /*动态生成二维码 **************************************************************************/ 
    export function getMyQrDataurl():string; // 获取我的二维码base64
    /* end of */ 


    /* 抽奖相关 ********************************************************************************/ 
    export namespace action {
        export const gameLottery:string;
        export const saveLotteryInfo: string;
    }
    export const remainLoCount:number; //剩余抽奖次数
    // 奖品类型
    export namespace PrizeType {
        export const sw:string;
        export const coupon:string;
    }
    export interface PrizeInfo {
        prizeName:string;
        prizeSn:string;
        prizeId:string;
        // 领奖信息
        name:string;
        phone:string;
        area:string; //地区   广东省/广州市/天河区   北京/-/- 
        address:string;
    }
    export const myPrizes:PrizeInfo[] //我的奖品列表
    export function gameLottery():void; //抽奖
    //提交领奖表单信息
    export function saveLotteryInfo(pinfo:PrizeInfo, name:string, phone:string, area:string, addr:string):void; 
    
    // 获取某项目奖品对应的 图片资源、奖品类型 等等
    export function getPrizeResInfo(pinfo:PrizeInfo):{resName:string; prizeType:string;}
    /* end of */


    /* 上传照片 ****************************************************************************/
    export namespace action {
        export const uploadBase64:string;
    }
    export function uploadBase64(dataurl:string):void;// 提交海报base64字符串
    /* end of */

    // 领取卡券跳转
    export function getCoupon():void;


    export function getRemainLot():number;
    export function getMMCount():{remain5:number; remain2:number; remain0: number;}


    export namespace action {
        export const winMM:string;
    }
    export function winMM():void;
}
