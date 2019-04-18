
namespace pgame {
export class SelObjLayer extends Scene {
    private objGp:eui.Group

    constructor() {
        super(SelObjLayerSkin)

        for(let idx = 0; idx < this.objGp.numChildren; idx++) {
            var btn = this.objGp.getChildAt(idx)
            jinx.addTapEvent(btn, function() {
                this.ontapObj(idx)
            }, this)
        }
    }

    private ontapObj(id) {
        console.log(id, 'ss')

        goPoster({
            isMe: true,
            oldUrl: ''
        })
    }
}   //end of class
}   //end of module
