import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attendee } from '../attendee';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss'],
})
export class AttendeesListComponent {
  @Input() attendees?: Attendee[];
  @Output() delete = new EventEmitter<Attendee>();
  @Output() add = new EventEmitter();
}
