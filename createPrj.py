import os
import shutil
import codecs
import time
import re
import sys
import base

ignoreDirs = ['.git', 'bin-debug', '__pycache__', 'bin-release']
ignoreFiles = ['test.py', 'createPrj.bat', 'as大全.js', 'readme.md', 'as-api-doc.docx']

# 
tmpPrjPath = os.getcwd()
prjName = input('请输入新项目名：')
newPrjPath = '..\\' + prjName + '\\'

# 
if os.path.exists(newPrjPath):
    print('项目-' + newPrjPath + '-已经存在')
    os._exit(0)   
else:
    base.mkdir(newPrjPath)
# 
def checkIsIgnore(iLst, name):
    for item in iLst:
        if name.find(item) != -1:
            return True
    return False

# 
for path in os.listdir(tmpPrjPath):
    subPath = os.path.join(tmpPrjPath, path)
    subDestPath = os.path.join(newPrjPath, path)
    if os.path.isfile(subPath):  
        if checkIsIgnore(ignoreFiles, path):
            print('不拷贝文件：' + path)
        else :
            base.coverFile(subPath, subDestPath)
    else :    
        if path.find('public') != -1: #拷贝 public 目录
            cryFile = subPath + '\\carry.js'
            if os.path.exists(cryFile):
                base.mkdir(subDestPath)
                base.coverFile(cryFile, subDestPath + '\\carry.js')
            else:
                print('错误，缺少carry.js')
        elif path.find('css') != -1: #拷贝 css 目录
            cssFile = subPath + '\\index.css'
            if os.path.exists(cssFile):
                base.mkdir(subDestPath)
                base.coverFile(cssFile, subDestPath + '\\index.css')
            else:
                print('错误，缺少carry.js')
        elif checkIsIgnore(ignoreDirs, path):
            print('不拷贝~目录：' + path)
        else :
            base.copyFolder(subPath, subDestPath)


print('创建新项目成功')
input("Prease <enter>")
