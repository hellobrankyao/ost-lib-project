import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, EventEmitter, Input, NgZone, Output, ViewChild
} from '@angular/core';
import { UploaderService } from './uploader.service';
import { Event, File as OstFile, OptionsAccept, OstUploader, State, Uploader, UploaderOptions } from './webuploader.wrapper';

declare const WebUploader: OstUploader;
@Component({
  selector: 'ost-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaderComponent implements AfterViewInit {
  @ViewChild('filePicker', { static: false }) filePick: ElementRef;
  // 文件上传选项
  @Input() options: UploaderOptions = defaultOptions;
  // 文件显示选项
  @Input() display: UpLoaderDisplay = UpLoaderDisplay.GRID;
  // 最大文件数
  @Input() maxFileNum = 5;
  // 文件类型
  @Input() type: FileType = FileType.FILE;
  // 文件队列
  @Input() fileQueued: OstFile[] = [];
  // 只读模式
  @Input() readonly = false;
  // 是否完成
  @Input() isComplete = false;

  @Output() isCompleteChange = new EventEmitter<any>();
  // 全文件部上传完成
  @Output() uploadFinished = new EventEmitter<any>();
  // 文件上传完成
  @Output() uploadSuccess = new EventEmitter<any>();


  // 组件上传状态
  UpLoaderDisplay: typeof UpLoaderDisplay = UpLoaderDisplay;
  // 文件状态
  State: typeof State = State;
  // 文件上传对象
  uploader: Uploader;

  constructor(public cd: ChangeDetectorRef, public upSer: UploaderService, public zone: NgZone) { }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initOptions();
      this.initEvent();
    }, 200);
  }

  /**
   * 初始化配置
   */
  initOptions() {
    // 获取上传地址
    this.options.server = this.upSer.getService();
    // 最大文件上传数
    this.options.fileNumLimit = this.maxFileNum;
    // 适配按钮
    this.options.pick = {
      id: this.filePick.nativeElement
    };
    // 获取文件限制
    this.options.accept = FileTypeTransform(this.type);
    // 创建上传对象
    this.uploader = WebUploader.create(this.options);
  }

  /**
   * 初始化上传事件
   */
  initEvent() {
    // 准备上传
    this.uploader.on(Event.uploadBeforeSend, this.onUploadBeforeSend);
    // 文件加入堆
    this.uploader.on(Event.fileQueued, this.onFileQueuedChange);
    // 文本上传进度
    this.uploader.on(Event.uploadProgress, this.onUploadProgress);
    // 上传成功
    this.uploader.on(Event.uploadSuccess, this.onUploadSuccess);
    // 全部上传完成
    this.uploader.on(Event.uploadFinished, this.onUploadFinished);
    // 上传错误
    this.uploader.on(Event.uploadError, this.onUploadError);
    // 强制刷新
    this.cd.markForCheck();
  }



  /**
   * 初始化文件
   */
  initFile(file: OstFile) {
    file.src = '../../assets/images/uploader/file.png';
    file.state = State.queued;
    file.progress = 0;
    if (file.type.split('/')[0] === 'image') {
      // 获取原图
      this.uploader.makeThumb(file, (error, base64) => {
        file.base64 = base64;
      }, 1, 1);
      // 获取缩略
      this.uploader.makeThumb(file, (error, src) => {
        file.src = src;
      }, 80, 80);
    }
  }

  /**
   * 上传前参数凭借
   */
  onUploadBeforeSend = (obj, data, header) => {
    const newHeader = { Authentication: this.upSer.getToken() };
    header = Object.assign(header, newHeader);
    const newData = { type: 'file' };
    data = Object.assign(data, newData);
  }

  /**
   * 文件队列变化
   */
  onFileQueuedChange = (file: OstFile) => {
    this.initFile(file);
    this.fileQueued.push(file);
    this.checkComplete();
    this.cd.markForCheck();
  }

  /**
   * 进度条变化
   */
  onUploadProgress = (file: OstFile, percentage) => {
    file.state = State.progress;
    file.progress = percentage * 100;
    this.checkComplete();
    this.cd.markForCheck();
  }

  /**
   * 上传成功
   */
  onUploadSuccess = (file: OstFile, response) => {
    file = Object.assign(file, response);
    file.state = State.complete;
    this.uploadSuccess.emit({ file, response });
    this.checkComplete();
    this.cd.markForCheck();
  }

  /**
   * 删除
   */
  onDelClick(event, file: OstFile) {
    if (event) {
      event.stopPropagation();
    }
    const del = () => {
      const index = this.fileQueued.indexOf(file);
      this.uploader.getFiles().map(i => {
        if (file === i) {
          this.uploader.removeFile(file);
        }
      });
      this.fileQueued.splice(index, 1);
      this.checkComplete();
      this.cd.markForCheck();
    };
    // 如果为完成直接删除
    if (file.state === State.complete) {
      // 进入删除状态
      file.state = State.cancelled;
      this.upSer.deleteFileService([file.id]).subscribe(del);
    } else {
      del();
    }
  }

  /**
   * 下载
   */
  onDownload(file: OstFile) {
    this.upSer.openDownload(file);
  }

  /**
   * grid 点击
   */
  onGridItemClick(event, file: OstFile) {
    if (event) {
      event.stopPropagation();
    }
    (file.type.split('/')[0] === 'image') ?
      this.upSer.openDetails(file) :
      this.upSer.openDownload(file);
  }
  /**
   * 打开详情
   */
  openDetails(file: OstFile) {
    this.upSer.openDetails(file);
  }
  /**
   * 上传失败
   */
  onUploadError = (file: OstFile, code) => {
    file.state = State.error;
    this.checkComplete();
    this.cd.markForCheck();
  }

  /**
   * 全部上传完成
   */
  onUploadFinished = () => {
    this.uploadFinished.emit();
    this.checkComplete();
  }

  /**
   * 检测文件是否完成
   */
  checkComplete = () => {
    if (this.uploader.getFiles(State.progress).length === 0 && this.uploader.getFiles(State.error).length === 0) {
      this.isComplete = true;
    } else {
      this.isComplete = false;
    }
    this.isCompleteChange.emit(this.isComplete);
  }

}


