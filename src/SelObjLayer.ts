
namespace pgame {

export const objArr = ['长辈', '朋友', '孩子', '自己', '爱人']
export const txtArr = {
'长辈': [
`知道我为什么
称呼你为“您”么？
因为你在我心上~`,

`如果说我是魔鬼，
那我一定是爱您的淘气鬼！`
],
'朋友': [
`我知道你心目中
best friend前三位是谁！
我呀我呀我呀~`,

`最近有谣言说
你是我最好的死党，
我要澄清一下，
那不是谣言。`
],
'孩子': [
`真想咬你一口，
尝尝看你是什么做的，
这么可爱！`,

`不管外面是什么天，
你笑了，
就是晴天！`
],
'自己': [
`你猜我现在在干嘛？
没错，
在跟全世界最棒的自己表白！`,

`发现了吗？
这些日子你变了……
变得越来越喜欢自己啦！`
],
'爱人': [
`掐指一算，你命里缺我
不好意思咯，
这辈子请多多指教~`,

`请坐稳扶好，
因为接下来
你就要被我宠上天！`
]
}


// export var curPosterInfo.obj = ''
// export var curPosterInfo.txt = ''
export var curPosterInfo: {obj:string; txt:string;} = {
    // id: 0,
    obj:'',
    txt:''
}

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

        var cid = id - 1
        curPosterInfo.obj = objArr[ cid ]
        curPosterInfo.txt = txtArr[ curPosterInfo.obj ][0]

        goPoster({
            isMe: true,
            oldUrl: ''
        })
    }
}   //end of class
}   //end of module
