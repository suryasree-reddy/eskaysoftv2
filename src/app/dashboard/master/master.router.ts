import { AuthGuard } from './../../security/auth-guard.service';
import { SubscheduleComponent } from './subschedule/subschedule.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { StatesComponent } from './states/states.component';
import { DistrictsComponent } from './districts/districts.component';
import { BusinessexecutivesComponent } from './businessexecutives/businessexecutives.component';
import { AreasComponent } from './areas/areas.component';
import { BankinformationComponent } from './bankinformation/bankinformation.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { CompanyGroupComponent } from './company-group/company-group.component';
import { CompaniesComponent } from './companies/companies.component';


export const masterRouter: Routes = [
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
    { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]  },
    { path: 'subschedule', component: SubscheduleComponent, canActivate: [AuthGuard]  },
    { path: 'states', component: StatesComponent, canActivate: [AuthGuard]  },
    { path: 'districts', component: DistrictsComponent, canActivate: [AuthGuard]  },
    { path: 'businessExecutives', component: BusinessexecutivesComponent, canActivate: [AuthGuard]  },
    { path: 'areas', component: AreasComponent, canActivate: [AuthGuard]  },
    { path: 'bankInformation', component: BankinformationComponent, canActivate: [AuthGuard]  },
    { path: 'manufacturer', component: ManufacturerComponent, canActivate: [AuthGuard]  },
    { path: 'companyGroup', component: CompanyGroupComponent, canActivate: [AuthGuard]  },
    { path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard]  },
    
    
];

export const MasterRouter: ModuleWithProviders = RouterModule.forChild(masterRouter);
