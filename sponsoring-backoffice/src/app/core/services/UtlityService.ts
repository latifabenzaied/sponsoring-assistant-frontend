import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {SitePost} from "../models/SitePost";

@Injectable({
    providedIn: 'root'
})
export class UtlityService {
    private baseUrl = 'http://localhost:9091/api/v1';
    constructor(private http: HttpClient) {}


    getImageUrl(imagePath: string): Observable<string> {
        if (!imagePath) {
            return of('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop');
        }

        const fileName = imagePath.split('/').pop();
        return this.http.get(`${this.baseUrl}/images/${fileName}`, {
            responseType: 'text'
        });
    }
}