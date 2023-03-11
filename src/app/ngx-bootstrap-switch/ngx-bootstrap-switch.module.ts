import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxBootstrapSwitchComponent } from './ngx-bootstrap-switch.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgxBootstrapSwitchComponent
    ],
    exports: [
        NgxBootstrapSwitchComponent
    ]
})
export class NgxBootstrapSwitchModule {
    static forRoot(): ModuleWithProviders<unknown> {
        return {
            ngModule: NgxBootstrapSwitchModule,
            providers: []
        };
    }
}