import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ViewAllComponent } from './components/viewall/viewall.component';
import { CreateComponent } from './components/create/create.component';
import { CategoryComponent } from './components/category/category.component';
import { TrackComponent } from './components/track/track.component';

import { FilterPipe } from './pipes/filter.pipe';
import { Configuration } from './app.constants';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptor } from './auth/request.interceptor';

import { ChartsModule } from 'ng2-charts';
import { ToastyModule } from 'ng2-toasty';

const appRoutes: Routes = [
  { path: '', component: ViewAllComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'track', component: TrackComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ViewAllComponent,
    CreateComponent,
    CategoryComponent,
    FilterPipe,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule,
    ToastyModule.forRoot()
  ],
  providers: [
    Configuration,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
