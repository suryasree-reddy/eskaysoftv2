import { InventoryReportsModule } from './inventory-reports.module';

describe('InventoryReportsModule', () => {
  let inventoryReportsModule: InventoryReportsModule;

  beforeEach(() => {
    inventoryReportsModule = new InventoryReportsModule();
  });

  it('should create an instance', () => {
    expect(inventoryReportsModule).toBeTruthy();
  });
});
