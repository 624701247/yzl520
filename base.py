import os
import shutil
import codecs
import time
import re

# 通用基础方法 ##################################################
# 获取文件的创建时间戳
def getCreateTime(filePath):
    timestamp = os.path.getmtime(filePath)
    return int(timestamp)

    
#创建utf-8格式文件
def createFile(fileName, cont):
    isExist = os.path.exists(fileName)
    if isExist:
        print(str(isExist) + " 文件已经存在")
        return
    else:
        p = codecs.open(fileName, 'w', 'utf-8')
        p.write(cont)
        p.close()


#创建目录结构
def mkdir(path):
    isExists = os.path.exists(path)
    if not isExists:
        os.makedirs(path) 
    return path


#拷贝或覆盖文件夹
def copyFolder(srcPath, destPath):
    mkdir(destPath)
    for path in os.listdir(srcPath):
        subSrcPath = os.path.join(srcPath, path)
        subDestPath = os.path.join(destPath, path)
        if os.path.isfile(subSrcPath):  
            coverFile(subSrcPath, subDestPath)
        else:
            if os.path.exists(subDestPath):    #删除子目录
                shutil.rmtree(subDestPath)
            copyFolder(subSrcPath, subDestPath)


# 删除文件获取目录
def delFileOrDir(filePath):
    if os.path.exists(filePath):
        if os.path.isfile(filePath):  
            os.remove(filePath)
        else :
            shutil.rmtree(filePath)
        return True
    else:
        return False


#拷贝或覆盖单个文件
def coverFile(srcFilePath, destFliePath):
    if os.path.exists(destFliePath):
        os.remove(destFliePath)
    shutil.copy(srcFilePath, destFliePath)


#检测脚本是否用了  let  
def checkHaLet(srcFile):
     with open(srcFile,"r", encoding='utf-8') as file:
        for line in file.readlines():
            if line.find('let') != -1:
                return True
        return False

# end of 通用基础方法 ##################################################


# publish.py 打包发布相关 ##################################################
# 打包egret
# param ver : 打包版本号
# return 打出来的包路径
def egretPublish(ver):
    curPath = os.getcwd()
    binPath = curPath + '\\bin-release\\web\\' + ver
    if os.path.exists(binPath):
        shutil.rmtree(binPath)
    st = os.system('egret publish --version ' + ver)
    if st == 0:
        # print('打包成功：' + binPath)
        return binPath
    else :
        # print('error: 打包失败！')
        return ''


# 给index.html 添加版本号
def addHtmlVer(srcFile, targetFile, newVer):
    newVer = str(newVer)

    oldContAry = []
    oldContLen = 0
    isExistsOld = os.path.exists(targetFile)
    if isExistsOld:
        with open(targetFile,"r", encoding='utf-8') as oldFile:
            oldContAry = oldFile.readlines()
            oldContLen = len(oldContAry)
            
    # 
    content = ''
    hasDiff = False
    with open(srcFile,"r", encoding='utf-8') as file:
        count = 0
        for line in file.readlines():
            if line.find('var BIN_VER') != -1:
                content += '    var BIN_VER = ' + newVer + '\n'
            elif line.find('css/index.css') != -1:
                content += '<link rel="stylesheet" type="text/css" href="css/index.css?' + newVer + '" />\n'
            elif line.find('var asUrl') != -1:
                sst = re.sub('(\.js).+(")', '.js?' + newVer + '"', line)
                sst = re.sub("(\.js).+(')", ".js?" + newVer + "'", sst)
                content += sst
            else :
                content += line
                if hasDiff == False and isExistsOld:
                    if oldContLen <= count:
                        print('行数不同')
                        hasDiff = True
                    elif oldContAry[count] != line:
                        hasDiff = True
            count = count + 1
    file.close()
    # 
    outfile = open(srcFile, "w+", encoding='utf-8')
    outfile.write(content) 
    outfile.close()
    return hasDiff


