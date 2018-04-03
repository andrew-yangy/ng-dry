import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagesComponent } from '../../pages/pages.component';

@Component({
	selector: 'nd-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
	username: string;
	appList: any[];
	spaces: any[];
	selectedSpace: string;

	constructor(
		public app: PagesComponent,
		private router: Router
	) { }

	ngOnInit() {
	}
	selectSpace(space) {
	}
	logout() {
	}
}
