import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MetaAdCreativeDto} from "../models/MetaCampaign";


@Injectable({
    providedIn: 'root'
})
export class MetaAdCreativeService {

    private baseUrl = 'http://localhost:9093/api/v1/metaAdCreative'; // adapte à ton chemin réel

    constructor(private http: HttpClient) {}

    getAdCreativeById(idAdCretive: string): Observable<MetaAdCreativeDto> {
        return this.http.get<MetaAdCreativeDto>(`${this.baseUrl}/${idAdCretive}`);
    }
}