# 给css文件中图片资源添加版本号
def rep(fix, sst, ver):
    nst = '.' + fix + '?' + str(ver)
    p1 = r'(\.' + fix + ').+("\))'
    if re.search(p1, sst) != None:
        return re.sub(p1, nst + '")', sst)
    # 
    p2 = r"(\." + fix + ").+('\))"
    if re.search(p2, sst) != None:
        return re.sub(p2, nst + "')", sst)
    # 
    p3 = r"(\." + fix + ").+(\))"
    if re.search(p3, sst) != None:
        return re.sub(p3, nst + ")", sst)
#
def addCssVer(srcFile, newVer):
    newVer = str(newVer)
    content = ''
    with open(srcFile,"r", encoding='utf-8') as file:
        for line in file.readlines():
            if line.find('.png') > 0:
                line = rep('png', line, newVer)
            if line.find('.jpg') > 0:
                line = rep('jpg', line, newVer)
            content += line
    file.close()
    # 
    outfile = open(srcFile, "w+", encoding='utf-8')
    outfile.write(content) 
    outfile.close()



# default.res.json 资源添加版本号
def defaultResJson(tarFile, newVer):
    cont = ''
    with open(tarFile, "r", encoding='utf-8') as file:
        for line in file.readlines():
            if line.find('"url"') != -1:
                hasDh = line.find(',') != -1 #是否有逗号
                wlen = 4
                pos = line.find('.png')
                if pos == -1:
                    pos = line.find('.jpg')
                if pos == -1:
                    pos = line.find('.mp3')
                if pos == -1:
                    pos = line.find('.json')
                    wlen = 5
                if pos == -1:
                    cont += line    
                else:
                    curVer = newVer
                    if line.find('"assets') != -1: # assets目录下文件版本号用文件的创建时间，其他目录下的用统一版本号
                        u1 = re.findall('"assets(.+?)\?', line)
                        u2 = re.findall('"assets(.+?)\"', line)
                        url = ''
                        if len(u1) == 1:
                            url = u1[0]
                        elif len(u2) == 1:
                            url =  u2[0]
                        curVer = getCreateTime('resource/assets' + url)
                    # 
                    newl = line[0:pos + wlen] + '?' + str(curVer)
                    if hasDh:
                        newl +=  '",\n'
                    else:
                        newl +=  '"\n'
                    cont += newl
            else:
                cont += line
    file.close()
    with open(tarFile,"w",encoding="utf-8") as changeFile:
        changeFile.write(cont)
    changeFile.close()
    

# git提交并推送
def gitPusher(path, log):
    isSucc = os.chdir(path)
    os.system('git add .')
    os.system('git commit -m ' + log)
    os.system('git push')
    print('git提交成功')

# end of : publish.py 打包发布相关 ##################################################


# ui模板管理相关 ##################################################
# 修改 launch.json 中的本地服务器端口
def editLaunch(tarFile):
    cont = ''
    # curTime = time.time()
    # lt = time.localtime(curTime)
    newPort = '1130' #str(lt.tm_mon) + str(lt.tm_mday)
    with open(tarFile, "r", encoding='utf-8') as file:    
        for line in file.readlines():
            if line.find('"port"') != -1:
                cont += '           "port":' + newPort + '\n'
            else :
                cont += line
    file.close()
    # 
    with open(tarFile,"w",encoding="utf-8") as changeFile:
        changeFile.write(cont)
    changeFile.close()


