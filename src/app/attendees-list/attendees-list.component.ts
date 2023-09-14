import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attendee } from '../attendee';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss'],
})
export class AttendeesListComponent {
  @Input() attendees: Attendee[];
  @Output() delete = new EventEmitter<Attendee>();
  @Output() deleteAll = new EventEmitter();
  @Output() add = new EventEmitter();

  constructor() {}

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

  reload() {
    this.dataSource = new MatTableDataSource(this.attendees);
  }

  onAdd() {
    this.add.emit();
    setTimeout(() => this.reload(), 0);
  }

  onDelete($event: Attendee) {
    this.delete.emit($event);
    setTimeout(() => this.reload(), 0);
  }

  onDeleteAll() {
    this.deleteAll.emit();
    setTimeout(() => this.reload(), 0);
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
