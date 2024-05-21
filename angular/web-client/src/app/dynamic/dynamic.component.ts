import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BoldBI } from '@boldbi/boldbi-embedded-sdk';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dynamic.component.html',
  styleUrl: './dynamic.component.scss'
})
export class DynamicComponent {

  constructor(private http: HttpClient, private router: Router) { }

  // API endpoints for authorization and retrieving BoldBI settings
  private readonly authorizationApi = 'http://localhost:5023/api/dashboard/authorize';
  private readonly boldbisettingsApi = 'http://localhost:5023/api/dashboard/getboldbisettings';

  // BoldBI settings object to hold retrieved settings from the backend
  private boldbisettings: BoldBISettings | null = null;

  // Flag to control visibility of the dashboard container
  public dashboardContainer: boolean = false;

  // Field used to store the identity value
  public identity: string = '';

  public selectedDynamic: number[] = [];

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
    const storedDataString = localStorage.getItem('dynamicPreviousSelections');
    if (storedDataString) {
      const storedData: any[] = JSON.parse(storedDataString);
      this.identity = storedData[0].value;
    }
    localStorage.removeItem('dynamicPreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    var data: any[] = [
      { label: 'identity', value: this.identity }
    ]
    localStorage.setItem('dynamicPreviousSelections', JSON.stringify(data));
  }

  // Dashboard rendering methods

  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettings() {
    this.dashboardContainer = true;
    const headers = new HttpHeaders({
      'filterType': 'dynamic',
      'key': this.identity,
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
      embedContainerId: 'dashboard3',
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: '100%',
      height: '800px',
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          'filterType': 'dynamic',
          'key': this.identity,

        }
      },
      dashboardSettings: {
        showHeader: false
      },
      dynamicConnection: {
        isEnabled: true,
        identity: this.identity
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
