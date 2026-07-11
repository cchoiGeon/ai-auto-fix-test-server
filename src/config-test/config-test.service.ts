import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigTestService {
  // [#25] 설정 안 된 환경변수에 문자열 메서드 호출 → TypeError (reading 'trim')
  getGatewayKeyPreview() {
    const key = process.env.PAYMENT_GATEWAY_SECRET;
    const normalized = key.trim();
    return { preview: normalized.slice(0, 4) + '****' };
  }

  // [#26] 환경변수 parseInt 결과가 NaN → new Array(NaN) → RangeError
  initCacheBuckets() {
    const size = parseInt(process.env.CACHE_BUCKET_SIZE ?? 'sixteen', 10);
    const buckets = new Array(size).fill(null);
    return { buckets: buckets.length };
  }

  // [#27] 설치되지 않은 APM 에이전트 동적 로드 → Cannot find module
  async loadApmAgent() {
    const agentModule = process.env.APM_AGENT_MODULE ?? 'spincell-apm-agent';
    const agent = await import(agentModule);
    return agent.start();
  }
}
