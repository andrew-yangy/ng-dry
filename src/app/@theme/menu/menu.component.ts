import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PagesComponent } from '../../pages/pages.component';
import { MenuService, MenuItem } from './menu.service';
import { takeWhile, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'nd-menu',
	template: `
		<ul class="ultima-menu ultima-main-menu">
			<li ndMenuItem *ngFor="let item of items"
					[item]="item"
					(hoverItem)="onHoverItem($event)"
					(toggleSubMenu)="onToggleSubMenu($event)"
					(selectItem)="onSelectItem($event)"></li>
		</ul>
    `
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() items: MenuItem[];

	private alive: boolean = true;

	constructor(
		private menuService: MenuService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.menuService
			.getMenus()
			.pipe(takeWhile(() => this.alive))
			.subscribe(data => this.items = data);
		this.router.events
			.pipe(
				takeWhile(() => this.alive),
				filter(event => event instanceof NavigationEnd),
		)
			.subscribe(() => {
				this.menuService.resetItems(this.items);
				this.menuService.updateMenus(this.items);
			});
	}
	ngAfterViewInit() {
		setTimeout(() => this.menuService.updateMenus(this.items));
	}

	onHoverItem(item: MenuItem) {
	}

	onToggleSubMenu(item: MenuItem) {
		item.expanded = !item.expanded;
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
			transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
			transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	]
})
export class AppSubMenuComponent {
	@Input() item: MenuItem;

	@Output() hoverItem = new EventEmitter<any>();
	@Output() toggleSubMenu = new EventEmitter<any>();
	@Output() selectItem = new EventEmitter<any>();

	constructor() { }

	onToggleSubMenu(item: MenuItem) {
		this.toggleSubMenu.emit(item);
	}

	onHoverItem(item: MenuItem) {
		this.hoverItem.emit(item);
	}

	onSelectItem(item: MenuItem) {
		this.selectItem.emit(item);
	}
}
