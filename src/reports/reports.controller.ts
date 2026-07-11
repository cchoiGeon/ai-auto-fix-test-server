import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // [#17] GET /api/reports/monthly
  @Get('monthly')
  monthly() {
    return this.reportsService.loadMonthlyReport();
  }

  // [#18] GET /api/reports/date-range   (from 파라미터 없이 호출)
  @Get('date-range')
  dateRange(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.buildDateRange(from, to);
  }

  // [#19] GET /api/reports/grand-total
  @Get('grand-total')
  grandTotal() {
    return this.reportsService.calculateGrandTotal();
  }

  // [#20] GET /api/reports/export
  @Get('export')
  export() {
    return this.reportsService.exportSnapshot();
  }
}
