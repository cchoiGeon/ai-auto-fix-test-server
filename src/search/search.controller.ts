import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // [#21] GET /api/search/legacy?keyword=shoes
  @Get('legacy')
  legacy(@Query('keyword') keyword?: string) {
    return this.searchService.searchLegacy(keyword ?? 'shoes');
  }

  // [#22] GET /api/search/all-shards?keyword=bag
  @Get('all-shards')
  allShards(@Query('keyword') keyword?: string) {
    return this.searchService.searchAllShards(keyword ?? 'bag');
  }

  // [#23] GET /api/search/category-tree
  @Get('category-tree')
  categoryTree() {
    return this.searchService.buildCategoryTree();
  }

  // [#24] GET /api/search/page?page=99
  @Get('page')
  page(@Query('page') page?: string) {
    return this.searchService.getSearchPage(parseInt(page ?? '99', 10));
  }
}
