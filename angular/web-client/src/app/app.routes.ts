import { Routes } from '@angular/router';
import { DatasourceComponent } from './datasource/datasource.component';
import { HomeComponent } from './home/home.component';
import { IsolationComponent } from './isolation/isolation.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { WebdatasourceComponent } from './webdatasource/webdatasource.component'

export const routes: Routes =
   [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'datasource', component: DatasourceComponent },
      { path: 'isolation', component: IsolationComponent },
      { path: 'workflow/:filterType', component: WorkflowComponent },
      { path: 'dynamic-connection', component: DynamicComponent },
      { path: 'webdatasource', component: WebdatasourceComponent}
   ];
