import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup ,Validators,AsyncValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from './../../../src/environments/environment';
import { City } from './city';
import { Country } from './../countries/country';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base-form.component';
import { CityService } from './city.service';
@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title?: string;
  // the city object to edit
  city?: City;
  // the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not NULL when we're editing an existing one.
  id?: number;
  // the countries array for the select
  countries?:Observable<Country[]>;
  constructor(private activatedRoute: ActivatedRoute, private router: Router,private cityService:CityService) {
  super()}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('',[Validators.required]),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      lon: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      countryId:new FormControl('',Validators.required)
    }, null, this.isDupeCity());
    this.form.valueChanges.subscribe(() => {
      if (!this.form.dirty) {
        this.log("Form Model has been loaded.")
      }
      else {
        this.log('Form was updated by the user.');
      }
    });
    this.loadData();
  }
  log(str: string) {
    console.log( '[' + new Date().toLocaleString() + ']' + str);
  }
  loadData() {
    //load countries
    this.loadCountries();
    // retrieve the ID from the 'id' parameter
    var idparam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idparam ? +idparam : 0;
    if (this.id) {
      //Edit mode
      // fetch the city from the server
      this.cityService.get(this.id)
        .subscribe({
        next: result => {
          this.city = result;
          this.title = "Edit - " + this.city.name;
          this.form.patchValue(this.city);
        }
        , error: err => console.log(err.error)
      });
    }
    else {
      // ADD NEW MODE
      this.title = "Create a new City";
    }
  }
  loadCountries() {
    // fetch all the countries from the server
this.cityService.getCountries(0,9999,"name",'asc',null,null)
   .pipe(map(x=>x.data))
  }
  onSubmit() {
    var city = this.id ? this.city : <City>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;
      if (this.id) {
        // EDIT mode
        this.cityService.put(city)
        .subscribe({
          next: result => {
            console.log("city " + city!.id + " has been updated");
            // go back to cities view
            this.router.navigate(['/cities']);
          }
          , error: err => console.log(err)
        });
      }
      else {
        // ADD NEW mode
        this.cityService.post(city).
       subscribe({
          next: result => {
            console.log("City " + result.id + " has been created.");
            this.router.navigate(['/cities']);
          }
        ,error:err=>console.error(err)})
      };
    }
  }
  isDupeCity():AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = this.form.controls['countryId'].value;
      var url = environment.baseUrl + 'api/cities/isDupeCity';
      return this.cityService.isDupeCity(city).pipe(map(
        result => result ? { isDupeCity: true } : null)) // isDupeCity is the error name
    };
  };
}
