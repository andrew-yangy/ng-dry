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

@Component({
	selector: 'nd-menu',
	template: `
		<ul class="ultima-menu ultima-main-menu">
			<li ndMenuItem *ngFor="let item of items"
					[item]="item"
					[layoutState]="layoutState"
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
		this.menuService.updateMenus(this.items)
	}

	onToggleSubMenu(item: MenuItem) {
		if (this.layoutState === LayoutService.STATE_SLIM) {
			item.expanded = true;
			this.layoutService.toggleState();
		} else {
			item.expanded = !item.expanded;
		}
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
	private _state: string;
	private isSlim: boolean;
	@Input() item: MenuItem;
	@Input()
	set layoutState(state: string) {
		this._state = state;
		this.isSlim = state === LayoutService.STATE_SLIM;
		this.updateAnimatedState();
	}
	get state() {
		return this._state;
	}
	@Output() toggleSubMenu = new EventEmitter<MenuItem>();
	@Output() selectItem = new EventEmitter<MenuItem>();

	@HostListener('mouseenter')
	onMouseEnter() {
		if (this.isSlim) {
			this.item.animatedState = 'visible'
		}
	}
	@HostListener('mouseleave')
	onMouseLeave() {
		if (this.isSlim && this.item.children) {
			this.item.animatedState = 'hidden';
		}
	}
	constructor(private layoutService: LayoutService) { }

	ngOnInit() {
	}

	onToggleSubMenu(item: MenuItem) {
		this.toggleSubMenu.emit(item);
		this.updateAnimatedState();
	}

	onSelectItem(item: MenuItem) {
		this.selectItem.emit(item);
		this.updateAnimatedState();
	}
	updateAnimatedState() {
		this.item.animatedState = this.isSlim ? 'hidden' : this.item.expanded ? 'visibleAnimated' : 'hiddenAnimated';
	}
}
