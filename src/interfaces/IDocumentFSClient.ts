import { Observable } from "rxjs"
export interface IDocumentFSClient {
    upload(data$: Observable<Buffer>): Observable<UploadDocumentFSResponse>;

}
export interface UploadDocumentFSResponse {
  documentId: string;
  path: string;
  size: number;
  checksum?: string;
  createdAt: Date;
}