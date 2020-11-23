import { Observable } from 'rxjs/internal/Observable';
import { File as OstFile } from '../uploader/webuploader.wrapper';

export abstract class UploaderService {
  /**
   * 获取url
   */
  abstract getService(): string;

  /**
   * 删除文件服务
   */
  abstract deleteFileService(id: string[]): Observable<any>;

  /**
   * 获取token
   */
  abstract getToken(): string;

  /**
   * 打开详情
   */
  abstract openDetails(file: OstFile);

  /**
   * 打开下载
   */
  abstract openDownload(file: OstFile);


}
