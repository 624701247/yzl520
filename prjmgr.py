# -*- coding: utf-8 -*-
import os
import codecs
import sys
import shutil
import time

import base


uiInfos = {
    # 关注二维码页面，二维码用 img标签显示，可以长按识别
    'qrcode': {        
        'tsName':'QrCodeLayer',
        'typ': 2,
        'res':['assets\\cont_qrcode.png', 'qr.png']
    },
    # 登录页面，输入手机号 --》 发送校验码 --》 输入校验码 --》 请求登录
    'login': {
        'tsName':'LoginLayer',
        'typ': 2,
        'res':[]
    },
    # 实物奖品页面，实物奖品领奖表单信息提交成功页面
    'swprize': {
        'tsName':'SwPrizeLayer',
        'typ': 2,
        'res':['assets\\btn_commit.png', 'assets\\btn_pc.png', 'assets\\btn_pok.png', 'assets\\cont_inp.png', 'assets\\cont_mp.png', 'assets\\cont_succ.png']
    },
    # 活动规则页面
    'rule': {
        'isDefNeed':True,
        'tsName':'RuleLayer',
        'typ': 2,
        'res':['assets\\cont_rule.png']
    },

    # 合成海报页面
    'poster': {
        'tsName':'PosterLayer',
        'typ': 1,
        'res':[]
    }
}


# 删除ui模板
def delTmpUi(key):
    if (key in uiInfos.keys()) == False:
        print('没有该ui模板:' + key)
        return False
    uiInfo = uiInfos[key]
    tsName = uiInfo['tsName']
    res = uiInfo['res']
    if base.delFileOrDir('src\\' + tsName + '.ts'):
        print('删除 ' + tsName + '.ts 成功')
    if base.delFileOrDir('resource\\skins\\' + tsName + 'Skin.exml'):
        print('删除 ' + tsName + 'Skin.exml 成功')
    for item in res:
        base.delFileOrDir('resource\\' + item)
    base.editDelUiMgr(tsName)
    print('删除ui模板成功：' + key + '。请留意 wing提示的资源变动')
    return True

#添加uim模板
def addTmpUi(key):
    if (key in uiInfos.keys()) == False:
        print('没有该ui模板:' + key)
        return False
    uiInfo = uiInfos[key]
    tsName = uiInfo['tsName']
    typ = uiInfo['typ']
    res = uiInfo['res']
    fbPath = '..\\egret-temp-prj'
    if os.path.exists(fbPath) == False:
        print('请先 clone 模板项目 egret-temp-prj 到与项目同一级目录')
        return False
    tsFb = fbPath + '\\src\\' + tsName + '.ts'
    exmlFb = fbPath + '\\resource\\skins\\' + tsName + 'Skin.exml'
    if os.path.exists('src\\' + tsName + '.ts'):
        print('已经存在文件：' + tsName)
        return False
    if os.path.exists('resource\\skins\\' + tsName + 'Skin.exml'):
        print('已经存在布局文件：' + tsName + 'Skin.exml')
        return False
    if os.path.exists(tsFb) == False:
        print('不存在模板文件：' + tsFb)
        return False
    if os.path.exists(exmlFb) == False:
        print('不存在模板文件：' + exmlFb)
        return False
    shutil.copy(tsFb, 'src')
    shutil.copy(exmlFb, 'resource\\skins')
    # 
    for item in res:
        resPath = fbPath + '\\resource\\' + item
        if os.path.exists('resource\\' + item):
            print('项目中已经存在：' + item)
        elif os.path.exists(fbPath):
            shutil.copy(resPath, 'resource\\' + item)
            print('拷贝资源成功：' + item)
        else :
            print('不存在资源：'+ resPath)
    base.editAddUiMgr(tsName, typ)
    print('添加ui模板成功：' + tsName + '。请留意 wing提示的资源变动')
    return True


# 
def addMyUi(arg, typ):
    sid = ''
    # 
    if typ == 3 :
        tsName = arg + ''
    else:
        sid = arg.lower() 
        tsName = arg + 'Layer'
    tsPath = 'src/' + tsName + '.ts' # .ts  脚本路径
    # 
    exmlName = tsName + 'Skin'   # .exml  布局文件名字
    exmlPath = 'resource/skins/' + exmlName + '.exml'  # .exml  布局文件路径   
    # 
    if (sid in uiInfos.keys()) == True:
        print('ui模板中已经有了：' + sid)
        return False
    # 
    if os.path.exists(tsPath):
        print(tsName + " 已经存在")
        return False
    # 
    if os.path.exists(exmlPath):
        print(exmlName + "已经存在")
        return False
    # 
    if typ == 1:
        base.createFile( tsPath, base.createSceneCont(tsName) )
    elif typ == 2:
        base.createFile( tsPath, base.createDlgCont(tsName) )
    elif typ == 3:
        base.createFile( tsPath, base.createComCont(tsName) )
    else:
        print('typ 不对：' + typ)
        return False
    print('创建成功：' + tsName)
    # 
    base.createFile( exmlPath, base.createExmlCont(exmlName) )
    print('创建成功：' + exmlName)
    # 
    if sid != '':
        base.editAddUiMgr(tsName, typ)
        print('修改 UiMgr.ts成功：' + sid)
    return True

# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 2 and sys.argv[1] == 'init':
    print('项目初始化')
    base.editLaunch('.wing\\launch.json')  
    isConfirm = input('确定删除所有非默认的ui模板？请输入yes:')
    if isConfirm == 'yes':
        for key in uiInfos:
            if ('isDefNeed' in uiInfos[key].keys()) == False:
                delTmpUi(key)
    else :
        print('初始化取消')
    os._exit(0)  


# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'deltmp':
    print('删除ui模板，参数2为对应的 SceneId 或者 DlgId 名字')
    delTmpUi(sys.argv[2])
    os._exit(0)  


# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'addtmp':
    print('添加ui模板')
    addTmpUi(sys.argv[2])
    os._exit(0)  
    

# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'scene':
    print('添加 Scene ')
    addMyUi(sys.argv[2], 1)
    os._exit(0)  
    

# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'dlg':
    print('添加 Dlg ')
    addMyUi(sys.argv[2], 2)
    os._exit(0)  


# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'com':
    print('添加 eui.Component 派生类 ')
    addMyUi(sys.argv[2], 3)
    os._exit(0) 


# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 3 and sys.argv[1] == 'del':
    print('删除ui类，参数2为ts名字')   
    tsName = sys.argv[2]
    base.editDelUiMgr(tsName)
    # 
    if base.delFileOrDir('src\\' + tsName + '.ts'):
        print('删除 ' + tsName + '.ts 成功')
    if base.delFileOrDir('resource\\skins\\' + tsName + 'Skin.exml'):
        print('删除 ' + tsName + 'Skin.exml 成功')
    

    
# # # # # # # # # # # # # # # # # # # # # 
if len(sys.argv) == 2 and sys.argv[1] == 'test':
    print('给你测试玩的~')
    os._exit(0)  