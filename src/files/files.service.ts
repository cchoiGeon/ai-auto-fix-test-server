import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  // [#28] 배포 시 누락된 설정 파일 읽기 → ENOENT
  loadServiceAccount() {
    const raw = fs.readFileSync('/etc/spincell/service-account.json', 'utf8');
    return JSON.parse(raw);
  }

  // [#29] 파일 경로 조합 버그로 디렉토리에 write → EISDIR
  saveUploadMeta(fileName: string) {
    // path.join(baseDir, fileName)에서 fileName이 빈 문자열로 들어오는 버그
    const targetPath = '/etc';
    fs.writeFileSync(targetPath, JSON.stringify({ fileName }));
    return { saved: targetPath };
  }

  // [#30] 파일 크기 계산 오류로 비정상적으로 큰 버퍼 할당 → RangeError
  prepareDownloadBuffer(sizeHint?: string) {
    const size = Number(sizeHint ?? 2 ** 33); // 8GB
    const buffer = Buffer.alloc(size);
    return { allocated: buffer.length };
  }
}
