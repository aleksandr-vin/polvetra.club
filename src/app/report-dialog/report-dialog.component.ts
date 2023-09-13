import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Attendee } from '../attendee';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EncodeURIComponentPipeModule } from '../email-link-encode.pipe';

export interface DialogData {
  attendee: Attendee;
  field: string;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    EncodeURIComponentPipeModule,
  ],
})
export class EditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  message: string;
  metadata: string;
  emailLinkPrefix: string = `mailto:aleksandr.vin@gmail.com?subject=Problem with alpha-testing, polvetra.club&body=`;

  ngOnInit(): void {
    this.message = `Hi, I've found an issue.
I think that result should be this ...`;

    this.metadata = `


Inputs and solution data:

${JSON.stringify(this.data)}

Browser info: ${navigator.userAgent}
`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
