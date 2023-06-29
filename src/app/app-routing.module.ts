import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { CitiesComponent } from './cities/cities.component';
import { CityEditComponent} from './cities/city-edit.component';
import { CountriesComponent } from './countries/countries.component';
import {CountryEditComponent } from './countries/country-edit.component'
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';
const routes:Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'city/:id', component: CityEditComponent, canActivate: [AuthGuard] },
  { path: 'city', component: CityEditComponent, canActivate: [AuthGuard] },
  { path: 'country/:id', component: CountryEditComponent, canActivate: [AuthGuard] },
  { path: 'country', component: CountryEditComponent, canActivate: [AuthGuard] },
  {path:'login',component:LoginComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
