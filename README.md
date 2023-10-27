# Paste Upload Image
使用github作为图床，为markdown文件提供图片上传到github的能力。

## 使用方法

### 配置github参数
使用本插件需要先到github获取你的Personal access tokens，该token用于提交图片到指定的仓库。
获取到token后，请先配置github提交的配置：
![](https://raw.githubusercontent.com/chens01/vscode-parse-upload-image/main/image-2.png)
配置包括github的token，仓库所有者的名称owner(github的用户名)和目标仓库名。具体可以参考github的API：https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents

### 粘贴并上传图片
复制图片或者截图后，使用快捷键：
- windows: ctrl+alt+v
- macOS: cmd+ctrl+v

插件会从剪切板获取图片并上传到github仓库，然后在文本上插入图片链接。

### 扫描并上传图片
使用该功能可以在目标markdown文件中扫描出本地的图片并上传到github，上传成功后会使用远程地址替换本地的图片地址。
使用快捷键：
- windows: ctrl+alt+u
- macOS: cmd+ctrl+u

或者菜单功能：“扫描并上传图片” 来使用功能

## 许可证
源代码和字符串使用[MIT](https://raw.githubusercontent.com/chens01/vscode-parse-upload-image/main/LICENSE.txt)许可进行授权。
