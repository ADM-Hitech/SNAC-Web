import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-finalize-call-capital',
  templateUrl: './finalize-call-capital.component.html',
  styleUrls: ['./finalize-call-capital.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinalizeCallCapitalComponent implements OnInit {

  public loading = false;
  public fileImage;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private constant: Constant,
    private domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FinalizeCallCapitalComponent>,
  ) {
    this.fileImage = domSanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64,${this.data.fileByte}`);
  }

  ngOnInit() {
  }

  public submit(): void {
    this.loading = true;

    this.http.post(`${this.constant.api}Capitals/ChangeStatus`, {
      capital_id: this.data.capitalId,
      status: 3
    }).subscribe(response => {
      this.dialogRef.close(true);
    }, error => {});
  }

}
