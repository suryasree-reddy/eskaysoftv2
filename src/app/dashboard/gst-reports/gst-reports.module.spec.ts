import { GstReportsModule } from './gst-reports.module';

describe('GstReportsModule', () => {
  let gstReportsModule: GstReportsModule;

  beforeEach(() => {
    gstReportsModule = new GstReportsModule();
  });

  it('should create an instance', () => {
    expect(gstReportsModule).toBeTruthy();
  });
});
