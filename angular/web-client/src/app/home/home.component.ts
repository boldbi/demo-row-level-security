import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  selectedIndexSubscription!: Subscription;

  constructor(private elementRef: ElementRef,private sharedService: SharedService) {}

  //array used to maintain the selected card index
  public selected: number[] = [];

  ngOnInit(): void {
    //shared service used to communicate the index value between header and home component
    this.selectedIndexSubscription = this.sharedService.selectedIndex$.subscribe((index: number[]) => {
      this.selected = index;
    });
  }
  //used to add the selected index value to the shared service
  selectCard(cardIndex: number) {
    this.sharedService.setFilterIndex([cardIndex]);
  }
}
