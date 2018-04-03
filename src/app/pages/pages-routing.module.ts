import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            component: DashboardComponent,
        },
        {
            path: 'components',
            component: DashboardComponent,
        }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}