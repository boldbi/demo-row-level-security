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
  public dashboardContainer1: boolean = false;

  public dashboardContainer2: boolean = false;

  // Flag to control visibility of the workflow container
  public workflow: boolean = false;
  public workflowContainer1: boolean = false;
  public workflowContainer2: boolean = false;

  // Field used to store the identity value
  public identity: string = '';

  public selectedDynamic: number[] = [];

  public selectedAttribute: string = 'staging';

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
      this.setAttribute(storedData[1].value);
    }
    const selectFromHome = localStorage.getItem('dynamicFilterTypeHome')
    const selectedCard = localStorage.getItem('dynamicFilterType')
    if (selectFromHome) {
      if (selectFromHome == "api") {
        this.selectedDynamic = [0]
      }
      else {
        this.selectedDynamic = [1]
      }
    }
    else if (selectedCard) {
      this.selectedDynamic = [Number(selectedCard)];
    }
    localStorage.removeItem('dynamicFilterType');
    localStorage.removeItem('dynamicFilterTypeHome');
    localStorage.removeItem('dynamicPreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    var data: any[] = [
      { label: 'identity', value: this.identity },
      { label: 'attribute', value: this.selectedAttribute }
    ]
    if (this.selectedDynamic.length) {
      localStorage.setItem('dynamicFilterType', this.selectedDynamic[0].toString())
    }
    localStorage.setItem('dynamicPreviousSelections', JSON.stringify(data));
  }

  // Used to open the workflow diagram
  openWorkFlow1() {
    this.workflow = true;
    this.workflowContainer1 = true;
    this.workflowContainer2 = false;
  }
  openWorkFlow2() {
    this.workflow = true;
    this.workflowContainer2 = true;
    this.workflowContainer1 = false;
  }

  leftClick(): void {
    var button = document.getElementById('btn');
    if (button) {
      button.style.left = '0';
    }
    this.selectedAttribute = 'staging'
  }

  rightClick(): void {
    var button = document.getElementById('btn');
    if (button) {
      button.style.left = '110px';
    }
    this.selectedAttribute = 'production'
  }

  selectCard(index: number): void {
    if (this.selectedDynamic.includes(index)) {
      this.selectedDynamic = [];
    }
    else {
      this.selectedDynamic = [index];
    }
  }

  setAttribute(attribute: string): void {
    this.selectedAttribute = attribute;
  }

  // Dashboard rendering methods

  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettingsExternalApi() {
    this.dashboardContainer1 = true;
    const headers = new HttpHeaders({
      'filterType': 'dynamic',
      'key': this.identity,
    });
    this.http.get<BoldBISettings>(this.boldbisettingsApi, { headers }).subscribe(
      (result) => {
        this.boldbisettings = result;
        this.loadDashboardExternalApi();
      }
    );
  }

  // Create a BoldBI instance and load the required dashboard
  loadDashboardExternalApi() {
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
  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettingsCustomAttribute() {
    this.dashboardContainer2 = true;
    const headers = new HttpHeaders({
      'filterType': 'dynamic-CA',
      'customAttribute': this.selectedAttribute
    });
    this.http.get<BoldBISettings>(this.boldbisettingsApi, { headers }).subscribe(
      (result) => {
        this.boldbisettings = result;
        this.loadDashboardCustomAttribute();
      }
    );
  }

  // Create a BoldBI instance and load the required dashboard
  loadDashboardCustomAttribute() {
    const option = {
      serverUrl: `${this.boldbisettings?.ServerUrl ?? ''}/${this.boldbisettings?.SiteIdentifier ?? ''}`,
      dashboardId: this.boldbisettings?.DashboardId,
      embedContainerId: 'dashboard4',
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: '100%',
      height: '800px',
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          'filterType': 'dynamic-CA',
          'customAttribute': this.selectedAttribute
        }
      },
      dashboardSettings: {
        showHeader: false
      },
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
