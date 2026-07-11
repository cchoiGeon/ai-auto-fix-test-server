import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly validators: Record<string, (body: any) => boolean> = {
    password: (body) => typeof body.password === 'string',
    otp: (body) => /^\d{6}$/.test(body.code ?? ''),
  };

  // [#5] 등록되지 않은 method가 오면 validator가 undefined → "is not a function"
  login(body: { method?: string; [k: string]: unknown }) {
    const validator = this.validators[body.method];
    const valid = validator(body);
    return { ok: valid, method: body.method };
  }
}
