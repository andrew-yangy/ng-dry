import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule, CheckboxModule, DropdownModule } from 'primeng/primeng';

const UIMODULES = [
	CheckboxModule,
	PanelModule,
	DropdownModule
];

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		...UIMODULES
	],
	exports: [
		...UIMODULES
	],
	providers: [],
})
export class SharedModule {}
