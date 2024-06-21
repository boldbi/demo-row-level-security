import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BoldBI } from '@boldbi/boldbi-embedded-sdk';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';


registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXpeeHRURWRfWEN3XkY=');

@Component({
  selector: 'app-isolation',
  standalone: true,
  imports: [DropDownListModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './isolation.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './isolation.component.scss',
})
export class IsolationComponent {
  constructor(private http: HttpClient, private router: Router) { }

  // API endpoints for authorization and retrieving BoldBI settings
  private readonly authorizationApi = 'http://localhost:5023/api/dashboard/authorize';
  private readonly boldbisettingsApi = 'http://localhost:5023/api/dashboard/getboldbisettings';

  // BoldBI settings object to hold retrieved settings from the backend
  private boldbisettings: BoldBISettings | null = null;

  // Flag to control visibility of the dashboard container
  dashboardContainer: boolean = false;

  // Options for tenant and isolation dashboard
  public selectedTenant: string = 'DomesticSector'
  selectedTenantValue: string = '';
  isolationDashboard: string = '';

  public data: { [key: string]: Object }[] = [{ Sector: 'DomesticSector' }, { Sector: 'EconomicSector' }];
  public fields: object = { text: 'Sector' };
  public height: string = '200px';
  public width: string = '103px';
  public popupWidth: string = '140px';
  public value: string = 'DomesticSector';
  public watermark: string = 'sector';

  selectedValue: string = 'DomesticSector';

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
    const storedDataString = localStorage.getItem('isolationPreviousSelections');
    if (storedDataString) {
      const storedData: any[] = JSON.parse(storedDataString);
      storedData.forEach(item => {
        switch (item.label) {
          case 'isolationDashboard':
            this.isolationDashboard = item.value;
            break;
          case 'tenant':
            this.selectedTenant = this.value = item.value;
            break;
        }
      });
    }
    localStorage.removeItem('isolationPreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    var data: any[] = [
      { label: 'isolationDashboard', value: this.isolationDashboard },
      { label: 'tenant', value: this.selectedTenant }
    ]
    localStorage.setItem('isolationPreviousSelections', JSON.stringify(data));

  }

  // UI methods for dropdowns and selection handling

  onSelectionChange(event: any) {
    this.selectedTenant = event.value;
  }


  // Dashboard rendering methods

  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettings() {
    this.dashboardContainer = true;
    this.selectedTenantValue = this.selectedTenant === 'DomesticSector' ? 'tenant2' : 'tenant1';
    const headers = new HttpHeaders({
      'filterType': 'isolation',
      'tenant': this.selectedTenantValue,
      'isolationDashboard': this.isolationDashboard,
    });
    this.http.get<BoldBISettings>(this.boldbisettingsApi, { headers }).subscribe(
      (result) => {
        this.boldbisettings = result;
        this.loadDashboard();
      },
    );
  }

  // Create a BoldBI instance and load the required dashboard
  loadDashboard() {
    var option = {
      serverUrl: `${this.boldbisettings?.ServerUrl ?? ''}/${this.boldbisettings?.SiteIdentifier ?? ''}`,
      dashboardId: this.boldbisettings?.DashboardId,
      embedContainerId: "dashboard2",
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: "100%",
      height: "800px",
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          "filterType": 'isolation',
          'tenant': this.selectedTenantValue,
          'isolationDashboard': this.isolationDashboard,
        }
      },
      dashboardSettings: {
        showHeader: false,
      }
    };
    var dashboard = BoldBI.create(option);
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
