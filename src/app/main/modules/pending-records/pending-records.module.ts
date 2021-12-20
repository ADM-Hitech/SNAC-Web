import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { PendingRecordComponent } from './pending-records.component';
import { PendingRecordRouting } from './pending-records.routing';
import { PendingRecordService } from './pending-records.service';
import { TablePendingRecordsComponent } from './table-pending-records/table-pending-records.component';

@NgModule({
    declarations: [
        PendingRecordComponent,
        TablePendingRecordsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        PendingRecordRouting
    ],
    providers: [
        PendingRecordService
    ]
})
export class PendingRecordModule {}
