import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { MenuService } from './menu/menu.service';
import { BreadcrumbService } from './breadcrumb/breadcrumb.service';
import { TopbarComponent } from './topbar/topbar.component';
import { MenuComponent, AppSubMenuComponent } from './menu/menu.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LayoutService } from './layout/layout.service';

const COMPONENTS = [
    LayoutComponent,
    TopbarComponent,
    MenuComponent,
    AppSubMenuComponent,
    BreadcrumbComponent,
    FooterComponent
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ThemeModule,
            providers: [
                BreadcrumbService,
                MenuService,
                LayoutService
            ],
        };
    }
}