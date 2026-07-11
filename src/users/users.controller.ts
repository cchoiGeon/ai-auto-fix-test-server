import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [#2] GET /api/users/profile?email=noprofile@spincell.io
  @Get('profile')
  getProfile(@Query('email') email: string) {
    return this.usersService.getProfileSummary(email ?? 'noprofile@spincell.io');
  }

  // [#6] GET /api/users/search-deep?keyword=kim
  @Get('search-deep')
  searchDeep(@Query('keyword') keyword: string) {
    return this.usersService.searchWithPreferences(keyword ?? 'kim');
  }

  // [#11] POST /api/users/duplicate  (2회째 호출부터 E11000)
  @Post('duplicate')
  duplicate(@Body() _body: unknown) {
    return this.usersService.registerDefaultAdmin();
  }
}
