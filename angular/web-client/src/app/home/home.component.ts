import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit} from '@angular/core';
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
export class HomeComponent implements AfterViewInit{

  selectedIndexSubscription!: Subscription;

  constructor(private elementRef: ElementRef,private sharedService: SharedService) {}

  //array used to maintain the selected card index
  public selected: number[] = [];

  public isLoaded: boolean = false;

  ngOnInit(): void {

    this.isLoaded = true;
    //shared service used to communicate the index value between header and home component
    this.selectedIndexSubscription = this.sharedService.selectedIndex$.subscribe((index: number[]) => {
      this.selected = index;
    });
    this.clearLocalStorage();
  }
  
  //used to add the selected index value to the shared service
  selectCard(cardIndex: number) {
    this.sharedService.setFilterIndex([cardIndex]);
  }

  //clear the local storage
  clearLocalStorage(): void {
    localStorage.clear();
  }
  ngAfterViewInit(): void {
    const mainElement: any =  document.getElementById('home');
    if(mainElement) {
      mainElement.classList.remove('hidden');
    }
  }
  
  openHome(dynamicFilterType: string): void {
    localStorage.setItem('dynamicFilterTypeHome',dynamicFilterType);
  }

  openWorkflow(filterType: string): void {
    var element: any;
    if(filterType == 'datasource')
    {
      element = document.getElementById('datasourceWorkflow');
      element.click();
    }
    else if(filterType == 'isolation')
    {
      element = document.getElementById('isolationWorkflow');
      element.click();
    }
    else if(filterType == 'dynamic1')
    {
      element = document.getElementById('dynamicWorkflow1');
      element.click();
    }
    else if(filterType == 'dynamic2')
    {
      element = document.getElementById('dynamicWorkflow2');
      element.click();
    }
    else if(filterType == 'webdatasource')
    {
      element = document.getElementById('webdatasourceWorkflow');
      element.click();
    }
    else if(filterType == 'userfilter')
    {
      element = document.getElementById('userfilterWorkflow');
      element.click();
    }
  }
}
