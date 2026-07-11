import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // [#28] GET /api/files/service-account
  @Get('service-account')
  serviceAccount() {
    return this.filesService.loadServiceAccount();
  }

  // [#29] POST /api/files/upload-meta  body: {"fileName":"a.png"}
  @Post('upload-meta')
  uploadMeta(@Body() body: { fileName?: string }) {
    return this.filesService.saveUploadMeta(body?.fileName ?? '');
  }

  // [#30] GET /api/files/download-buffer
  @Get('download-buffer')
  downloadBuffer(@Query('size') size?: string) {
    return this.filesService.prepareDownloadBuffer(size);
  }
}
