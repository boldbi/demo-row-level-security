import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BoldBI } from '@boldbi/boldbi-embedded-sdk';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-datasource',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss']
})
export class DatasourceComponent {

  constructor(private http: HttpClient, private router: Router) { }

  // API endpoints for authorization and retrieving BoldBI settings
  private readonly authorizationApi = 'http://localhost:5023/api/dashboard/authorize';
  private readonly boldbisettingsApi = 'http://localhost:5023/api/dashboard/getboldbisettings';

  // BoldBI settings object to hold retrieved settings from the backend
  private boldbisettings: BoldBISettings | null = null;

  // Flag to control visibility of the dashboard container
  public dashboardContainer: boolean = false;

  // Options for regions and category dropdowns
  regions: string[] = ['Central', 'East', 'West', 'North', 'South'];
  selectedRegions: string[] = [];
  selectedCategory: string = '';
  dropdownOpenCategory: boolean = false;
  dropdownOpen: boolean = false;
  selectedcat: string = '';

  // Options for category selection dropdown
  public categoryOptions: any[] = [
    { value: 'Home Decor', label: 'John - Home Decor' },
    { value: 'Clothing', label: 'Micheal - Clothing' },
    { value: 'Electronics', label: 'Alice - Electronics' },
    { value: 'Automotives', label: 'Sarah - Automotives' }
  ];

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
    const storedDataString = localStorage.getItem('datasourcePreviousSelections');
    if (storedDataString) {
      const storedData: any[] = JSON.parse(storedDataString);
      storedData.forEach(item => {
        switch (item.label) {
          case 'category':
            this.selectCategory(item.value);
            break;
          case 'region':
            this.selectedRegions = item.value;
            break;
        }
      });
    }
    localStorage.removeItem('datasourcePreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    var data: any[] = [
      { label: 'category', value: this.selectedCategory },
      { label: 'region', value: this.selectedRegions }
    ]
    localStorage.setItem('datasourcePreviousSelections', JSON.stringify(data));
  }

  // UI methods for dropdowns and selection handling

  // Toggle visibility of regions dropdown
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Close regions dropdown
  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Check if a region is selected in the regions dropdown
  isChecked(region: string): boolean {
    return this.selectedRegions.indexOf(region) !== -1;
  }

  // Toggle visibility of category dropdown
  toggleDropdownCategory() {
    this.dropdownOpenCategory = !this.dropdownOpenCategory;
  }

  // Close category dropdown
  closeDropdownCategory() {
    this.dropdownOpenCategory = false;
  }

  // Select a category from the category dropdown
  selectCategory(value: any) {
    this.selectedCategory = value;
    this.dropdownOpenCategory = false;
  }

  // Handle multiple selection in the regions dropdown
  toggleSelection(region: string) {
    const index = this.selectedRegions.indexOf(region);
    if (index === -1) {
      this.selectedRegions.push(region);
    } else {
      this.selectedRegions.splice(index, 1);
    }
  }

  // Dashboard rendering methods

  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettings() {
    this.selectedcat = this.selectedCategory.split('-')[1].trim();
    this.dashboardContainer = true;
    const headers = new HttpHeaders({
      'filterType': 'datasource'
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
      embedContainerId: 'dashboard',
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: '100%',
      height: '800px',
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          'filterType': 'datasource',
          'Regions': this.selectedRegions.join(','),
          'Category': this.selectedcat,
        }
      },
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
