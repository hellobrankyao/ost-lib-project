# OstUtils

ost 开放集成单元，学习积累使用

# 集成与使用

### 第一步

```base
// 安装包
npm i ost-utils
```

### 第二步

找到宿主工程 angular.json

```json
styles:[
    "node_modules/webuploader/dist/webuploader.css"
]
```

```json
scripts:[
    "node_modules/jquery/dist/jquery.js",
    "node_modules/webuploader/dist/webuploader.js"
]
```

### 第三步

在 app.module.ts 中导入 OstUtilsModule 并且在 providers 中注入自己的配置服务

```json
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    OstUtilsModule
  ],
  providers: [
  { provide: UploaderService, useClass: YouerSelfServic }
  ],
  bootstrap: [AppComponent]
})
```

# 图标上传

在 html 中使用

```html
<ost-uploader></ost-uploader>
```

### 参数说明  

| 名称       |            类型 |              作用               |                          备注 |
| ---------- | --------------: | :-----------------------------: | ----------------------------: |
| options    | UploaderOptions |        配置 webupLoader         |                具体见官网配置 |
| display    | UpLoaderDisplay |    显示列表还是表格两种效果     |
| maxFileNum |          number |      控制上传文件最大数量       |
| type       |        FileType |            文件类型             | IMGAE = 'imgae',FILE = 'file' |
| fileQueued |       OstFile[] |            文件队列             |
| readonly   |         boolean | 作为浏览时只读属性 不可上传操作 |
| isComplete |         boolean |  当有文件进行上传中时为 false   |

###  效果展示

#### gird
![](https://raw.githubusercontent.com/hellobrankyao/img/master/ost_utils_uploader_grids.png)

#### list
 
![](https://raw.githubusercontent.com/hellobrankyao/img/master/ost_utils_uploader_list.png)
