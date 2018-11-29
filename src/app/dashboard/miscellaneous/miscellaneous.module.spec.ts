import { MiscellaneousModule } from './miscellaneous.module';

describe('MiscellaneousModule', () => {
  let miscellaneousModule: MiscellaneousModule;

  beforeEach(() => {
    miscellaneousModule = new MiscellaneousModule();
  });

  it('should create an instance', () => {
    expect(miscellaneousModule).toBeTruthy();
  });
});
