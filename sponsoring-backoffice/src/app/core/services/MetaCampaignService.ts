import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetaCampaign } from '../models/MetaCampaign';

@Injectable({
    providedIn: 'root'
})
export class MetaAdsService {
    private baseUrl = 'http://localhost:9093/api/v1/metaCampaign';

    constructor(private http: HttpClient) {}

    getCampaigns(): Observable<MetaCampaign[]> {
        return this.http.get<MetaCampaign[]>(`${this.baseUrl}`);
    }
}