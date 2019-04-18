
var gulp = require('gulp');//gulp自身  
var uglify= require('gulp-uglify');//引入压缩组件
var concat = require('gulp-concat');//引入合并组建
var stripDebug = require('gulp-strip-debug');
  
var paths = {  
    scripts:[
    	'../public/carry.js',
    ]  
} //定义要操作的文件路径  
  
  
gulp.task('default', function() {   
  gulp.src(paths.scripts)//找到项目下paths变量所定义的script文件  
  .pipe(uglify())//压缩  
  .pipe(stripDebug()) //删除 console.log \ console.error  \ console.warn 
  .pipe(concat('carry.min.js'))//输入到main.min.js中  
  .pipe(gulp.dest('../public'));//指定目录  
}); 

/*
read me: 
gulp 压缩es6 是有问题的，
所有，carry.js 不要出现  let \     var str = `sssssss`   等es6的东西
*/ 