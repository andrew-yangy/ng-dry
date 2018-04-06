import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { share, map, tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { LayoutService } from '../layout/layout.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { merge } from 'rxjs/observable/merge';
import { combineLatest } from 'rxjs/observable/combineLatest';
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
    expandListener: BehaviorSubject<boolean>;
    hoverListener: BehaviorSubject<boolean>;
}

@Injectable()
export class MenuService {
    items$ = new ReplaySubject<MenuItem[]>(1);

    constructor(
        private location: Location,
        private layoutService: LayoutService
    ) {
    }
    initItems(items: MenuItem[]) {
        items.forEach(i => this.initItem(i))
    }

    addMenus(items: MenuItem[]) {
        if (Array.isArray(items)) this.items$.next(items);
    }

    getMenus(): Observable<MenuItem[]> {
        return this.items$.pipe(share());
    }

    updateMenus(items: MenuItem[], parent?: MenuItem) {
        items.some(item => {
            if (parent) item.parent = parent;
            return this.selectItemByUrl(item)
        });
    }

    resetItems(items: MenuItem[]) {
        items.forEach(i => this.resetItem(i));
    }

    selectItem(item: MenuItem) {
        item.selected = true;
        this.selectParent(item);
    }

    submenuToggle(item: MenuItem) {
        this.layoutService.isSlim()
            .subscribe(isSlim => {
                if (isSlim) {
                    this.setExpanded(item, true);
                    this.layoutService.toggleState();
                } else {
                    this.setExpanded(item);
                }
            })
    }

    onAnimatedState(item: MenuItem) {
        return merge(
            this.updateAnimatedByState(item),
            this.updateAnimatedByEvent(item)
        )
    }

    private initItem(item: MenuItem) {
        if (!item.expandListener) {
            item.expandListener = new BehaviorSubject<boolean>(null);
        }
        if (!item.hoverListener) {
            item.hoverListener = new BehaviorSubject<boolean>(null);
        }
        item.children && item.children.forEach(child => this.initItem(child));
    }

    private updateAnimatedByState(item: MenuItem) {
        return combineLatest(
            this.layoutService.isSlim(),
            item.expandListener
        ).pipe(
            map(([isSlim, expanded]) => isSlim ? 'hidden' : expanded ? 'visibleAnimated' : 'hiddenAnimated'),
            tap(res => console.log(res))
        )
    }

    private updateAnimatedByEvent(item: MenuItem) {
        return combineLatest(
            this.layoutService.isSlim(),
            item.hoverListener
        ).pipe(
            filter(([isSlim, hover]) => isSlim),
            map(([isSlim, hover]) => hover),
            map((hover) => hover ? 'visible' : 'hidden'),
        )
    }

    private setExpanded(item: MenuItem, state?: boolean) {
        if (state !== undefined) {
            item.expandListener.value !== state && item.expandListener.next(state);
        } else {
            item.expandListener.next(!item.expandListener.value);
        }
    }

    private resetItem(item: MenuItem) {
        item.selected = false;
        item.children && item.children.forEach(child => {
            this.setExpanded(item, false);
            this.resetItem(child);
        });
    }

    private selectParent({ parent: item }: MenuItem) {
        if (!item) return;
        this.setExpanded(item, true);
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