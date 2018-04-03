import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', loadChildren: 'app/pages/pages.module#PagesModule' },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}