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

export interface DialogData {
  attendee: Attendee;
  field: string;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule],
})
export class EditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.attendee = data.attendee;
    this.field = data.field;
  }

  attendee: Attendee;
  field: string;
  v: string | number;

  ngOnInit(): void {
    this.v = this.attendee[this.field as keyof Attendee];
  }

  onNoClick(): void {
    console.log(';:::::::', this.v);
    this.dialogRef.close();
  }
}
