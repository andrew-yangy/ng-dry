import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { share, map, scan } from 'rxjs/operators';

@Injectable()
export class LayoutService {
    static readonly STATE_STATIC: string = 'static';
    static readonly STATE_OVERLAY: string = 'overlay';
    static readonly STATE_SLIM: string = 'slim';
    static readonly STATE_HORIZONTAL: string = 'horizontal';

    private state$ = new BehaviorSubject<string>(LayoutService.STATE_STATIC);

    onStateChange() {
        return this.state$.pipe(
            scan(prev => {
                return prev === LayoutService.STATE_STATIC ? LayoutService.STATE_SLIM : LayoutService.STATE_STATIC;
            }),
            share()
        );
    }

    toggleState() {
        this.state$.next(null);
    }

    isSlim() {
        return this.onStateChange()
            .pipe(
                map(state => state === LayoutService.STATE_SLIM)
            )

    }
}