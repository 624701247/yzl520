
namespace pgame {

const objArr = ['长辈', '朋友', '孩子', '自己', '爱人']

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
            oldUrl: '',
            obj: objArr[id],
            txt: '11111111111111\n2222222222222\n333333333333\n4444444444444444\n55555' //ktest
        })
    }
}   //end of class
}   //end of module
