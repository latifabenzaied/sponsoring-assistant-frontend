import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SponsoredMappingService {

    private baseUrl = 'http://localhost:9093/api/v1/SponsoredAdMapping';

    constructor(private http: HttpClient) {}

    getSiteAdIdByMetaAdId(metaAdId: string): Observable<number> {
        const params = new HttpParams().set('metaAdId', metaAdId);
        return this.http.get<number>(`${this.baseUrl}/sitepost`, { params });
    }
}