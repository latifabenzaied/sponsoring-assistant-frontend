import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {SitePost} from "../models/SitePost";
import {SponsoredMappingService} from "./sponsoredAdMappingService";
import {SitePostService} from "./SitePostService";
import {MetaAd} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class MetaAdService {

    private readonly baseUrl = 'http://localhost:9093/api/v1/metaAd';

    constructor(private http: HttpClient,
                private mappingService: SponsoredMappingService,
                private sitePostService: SitePostService) {}

    getSitePostByMetaAdId(metaAdId: string): Observable<SitePost> {
        return this.mappingService.getSiteAdIdByMetaAdId(metaAdId).pipe(
            switchMap((siteAdId: number) => this.sitePostService.getSitePostById(siteAdId))
        );
    }

    getAllMetaAds(): Observable<MetaAd[]> {
        return this.http.get<MetaAd[]>(this.baseUrl);
    }

}