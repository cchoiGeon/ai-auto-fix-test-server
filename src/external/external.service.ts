import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalService {
  // [#13] 응답 없는 사설 IP로 호출 + 1.5초 타임아웃 → TimeoutError/AbortError
  async syncInventory() {
    const res = await fetch('http://10.255.255.1:8080/inventory/sync', {
      signal: AbortSignal.timeout(1500),
    });
    return res.json();
  }

  // [#14] 존재하지 않는 도메인 → ENOTFOUND (DNS 실패)
  async chargeViaGateway(amount: number) {
    const res = await fetch(
      'https://api.nonexistent-payment-gateway-spincell.io/v1/charge',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      },
    );
    return res.json();
  }

  // [#15] 업스트림이 500을 반환하면 그대로 예외 전파
  async fetchExchangeRate() {
    const res = await fetch('https://httpstat.us/500', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      throw new Error(`Upstream exchange-rate API returned ${res.status}`);
    }
    return res.json();
  }

  // [#16] 파트너 API 응답 구조가 예상과 다름 → data.items.map에서 crash
  async importPartnerCatalog() {
    const response = this.callPartnerCatalogApi();
    return response.data.items.map((item: any) => ({
      sku: item.sku,
      name: item.title,
    }));
  }

  private callPartnerCatalogApi(): any {
    // 파트너사가 응답 스펙을 변경함: data.items → data.catalog.entries
    return { status: 'ok', data: { catalog: { entries: [] } } };
  }
}
