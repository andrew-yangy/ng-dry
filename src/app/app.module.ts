import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StartupService } from './@core/startup.service';
import { ThemeModule } from './@theme/theme.module';

export function StartupServiceFactory(startupService: StartupService): Function {
	return () => startupService.getSettings();
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		ThemeModule.forRoot()
	],
	providers: [
		StartupService,
		{
			provide: APP_INITIALIZER,
			useFactory: StartupServiceFactory,
			deps: [StartupService],
			multi: true
		}],
	bootstrap: [AppComponent]
})
export class AppModule { }