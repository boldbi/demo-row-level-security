import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BoldBI } from '@boldbi/boldbi-embedded-sdk';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-userfilter',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './userfilter.component.html',
  styleUrl: './userfilter.component.scss'
})
export class UserfilterComponent {

  public loginForm: FormGroup;
  public loginError: string | null = null;
  public logincontainer = true;
  public username = '';
  public password = '';
  public messagecontainer = false;
  public selectedUserName: string = '';

  constructor(private http: HttpClient, private router: Router, private renderer: Renderer2) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  // API endpoints for authorization and retrieving BoldBI settings
  private readonly authorizationApi = 'http://localhost:5023/api/dashboard/authorize';
  private readonly boldbisettingsApi = 'http://localhost:5023/api/dashboard/getboldbisettings';

  // BoldBI settings object to hold retrieved settings from the backend
  private boldbisettings: BoldBISettings | null = null;

  // Flag to control visibility of the dashboard container
  public dashboardContainer: boolean = false;

  // Flag to control visibility of the workflow container
  public workflowContainer: boolean = false;

  public selectedTeacher: string = '';

  validCredentials: { username: string, password: string }[] = [
    { username: 'Smith', password: 'smith@123' },
    { username: 'Johnson', password: 'johnson@123' },
    { username: 'patel', password: 'patel@123' }
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
    var value = localStorage.getItem('userfilterPreviousSelections');
    if (value) {
      this.selectedTeacher = value;
    }
    localStorage.removeItem('userfilterPreviousSelections');
  }

  // To retireve previous data from the local storage 
  setData(): void {
    localStorage.setItem('userfilterPreviousSelections', this.selectedTeacher);
  }

  // Used to open the workflow diagram
  openWorkFlow() {
    this.workflowContainer = true;
  }
  
  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    const isValidUser = this.validCredentials.some(
      cred => cred.username.toLowerCase() === username.toLowerCase() && cred.password.toLowerCase() === password.toLowerCase()
    );
    if(username.toLowerCase() == 'smith')
    {
      this.selectedUserName = 'Smith Carlson';
    }
    else if(username.toLowerCase() == 'patel')
    {
      this.selectedUserName = 'Patel Singh';
    }
    else if(username.toLowerCase() == 'johnson')
    {
      this.selectedUserName = 'Johnson Brown'
    }
    if (isValidUser) {
      switch (username.toLowerCase()) {
        case 'smith':
          this.selectedTeacher = 'teacher1';
          break;
        case 'johnson':
          this.selectedTeacher = 'teacher2';
          break;
        case 'patel':
          this.selectedTeacher = 'teacher3';
          break;
      }
      this.logincontainer = false;
      this.messagecontainer =  true;
      this.fetchBoldBISettings();
    } else {
      this.loginError = 'Invalid username or password.';
    }
  }

  logout() {
    this.loginForm.reset();
    this.logincontainer = true;
    this.messagecontainer = false;
    this.selectedUserName = '';
    this.dashboardContainer = false;
    this.loginError = '';
  }


  // Fetch BoldBI settings from the backend and prepare for dashboard rendering
  fetchBoldBISettings() {
    this.dashboardContainer = true;
    const headers = new HttpHeaders({
      'filterType': 'userfilter',
      'user': this.selectedTeacher
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
      embedContainerId: 'dashboard6',
      embedType: BoldBI.EmbedType.Component,
      environment: this.boldbisettings?.Environment,
      mode: BoldBI.Mode.View,
      width: '100%',
      height: '800px',
      authorizationServer: {
        url: this.authorizationApi,
        headers: {
          'filterType': 'userfilter',
          'user': this.selectedTeacher
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
