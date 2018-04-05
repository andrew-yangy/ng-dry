import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MenuService } from '../@theme/menu/menu.service';

@Injectable()
export class StartupService {
    constructor(
        private http: HttpClient,
        private menuService: MenuService
    ) {
    }
    getSettings(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('assets/mocks/app-settings.json')
                .pipe(
                    catchError((appSettings) => {
                        resolve(null);
                        // handle error here
                        return appSettings;
                    })
                ).subscribe(
                    (appSettings: any) => { this.menuService.addMenus(appSettings.menu) },
                    () => { },
                    () => {
                        resolve(null);
                    });
        });
    }
}