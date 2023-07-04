import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResult, BaseService } from '../base.service';
import { Country } from '../countries/country';
import { City } from './city';
import { Apollo, gql } from 'apollo-angular'
@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<City> {
  constructor(http: HttpClient, private apollo: Apollo) {
    super(http);
  }
  getData(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string | null, filterQuery: string | null): Observable<ApiResult<City>> {
    var url = this.getUrl('api/cities');
    var params = new HttpParams()
      .set("pageIndex", pageIndex)
      .set("pageSize", pageSize)
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder)
    if (filterColumn && filterQuery) {
      params = params.set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery)
    }
    return this.http.get<ApiResult<City>>(url, { params });
  }

  get(id: number): Observable<City> {
    //var url = this.getUrl('api/cities/' + id);
    //return this.http.get<City>(url);
    return this.apollo.query({
      query: gql`
      query GetCityById($id: Int!) {
        cities(where: { id: { eq: $id } }) {
          nodes {
            id
            name
            lat
            lon
            countryId
          }
          }
          } `,
      variables: {
        id
      }
    }).pipe(map((result: any) => result.data.cities.nodes[0]));
  }

  put(item: City): Observable<City> {
    var url = this.getUrl('api/cities/' + item.id);
    return this.http.put<City>(url, item);
  }
  post(item: City): Observable<City> {
    var url = this.getUrl('api/cities');
    return this.http.post<City>(url, item);
  }
  getCountries(pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<ApiResult<Country>> {
    var url = this.getUrl("api/Countries");
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult<Country>>(url, { params });
  }
  isDupeCity(item: City): Observable<boolean> {
    var url = this.getUrl("api/Cities/isDupeCity");
    return this.http.post<boolean>(url, item);
  }
}

