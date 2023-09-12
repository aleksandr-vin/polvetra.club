import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attendee } from '../attendee';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss'],
})
export class AttendeesListComponent {
  @Input() attendees: Attendee[];
  @Output() delete = new EventEmitter<Attendee>();
  @Output() add = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  private currentEditFocus?: [Attendee, keyof Attendee];

  toggleEdit(attendee: Attendee, field: keyof Attendee) {
    this.currentEditFocus = [attendee, field];
  }

  isEditing(attendee: Attendee, field: keyof Attendee) {
    return (
      this.currentEditFocus &&
      this.currentEditFocus[0] == attendee &&
      this.currentEditFocus[1] == field
    );
  }

  onEdit(attendee: Attendee, field: string) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: { attendee: attendee, field: field },
    });

    dialogRef.afterClosed().subscribe((result: string | number) => {
      if (result == undefined) {
        return;
      }

      if (field == 'name') {
        attendee['name'] = result as string;
      } else if (field == 'surname') {
        attendee['surname'] = result as string;
      } else if (field == 'age') {
        attendee['age'] = result as number;
      } else if (field == 'tags') {
        attendee['tags'] = result as string;
      } else if (field == 'gender') {
        attendee['gender'] = result as 'F' | 'M';
      } else if (field == 'sail_exp') {
        attendee['sail_exp'] = result as
          | 'капитан'
          | 'матрос'
          | 'пассажир'
          | 'ни разу не бывал на яхте';
      } else if (field == 'skipper_rating') {
        attendee['skipper_rating'] = result as number;
      } else if (field == 'group_id') {
        attendee['group_id'] = result as number;
      }
      this.dataSource = new MatTableDataSource(this.attendees);
    });
  }

  onAdd() {
    this.add.emit();
    this.dataSource = new MatTableDataSource(this.attendees);
  }

  onDelete($event: Attendee) {
    this.delete.emit($event);
    this.dataSource = new MatTableDataSource(this.attendees);
  }

  dataSource: MatTableDataSource<Attendee, MatTableDataSourcePaginator>;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.attendees);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    'name',
    'surname',
    'age',
    'tags',
    'gender',
    'sail_exp',
    'skipper_rating',
    'group_id',
    '$delete',
  ];
}
