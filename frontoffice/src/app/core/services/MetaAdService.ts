import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MetaAd} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class MetaAdService {
    private readonly baseUrl = 'http://localhost:9093/api/v1/metaAd';
    constructor(private http: HttpClient) {}
    createAd(ad: MetaAd): Observable<MetaAd> {
        return this.http.post<MetaAd>(this.baseUrl, ad, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}