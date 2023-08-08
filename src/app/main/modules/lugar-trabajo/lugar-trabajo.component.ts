import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { LugarTrabajoService } from "./lugar-trabajo.service";

@Component({
    selector: 'app-lugar-trabajo',
    templateUrl: './lugar-trabajo.component.html',
    styleUrls: ['./lugar-trabajo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LugarTrabajoComponent implements OnInit {

    public loading: boolean = true;
    public listLugares: Array<any> = [];
    public listLoadings: Array<number> = [];
    public lugaresFilters: Observable<Array<any>>;
    public controlFilter: FormControl = new FormControl('');

    constructor(private readonly service: LugarTrabajoService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.service.getAll().subscribe((response) => {
            this.listLugares = response.data;
            this.loading = false;

            this.lugaresFilters = this.controlFilter.valueChanges.pipe(
                startWith(''),
                map(value => this._filterLugares(value))
            );
        });
    }

    private _filterLugares(value: any): Array<any> {
        if (typeof value !== 'string') {
            return this.listLugares.sort((a, b) => a.active ? 0 : 1);
        }

        if (!!!value) {
            return this.listLugares.sort((a, b) => a.active ? 0 : 1);
        }

        value = value.toLocaleLowerCase();

        return this.listLugares.filter(l => l.label.toLocaleLowerCase().includes(value)).sort((a, b) => a.active ? 0 : 1);
    }

    public changeStatus(id: number): void {
        this.listLoadings.push(id);

        this.service.updateStatus(id).subscribe((response) => {
            this.listLoadings = this.listLoadings.filter(item => item != id);

            if(!response.success) {
                this.snackBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                      message: 'ERROR',
                      subMessage: response.message ?? 'Ocurrió un error por favor intente lo más tarde.',
                      type: 'error'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 3500
                });
            }
        }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: err.name ?? 'ERROR',
                  subMessage: err.error ?? 'Ocurrió un error por favor intente lo más tarde.',
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 3500
            });

            this.listLoadings = this.listLoadings.filter(item => item != id);
        });
    }

    public isLoading(id: number): boolean {
        return this.listLoadings.findIndex((item) => item == id) >= 0;
    }
}