
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {MetaCampaign} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class MetaApiService {
    private readonly baseUrl = 'http://localhost:9093/api/v1/metaCampaign'; // adapte à ton backend

    constructor(private http: HttpClient) {}

    createMetaCampaign(campaign: MetaCampaign): Observable<MetaCampaign> {
       /* return this.http.post<MetaCampaign>(`${this.baseUrl}`, campaign);*/
        const fakeResponse: MetaCampaign = {
            name:'gg',
            objective: 'TRAFFIC',
            status: 'PAUSED',
            metaCampaignId:'6862220461740'
        };

        return of(fakeResponse);
    }
}