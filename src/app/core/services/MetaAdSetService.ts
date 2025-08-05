import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MetaAdSet, MetaStatus} from "../models/MetaCampaign";

@Injectable({
    providedIn: 'root'
})
export class MetaAdSetService {
    private readonly baseUrl = 'http://localhost:9093/api/v1/metaAdSet';

    constructor(private http: HttpClient) {
    }

    createAdSet(adSet: MetaAdSet): Observable<MetaAdSet> {
        return this.http.post<MetaAdSet>(this.baseUrl, adSet);
    /*    const fakeAdSet: MetaAdSet = {
            name: "Test Ad Set - Summer Campaign",
            metaAdSetId: "6863666051340",
            dailyBudget: 1000,
            billingEvent: "IMPRESSIONS",
            optimizationGoal: "REACH",
            status:MetaStatus.PAUSED, // ou "ACTIVE" selon ton enum MetaStatus
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 jours
            targetingJson: JSON.stringify({
                geo_locations: { countries: ["FR"] },
                age_min: 18,
                age_max: 45,
                interests: [{ id: "6003139266461", name: "Technology" }],
            }),
            bidAmount: 150,
            bidStrategy: "LOWEST_COST_WITHOUT_CAP",
            bidConstraints: JSON.stringify({
                user_groups: "young_adults",
                platform: "facebook",
            }),
            metaCampaignId: "123456789012345", // ID fictif de campagne
            ads: [], // Aucun Ad au départ
        };
        return of(fakeAdSet);*/
    }
}