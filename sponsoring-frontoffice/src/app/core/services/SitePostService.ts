// src/app/core/services/site-post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SitePost} from "../models/listing.interface";

@Injectable({
    providedIn: 'root'
})
export class SitePostService {
    private baseUrl = 'http://localhost:9091/api/v1/sitePost';

    constructor(private http: HttpClient) {}

    addSitePost(sitePost: any, images: File[]) {
        const formData = new FormData();
        formData.append('sitePost', JSON.stringify(sitePost));
        images.forEach((image) => {
            formData.append('images', image);
        });
        const debugFormData = formData as any;

        return this.http.post(this.baseUrl, formData);
    }

    getSitePostById(id: number | undefined): Observable<SitePost> {
        return this.http.get<SitePost>(`${this.baseUrl}/${id}`);
    }


    getAllSitePosts(): Observable<SitePost[]> {
        return this.http.get<SitePost[]>(`${this.baseUrl}`);
    }

    updateSitePost(id: number, post: SitePost): Observable<SitePost> {
        return this.http.post<SitePost>(`${this.baseUrl}/${id}`, post);
    }

    deleteSitePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
