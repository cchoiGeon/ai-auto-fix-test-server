import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  // [#21] 레거시 서비스가 항상 reject → catch 없이 await
  async searchLegacy(keyword: string) {
    const result = await this.callLegacySearchEngine(keyword);
    return result;
  }

  private callLegacySearchEngine(keyword: string): Promise<unknown> {
    return Promise.reject(
      new Error(`Legacy search engine unavailable (keyword=${keyword})`),
    );
  }

  // [#22] 샤드 병렬 조회 중 하나 실패 → Promise.all 전체 실패
  async searchAllShards(keyword: string) {
    const results = await Promise.all([
      this.queryShard(1, keyword),
      this.queryShard(2, keyword),
      this.queryShard(3, keyword),
    ]);
    return results.flat();
  }

  private async queryShard(shard: number, keyword: string) {
    if (shard === 3) {
      throw new Error(`shard-${shard} connection reset while searching "${keyword}"`);
    }
    return [{ shard, keyword, hits: shard * 10 }];
  }

  // [#23] 종료 조건 없는 재귀 → RangeError: Maximum call stack size exceeded
  buildCategoryTree(depth = 0) {
    const node = { depth, children: [] as unknown[] };
    node.children.push(this.buildCategoryTree(depth));
    return node;
  }

  // [#24] 페이지 인덱스 검증 없이 배열 접근 → undefined.title
  getSearchPage(page: number) {
    const pages = [
      { title: '인기 검색어', items: ['원피스', '셔츠'] },
      { title: '최근 검색어', items: ['바지'] },
    ];
    const current = pages[page];
    return { title: current.title, count: current.items.length };
  }
}
