import os
import shutil
import codecs
import time
import base  #base.py kone封装的

# ktest
import sys
import re
if len(sys.argv) == 2 and sys.argv[1] == 'test':
    # base.defaultResJson(os.getcwd() + '/resource/default.res.json', '123')

    # 
    sst = "'xxxxx.js?wfaser'"
    sst = '"sfsfsdfsdf/ss.js"'
    ver = '6666'
    sst = re.sub('(.js).+(")', '.js?' + ver + '"', sst)
    sst = re.sub("(.js).+(')", ".js?" + ver + "'", sst)
    print(sst)
    os._exit(0)   
# end of ktest ####################################

'''
kone read me:
1、指定好游戏发布的git目录 gitPath, 该git目录要先自己先 git clone 好
2、开发完运行此脚本,则会自动打包，然后拷贝新包文件到 gitPath 并提交、推送上git
3、该git有其他人改过要自己手动去同步
4、如果有app版本或其他版本，你还是建多一份 index-app.html 和 publishapp.py 吧！
'''
# 如果链接有问题就将 \  改成 /
verTag = ''  #版本标签 默认为h5版本
gitPath = 'D:/work-hudongpai/git-fac/xxxx(egret-temp-prj'   #kone todo 打包提交git所在磁盘路径
prjPath = os.getcwd()    #当前项目所在磁盘路径

curTime = time.time()
lt = time.localtime(curTime)

# 资源版本号， 图片、声音、json等
resVer = str(int(curTime))

# git 提交日志
gitLog = verTag + '-' + str(lt.tm_mon) + '月' + str(lt.tm_mday) + '日-' + str(lt.tm_hour) + ':' + str(lt.tm_min) #str(lt.tm_sec)

# step :  default.res.json 资源添加版本号 ############################################
# 不能写成： '\resource\default.res.json' , 因为 \r  会被转义
base.defaultResJson(prjPath + '/resource/default.res.json', resVer)


# step : egret 打包  ########################################################
dirPath = base.egretPublish(verTag + 'pyauto')
if dirPath == '':
    print("error : 打包失败！")
    os._exit(0)


# step : 修改index.html版本号并拷贝 index.html 到包中  ############################
filePath = prjPath + '\index.html'
if verTag != '':
    filePath = prjPath + '\index-' + verTag + '.html'
if base.checkHaLet(filePath):
    print("error : index.html 有 let")
    os._exit(0)
htmlHasDiff = base.addHtmlVer(filePath, gitPath + '\index.html', resVer)
shutil.copy(filePath, dirPath)


# step 压缩并拷贝 public/carry.js 到包中 ########################################################
filePath = prjPath + '\public\carry.js'
if base.checkHaLet(filePath):
    print("error : carry.js 有 let")
    os._exit(0)
# 
os.chdir('node')
os.system('cd')
st = os.system('gulp')
if st != 0:
    print("error : carry.js gulp 失败")
    os._exit(0)
os.chdir('..')
# 
shutil.copy(filePath, base.mkdir(dirPath + '\public'))
shutil.copy(filePath.replace('.js', '.min.js'), dirPath + '\public')


# step : 拷贝 css/index.css 到包中 ##################################################
# st = os.system('lessc --clean-css --autoprefix --source-map index.less index.css')
filePath = prjPath + '\css\index.css'
base.addCssVer(filePath, resVer)
shutil.copy(filePath, base.mkdir(dirPath + '\css'))


# step : 拷贝其他引入的文件 ##########################################################
# shutil.copy(prjPath + '\public\sarea.js', dirPath + '\public')  #拷贝其他js
# shutil.copy(prjPath + '\css\sarea.css', dirPath + '\css')   #拷贝其他css


# step : 拷贝包到对应git目录上 ########################################################
# 会覆盖文件但是不会删除旧的文件
base.copyFolder(dirPath, gitPath)


# step : 提交git #####################################################################
# kone warning 小心别覆盖了后端写的代码
if htmlHasDiff:
    print('index.html与git上的有不同的地方，请手动确认然后提交')
else:
    # base.gitPusher(gitPath, 'ver:' + gitLog)    
    print('目前注释了自动提交，请手动提交git')
