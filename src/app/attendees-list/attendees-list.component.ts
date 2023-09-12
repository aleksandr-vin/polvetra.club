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
  @Output() add = new EventEmitter();

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
