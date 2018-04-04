import { Component, OnInit, HostBinding } from '@angular/core';
import { LayoutService } from './layout.service';

@Component({
    selector: 'nd-layout',
    templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
    protected state: string;
    constructor(
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.layoutService
            .onStateChange()
            .subscribe(state => this.state = state)
    }
}