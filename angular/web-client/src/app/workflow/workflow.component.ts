import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent implements OnInit{
  selectedIndexSubscription!: Subscription;
  filterType: string = '';

  constructor(private route: ActivatedRoute, private router: Router,private sharedService: SharedService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.filterType = params['filterType'];
    });
  }

  goBack():void {
    // this.sharedService.setFilterIndex([]);
    // this.router.navigate(["/home"]);
    if(this.filterType == 'datasource') {
      this.router.navigate(['/datasource']);
    }
    else if(this.filterType == 'isolation') {
      this.router.navigate(['/isolation']);
    }
    else if(this.filterType == 'dynamicAPI' || this.filterType == 'dynamicCustom') {
      this.router.navigate(['/dynamic-connection']);
    }
    else if(this.filterType == 'webdatasource') {
      this.router.navigate(['/webdatasource']);
    }
  }
}
