import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  // [#9] 잘못된 포트로 연결 시도 → MongooseServerSelectionError (ECONNREFUSED)
  async checkLegacyReplica() {
    const conn = await mongoose
      .createConnection('mongodb://127.0.0.1:59999/legacy-replica', {
        serverSelectionTimeoutMS: 1500,
      })
      .asPromise();
    const ping = await conn.db.admin().ping();
    await conn.close();
    return ping;
  }
}
