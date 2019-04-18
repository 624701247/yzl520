// TypeScript file
// 这个脚本用来研究 typescript 语法的

// module X {} 相当于现在推荐的写法 namespace X {}
namespace tetsSyntax {
    //两种写法： 声明strAry为一个数组并且数组元素必须是string类型
    let strAry1:string[] 
    let strAry2: Array<string>    

    // 元组
    let x: [string, number];


    // 遍历
    let someArray = [1, "string", false];
    for (let value of someArray) {
        console.log(value); // 1, "string", false
    }
    for (let key in someArray) {
        console.log(key); // "0", "1", "2",
    }


    
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }
    var mySearch:SearchFunc = function(source: string, subString: string) {        
        return true
    }

    // 
    export class Food {
        public pub //
        protected por  //protected 成员在派生类中仍然可以访问,但是不能再类的外部使用
        private pri 

        constructor() {   
        }

        private sc(source: string, subString: string) {
            return true
        }
    }

    enum SiD {
        A,
        B,
        C
    }   

    abstract class A {
        constructor() {
            console.log('cccc A')
        }
        public cc = 1

        public con() {
            console.log('asdf')
        }

        abstract setc(val):void;
    }

    class AA extends A {
        constructor() {super()}
        public setc(v) {
            this.cc = v
            this.con()
        }
    }

    var aaaa = new AA()
    aaaa.setc(2323)
}   