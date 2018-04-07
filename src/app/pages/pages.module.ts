import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ThemeModule } from "../@theme/theme.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        SharedModule,
        PagesRoutingModule,
        ThemeModule
    ],
    declarations: [
        PagesComponent,
        DashboardComponent
    ],
    providers: []
})
export class PagesModule { }
