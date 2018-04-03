import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
export interface MenuItem {
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    queryParams?: {
        [k: string]: any;
    };
    children?: MenuItem[];
    parent?: MenuItem;
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    routerLinkActiveOptions?: any;
    separator?: boolean;
    badge?: string;
    badgeStyleClass?: string;
    style?: any;
    styleClass?: string;
    title?: string;
    id?: string;
    selected?: boolean;
}

@Injectable()
export class MenuService {
    items$ = new ReplaySubject<MenuItem[]>(1);

    constructor(
        private location: Location
    ) {
    }

    addMenu(items: MenuItem[]) {
        if (Array.isArray(items)) this.items$.next(items);
    }

    getMenus(): Observable<MenuItem[]> {
        return this.items$.pipe(share());
    }

    updateMenus(items: MenuItem[], parent?: MenuItem) {
        items.some(item => {
            if (parent) item.parent = parent;
            return this.selectItemByUrl(item)
        }
        );
    }
    resetItems(items: MenuItem[]) {
        items.forEach(i => this.resetItem(i));
    }

    selectItem(item: MenuItem) {
        item.selected = true;
        this.selectParent(item);
    }

    private resetItem(item: MenuItem) {
        item.selected = false;

        item.children && item.children.forEach(child => {
            item.expanded = false;
            this.resetItem(child);
        });
    }

    private selectParent({ parent: item }: MenuItem) {
        if (!item) return;
        item.expanded = true;
        item.selected = true;
    }

    private selectItemByUrl(item: MenuItem) {
        if (item.children) {
            this.updateMenus(item.children, item)
        }
        const location: string = this.location.path() || '/';
        if (location === item.routerLink) {
            this.selectItem(item);
            return true;
        }
    }
}