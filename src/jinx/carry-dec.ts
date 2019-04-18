// TypeScript file
declare namespace carry {
    export function setRem(isFixHei?:boolean):void;

    // utils
    export const isWx:boolean
    export const isIos:boolean
    export const urlParam: any
    export function randomInt(min:number, max:number):number;
    export const isDemo:boolean
    export const isLocal:boolean
    export const isApp :boolean
    export function clog(txt:any):void;
    export function checkIsTel(tel:string):boolean;
    export function getNumByStr(str:string):number;

    // event 
    export function dispEvent(action:string, data?:any):void;
    export function once(action:string, func:Function, that):void;
    export function addListener(action:string, func:Function, that):void;
    export function removeListener(action:string):void;


    // dom & css
    export function addClass(elId:any, cls:string):void;
    export function removeClass(elId:any, cls:string):void;
    export function initEm(el, cw_em?:number):void;
    export function weakHint(desc:string, waitTime?:number):void;

    // 菊花
    export namespace spinner {
        export function show():void;
        export function hide():void;
    }

    // bgm
    export namespace bgm {
        export function init(isCheck?:boolean):void;
        export function getIsPlay():void;
        export function ctrl(isPlay?:boolean, playTime?:number):void;
        export function onGetIsPlay(func:Function):void;
    }

    // slide
    // export namespace slide {
    //     export function init():void;
    //     export function addUpEvent(func:Function, that):void;
    //     export function addDownEvent(func:Function, that):void;
    //     export function addLeftEvent(func:Function, that):void;
    //     export function addRightEvent(func:Function, that):void;
    // }

    // shake
    // export namespace shake {
    //     export function turnon():void;
    //     export function turnoff():void;
    //     export function addTriggerEvent(func:Function, that):void;
    // }

    // 
    // export function RingProgress(canvas):any;
    export function loadImg(url:string, cbFun:Function, that):void;

    // mgr index
    export var SGameIsOk:boolean;
}
