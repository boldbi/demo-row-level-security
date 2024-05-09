import { Routes } from '@angular/router';
import { DatasourceComponent } from './datasource/datasource.component';
import { HomeComponent } from './home/home.component';
import { IsolationComponent } from './isolation/isolation.component';
import { WorkflowComponent } from './workflow/workflow.component';

export const routes: Routes =
   [
      { path: '', redirectTo: '/datasource', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'datasource', component: DatasourceComponent },
      { path: 'isolation', component: IsolationComponent },
      { path: 'workflow/:filterType', component: WorkflowComponent }
   ];
