import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PagesComponent } from '../../pages/pages.component';
import { MenuService, MenuItem } from './menu.service';
import { takeWhile, filter, map, startWith, withLatestFrom, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { LayoutService } from '../layout/layout.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { zip } from 'rxjs/observable/zip';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'nd-menu',
	template: `
		<ul class="ultima-menu ultima-main-menu">
			<li ndMenuItem *ngFor="let item of items"
					[item]="item"
					(toggleSubMenu)="onToggleSubMenu($event)"
					(selectItem)="onSelectItem($event)"></li>
		</ul>
    `
})
export class MenuComponent implements OnInit, OnDestroy {
	@Input() items: MenuItem[];

	layoutState: string;
	private alive: boolean = true;

	constructor(
		private menuService: MenuService,
		private layoutService: LayoutService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.menuService
			.getMenus()
			.pipe(takeWhile(() => this.alive))
			.subscribe(data => this.items = data);

		this.layoutService.onStateChange()
			.pipe(takeWhile(() => this.alive))
			.subscribe(state => {
				this.layoutState = state;
			});

		this.router.events
			.pipe(
				takeWhile(() => this.alive),
				filter(event => event instanceof NavigationEnd),
		)
			.subscribe(() => {
				this.menuService.resetItems(this.items);
				this.menuService.updateMenus(this.items);
			});
		this.menuService.initItems(this.items);
		this.menuService.updateMenus(this.items);
	}

	onToggleSubMenu(item: MenuItem) {
		this.menuService.submenuToggle(item, this.layoutState);
	}

	onSelectItem(item: MenuItem) {
	}

	onItemClick(item: MenuItem) {
	}

	ngOnDestroy() {
		this.alive = false;
	}
}

@Component({
	selector: '[ndMenuItem]',
	templateUrl: './menu-item.component.html',
	animations: [
		trigger('children', [
			state(
				'hiddenAnimated',
				style({
					height: '0px'
				})
			),
			state(
				'visibleAnimated',
				style({
					height: '*'
				})
			),
			state(
				'visible',
				style({
					height: '*'
				})
			),
			state(
				'hidden',
				style({
					height: '0px'
				})
			),
			transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
			transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	]
})
export class AppSubMenuComponent implements OnInit {

	@Input() item: MenuItem;
	@Output() toggleSubMenu = new EventEmitter<MenuItem>();
	@Output() selectItem = new EventEmitter<MenuItem>();

	@HostListener('mouseenter')
	onMouseEnter() {
		this.item.hoverListener.next(true);
	}
	@HostListener('mouseleave')
	onMouseLeave() {
		this.item.hoverListener.next(false);
	}
	animatedState$?: Observable<string>;

	constructor(
		private menuService: MenuService,
		private layoutService: LayoutService) { }

	ngOnInit() {
		this.animatedState$ = this.menuService.onAnimatedState(this.item);
	}

	onToggleSubMenu(item: MenuItem) {
		this.toggleSubMenu.emit(item);
	}

	onSelectItem(item: MenuItem) {
		this.selectItem.emit(item);
	}
}
