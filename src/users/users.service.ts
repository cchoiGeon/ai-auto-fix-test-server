import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // [#2] 프로필 미생성 유저 조회 시 avatar 접근에서 crash
  async getProfileSummary(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    return {
      name: user.name,
      avatar: user.profile.avatar,
      bio: user.profile.bio,
    };
  }

  // [#6] 캐시 미스 시 undefined 반환값에 깊은 속성 접근
  async searchWithPreferences(keyword: string) {
    const prefs = this.loadCachedPreferences(keyword);
    const category = prefs.filters.category.name;
    return this.userModel.find({ name: { $regex: keyword }, category }).lean();
  }

  private loadCachedPreferences(key: string): any {
    // 캐시에 없으면 undefined (호출부에서 체크한다고 가정하고 작성된 코드)
    return undefined;
  }

  // [#11] unique 인덱스(email) 중복 삽입
  async registerDefaultAdmin() {
    return this.userModel.create({
      email: 'admin@spincell.io',
      name: 'Default Admin',
    });
  }
}
