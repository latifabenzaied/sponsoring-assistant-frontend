import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {Ad} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class AdService {

    private baseUrl = 'http://localhost:9093/api/v1/ad';

    constructor(private http: HttpClient) {}

    addAd(ad: Ad, idPost: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/${idPost}`, ad);
    }
}