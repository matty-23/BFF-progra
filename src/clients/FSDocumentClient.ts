import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class FSDocumentClient implements OnModuleInit {
    private storageService: any;

    constructor(@Inject('STORAGE_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.storageService = this.client.getService<any>('StorageService');
    }

get(id: string): Observable<any> {
    return this.storageService.DownloadFile({
        storageId: id
    });
}
    upload(data$: Observable<any>) {
        return this.storageService.UploadFile(data$);
    }
    deleteFile(id: string): Observable<any> {
        return this.storageService.DeleteFile({ storageId: id });
    }
}