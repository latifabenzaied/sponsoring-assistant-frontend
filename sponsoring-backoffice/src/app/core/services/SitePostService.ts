import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SitePost} from "../models/SitePost";

@Injectable({
    providedIn: 'root'
})
export class SitePostService {
    private baseUrl = 'http://localhost:9091/api/v1/sitePost';
    constructor(private http: HttpClient) {}

    getAllSitePosts(): Observable<SitePost[]> {
        return this.http.get<SitePost[]>(this.baseUrl);
    }

    getSitePostById(id: number): Observable<SitePost> {
        return this.http.get<SitePost>(`${this.baseUrl}/${id}`);
    }
}