import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnDestroy {
	subscription: Subscription;

	items: MenuItem[];

	constructor(public breadcrumbService: BreadcrumbService) {
		this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
			this.items = response;
		});
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
