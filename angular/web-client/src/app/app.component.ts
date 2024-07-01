import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { IsolationComponent } from './isolation/isolation.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { WebdatasourceComponent } from './webdatasource/webdatasource.component';
import { UserfilterComponent } from './userfilter/userfilter.component';
import { SharedService } from './shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HeaderComponent, DatasourceComponent, IsolationComponent, DynamicComponent, WebdatasourceComponent, UserfilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  constructor(private router: Router, private sharedService: SharedService){}
  selectedIndexSubscription!: Subscription;
  public selected: any = [];
  public showHome: boolean = true;
  public afterLoad: boolean = false;

  title = 'filters-demo';
  ngOnInit() {
    this.selectedIndexSubscription = this.sharedService.selectedIndex$.subscribe((index: number[]) => {
      this.selected = index;
      this.updateDisplay();
    });
    this.router.navigate(["/home"]);
  }
  private updateDisplay() {
    this.showHome = this.selected.length === 0;
  }
  ngAfterViewInit(): void {
    const mainElement: any =  document.getElementById('main');
    if(mainElement) {
      mainElement.classList.remove('hidden');
    }
  }
}

