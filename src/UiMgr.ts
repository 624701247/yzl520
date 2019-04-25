// 添加ui推荐使用 python addui.py
//  尽量不要手动修改此文件
namespace pgame {
export const enum SceneId { 
    poster,
    selobj,
    home,    //首页
    game
} 
export const enum DlgId {
    prod,
    win52,
    box520,
    boxjx,
    zdy,
    ghwz,
    shopdesc,
    couponprize,
    lose,
    swprize,
    myprize, //我的奖品
    share, //分享
    rule //规则
}

class UiMgr extends BaseUiMgr {
    constructor() {
        super()
    }
    public createScene(sceneId:SceneId, parm):Scene {
        let ui;
        switch(sceneId) {
            case SceneId.poster:
                ui = new PosterLayer(parm)
                break
            case SceneId.selobj:
                ui = new SelObjLayer()
                break
            case SceneId.game:
                ui = new GameLayer()
                break

            case SceneId.home:
                ui = new HomeLayer()
                break

            default:
                break
        }
        return ui
    }
    public createDlg(dlgId:DlgId, parm):Dlg {
        let ui:Dlg;
        switch(dlgId) {
            case DlgId.prod:
                ui = new ProdLayer(parm)
                break
            case DlgId.win52:
                ui = new Win52Layer(parm)
                break
            case DlgId.box520:
                ui = new BoxLayer(true)
                break
            case DlgId.boxjx:
                ui = new BoxLayer(false)
                break
            case DlgId.zdy:
                ui = new ZdyLayer()
                break
            case DlgId.ghwz:
                ui = new GhwzLayer()
                break
            case DlgId.shopdesc:
                ui = new ShopDescLayer()
                break
            case DlgId.couponprize:
                ui = new CouponPrizeLayer(parm)
                break
            case DlgId.lose:
                ui = new LoseLayer()
                break
            case DlgId.swprize:
                ui = new SwPrizeLayer(parm)
                break
            case DlgId.rule:
                ui = new RuleLayer()
                break

            case DlgId.share:
                ui = new ShareLayer()
                break

            case DlgId.myprize:
                ui = new MyPrizeLayer()
                break

            default:
                break
        }
        return ui
    }
}
export var uiMgr = new UiMgr()
}
