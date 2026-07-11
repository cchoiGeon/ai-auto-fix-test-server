import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  // [#17] 저장된 리포트 blob이 잘려있음 → JSON.parse SyntaxError
  loadMonthlyReport() {
    const storedBlob = this.readReportBlobFromStorage();
    const report = JSON.parse(storedBlob);
    return report;
  }

  private readReportBlobFromStorage(): string {
    // 업로드 중단으로 뒷부분이 잘린 JSON이 저장되어 있는 상황
    return '{"period":"2026-06","totals":[120000,98000,';
  }

  // [#18] 잘못된 날짜 문자열 → Invalid Date → toISOString에서 RangeError
  buildDateRange(from?: string, to?: string) {
    const start = new Date(from ?? 'not-a-date');
    const end = new Date(to ?? Date.now());
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  // [#19] BigInt와 number 혼합 연산 → TypeError
  calculateGrandTotal() {
    const ledgerTotal = BigInt('9007199254740993');
    // 정산 조정값은 외부 설정에서 내려옴 (number로 파싱되는 것을 놓침)
    const adjustment: any = JSON.parse('{"value": 0.05}').value;
    const grandTotal = ledgerTotal + adjustment;
    return { grandTotal: grandTotal.toString() };
  }

  // [#20] 순환 참조 객체 직렬화 → TypeError: Converting circular structure
  exportSnapshot() {
    const snapshot: any = { name: 'daily-snapshot', createdAt: new Date() };
    snapshot.parent = snapshot;
    return JSON.stringify(snapshot);
  }
}
