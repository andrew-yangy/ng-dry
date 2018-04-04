import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../layout/layout.service';

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
		private layoutService: LayoutService,
		private router: Router
	) { }

	ngOnInit() {
		this.layoutService
			.onStateChange()
			.subscribe(state => {
				// console.log(state);
			})
	}

	toggle() {
		this.layoutService.toggleState();
	}

	logout() {
	}
}
