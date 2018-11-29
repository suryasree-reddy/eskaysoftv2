import { FinanceReportsModule } from './finance-reports.module';

describe('FinanceReportsModule', () => {
  let financeReportsModule: FinanceReportsModule;

  beforeEach(() => {
    financeReportsModule = new FinanceReportsModule();
  });

  it('should create an instance', () => {
    expect(financeReportsModule).toBeTruthy();
  });
});
