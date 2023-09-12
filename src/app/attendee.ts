export interface Attendee {
  name: string;
  surname: string;
  age: number;
  gender: 'F' | 'M';
  sail_exp: 'капитан' | 'матрос' | 'пассажир' | 'ни разу не бывал на яхте';
  skipper_rating: number;
  group_id: number;
  tags: string;
}