const defaultOptions: UploaderOptions = {
  // 自动上传
  auto: true,
  // 选中按钮
  pick: {
    id: '#picker'
  },
  fileSingleSizeLimit: 1024 * 50000
};

/**
 * 支持的图片类型
 */
const ImgaeSuffix: OptionsAccept = {
  extensions: 'bmp,jpg,png,tif,gif',
  mimeTypes: '.bmp,.jpg,.png,.tif,.gif'
};

/**
 * 支持的文件类型
 */
const FileSuffix: OptionsAccept = {
  extensions: 'pdf,doc,ppt,pptx,xls,xlsx,docx,rar,zip,7z,tar.gz,war,jar,txt,chm,pdr,azw,prc,mbp,tan,tpz,epub,mobi,rp,bmp,jpg,png,tif,gif',
  mimeTypes: `.pdf,.doc,.ppt,.pptx,.xls,.xlsx,.docx,.rar,.zip,.7z,.tar.gz,.war,.jar,.txt,.chm,
              .pdr,.azw,.prc,.mbp,.tan,.tpz,.epub,.mobi,.rp,.bmp,.jpg,.png,.tif,.gif`
};

/**
 * 文件类型转化
 */
const FileTypeTransform = (file: FileType) => {
  switch (file) {
    case FileType.FILE:
      return FileSuffix;
    case FileType.IMGAE:
      return ImgaeSuffix;
  }
};

/**
 * 上传形式
 */
export enum UpLoaderDisplay {
  GRID = 'gird',
  LIST = 'list'
}
/**
 * 文件类型
 */
export enum FileType {
  IMGAE = 'imgae',
  FILE = 'file'
}

