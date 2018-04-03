import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-footer',
	template: `
        <div class="footer">
            <div class="card clearfix">
                <span class="footer-text-left">PrimeNG ULTIMA for Angular</span>
                <span class="footer-text-right">
                    <span class="material-icons ui-icon-copyright"></span>
                    <span>All Rights Reserved</span>
                </span>
            </div>
        </div>
    `
})
export class FooterComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}