# 编辑 UiMgr.ts 加上相应的代码段
#param tsName: ts文件名
def editAddUiMgr(tsName, typ):
    mgrFile = 'src/UiMgr.ts'
    sid = tsName.replace('Layer', '').lower()
    swStr = ''
    caseCont = ''
    enumStr = ''
    if typ == 1:
        enumStr = 'enum SceneId'
        swStr = 'switch(sceneId)'
        caseCont = '            case SceneId.' + sid + ':\n'
    elif typ == 2:
        enumStr = 'enum DlgId'
        swStr = 'switch(dlgId)'
        caseCont = '            case DlgId.' + sid + ':\n'
    # 
    caseCont += '                ui = new ' + tsName + '()\n'
    caseCont += '                break\n'
    # 
    cont = ''
    with open(mgrFile, "r", encoding='utf-8') as file:
        for line in file.readlines(): #添加相应的 enum 类型
            if line.find(enumStr) != -1:
                cont += line + '    ' + sid + ',\n'
            elif line.find(swStr) != -1: #添加相应的 case 语句
                cont += line
                cont += caseCont
            else:
                cont += line
    file.close()
    #  从写文件内容
    with open(mgrFile, "w", encoding="utf-8") as changeFile:
        changeFile.write(cont)
    changeFile.close()


# 编辑 UiMgr.ts 删除相应的代码段
#param tsName: ts文件名
def editDelUiMgr(tsName):
    mgrFile = 'src/UiMgr.ts'
    sid = tsName.replace('Layer', '').lower()
    swStr = ''
    enumStr = ''
    inEnum = True
    inCase = False
    # 
    cont = ''
    with open(mgrFile, "r", encoding='utf-8') as file:
        for line in file.readlines():
            if inEnum == True:
                if line.find(sid) != -1 :
                    inEnum = False
                    print('删除 enum 内部的：' + line)
                elif line.find('UiMgr') != -1 :
                    print('UiMgr.ts 没有对应代码块：' + sid)
                    return False
                else:
                    cont += line
            elif line.find('case') != -1 and line.find(sid) != -1 :  
                inCase = True
                print('删除 case 语句：' + line)
            elif inCase == True:
                if line.find('case') != -1 :
                    inCase = False
                    cont += line
                else :
                    print('删除 case 语句：' + line)
            else :
                cont += line
    file.close()
    #  从写文件内容
    with open(mgrFile, "w", encoding="utf-8") as changeFile:
        changeFile.write(cont)
    changeFile.close()
    return True


# 创建继承至 Scene 的类内容
def createSceneCont(clsName):
    str = ''
    str += '\n'
    str += 'namespace pgame {\n'
    str += 'export class ' + clsName + ' extends Scene {\n'
    str += '    constructor() {\n'
    str += '        super(' + clsName + 'Skin' + ')\n'
    str += '    }\n'
    str += '}   //end of class\n'
    str += '}   //end of module\n'
    return str


# 创建继承至 Dlg 的类内容
def createDlgCont(clsName):
    str = ''
    str += '\n'
    str += 'namespace pgame {\n'
    str += 'export class ' + clsName + ' extends Dlg {\n'
    str += '    private closeBtn:eui.Button\n'
    str += '    constructor() {\n'
    str += '        super(' + clsName + 'Skin)\n\n'
    str += '        this.closeBtn && jinx.addTapEvent(this.closeBtn, this.ontapClose, this)\n'
    str += '    }\n'
    str += '}   //end of class\n'
    str += '}   //end of module\n'
    return str

# 创建 普通 Component 内容
def createComCont(clsName):
    str = ''
    str += '\n'
    str += 'namespace pgame {\n'
    str += 'export class ' + clsName + ' extends eui.Component {\n'
    str += '    constructor() {\n'
    str += '        super()\n'
    str += '        this.skinName = ' + clsName + 'Skin\n\n'
    str += '    }\n'

    str += '}   //end of class\n'
    str += '}   //end of module\n'
    return str


# 创建 exml布局文件内容
def createExmlCont(skinName):
    str = ''
    str += '<?xml version="1.0" encoding="utf-8"?>\n'
    str += '<e:Skin class="' + skinName + '" width="750" height="1206" xmlns:e="http://ns.egret.com/eui">\n'
    str += '</e:Skin>\n'
    return str


# end of :ui模板管理相关 ##################################################