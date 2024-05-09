import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() anchorTagSelected = new EventEmitter<number>();
  //array used to maintain the selected card index
  public selected: number [] = [];

  constructor(private sharedService: SharedService, private router: Router) { }

  selectedIndexSubscription!: Subscription;

  ngOnInit(): void {
    //shared service used to communicate the index value between header and home component
    this.selectedIndexSubscription = this.sharedService.selectedIndex$.subscribe((index: number[])=> {
      this.selected = index;
    });
  }

  //used to get the index value of the cards and set it to the shared service
  selectFromNav(cardIndex: number) {
    if (cardIndex == -1 || this.selected.includes(cardIndex)) {
      this.selected =[];
      this.router.navigate(["/home"]);
    }
    else{
      this.selected =[cardIndex];
    }
    this.sharedService.setFilterIndex(this.selected);
  }
}
