import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BoldBI } from '@boldbi/boldbi-embedded-sdk';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-webdatasource',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './webdatasource.component.html',
  styleUrl: './webdatasource.component.scss'
})
export class WebdatasourceComponent {

  constructor(private http: HttpClient, private router: Router,private renderer: Renderer2) { }

  // API endpoints for authorization and retrieving BoldBI settings
  private readonly authorizationApi = 'http://localhost:5023/api/dashboard/authorize';
  private readonly boldbisettingsApi = 'http://localhost:5023/api/dashboard/getboldbisettings';

  // BoldBI settings object to hold retrieved settings from the backend
  private boldbisettings: BoldBISettings | null = null;

  // Flag to control visibility of the dashboard container
  public dashboardContainer: boolean = false;

  // Flag to control visibility of the workflow container
  public workflowContainer: boolean = false;

  public selectedCategory: string = '';

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setData();
      }
    });
    this.getData();
  }

  // To store the current data in the local storage.
  getData(): void {
    var value = localStorage.getItem('WebDatasourcePreviousSelections');
    if(value)
    {
      this.selectedCategory = value;
    }
    localStorage.removeItem('WebDatasourcePreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    localStorage.setItem('WebDatasourcePreviousSelections', this.selectedCategory);
  }

  // Used to open the workflow diagram
  openWorkFlow() {
    this.workflowContainer = true;
  }

  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettings() {
    this.dashboardContainer = true;
    const headers = new HttpHeaders({
      'filterType': 'web-datasource'
    });
    this.http.get<BoldBISettings>(this.boldbisettingsApi, { headers }).subscribe(
      (result) => {
        this.boldbisettings = result;
        this.loadDashboard();
      }
    );
  }

  // Create a BoldBI instance and load the required dashboard
  loadDashboard() {
    const option = {
      serverUrl: `${this.boldbisettings?.ServerUrl ?? ''}/${this.boldbisettings?.SiteIdentifier ?? ''}`,
      dashboardId: this.boldbisettings?.DashboardId,
      embedContainerId: 'dashboard5',
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: '100%',
      height: '800px',
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          'filterType': 'web-datasource'
        }
      },
      filterParameters: 'Parameter=' + this.selectedCategory.toLowerCase(),
      dashboardSettings: {
        showHeader: false
      }
    };
    const dashboard = BoldBI.create(option);
    dashboard.loadDashboard();
  }

}

// Interface to define the structure of BoldBI settings retrieved from the backend
interface BoldBISettings {
  ServerUrl: string;
  SiteIdentifier: string;
  Environment: string;
  DashboardId: string;
  ExpirationTime: string;
}
