import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MetaAdSet} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class MetaAdSetService {
    private readonly baseUrl = 'http://localhost:9093/api/v1/metaAdSet';

    constructor(private http: HttpClient) {
    }

    createAdSet(adSet: MetaAdSet): Observable<MetaAdSet> {
        return this.http.post<MetaAdSet>(this.baseUrl, adSet);
    }
}