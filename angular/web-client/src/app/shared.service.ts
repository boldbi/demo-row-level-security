import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor() { }
 
  private selectedIndexSubject = new Subject<number[]>();
  selectedIndex$ = this.selectedIndexSubject.asObservable(); // Corrected property name

  setFilterIndex(index: number[]): void {
    this.selectedIndexSubject.next(index);
  }
}
