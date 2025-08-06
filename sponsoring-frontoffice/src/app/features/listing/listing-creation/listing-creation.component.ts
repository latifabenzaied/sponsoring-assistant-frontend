import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AiSuggestionsComponent} from '../../../shared/components/ai-suggestions/ai-suggestions.component';
import {SitePostService} from "../../../core/services/SitePostService";
import {SitePost} from "../../../core/models/listing.interface";
import {AiSocketService} from "../../../core/services/ai-socket.service";
import {debounceTime} from "rxjs";
import {AiImageSocketService} from "../../../core/services/AiImageSocketService";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-listing-creation',
    standalone: true,
    imports: [CommonModule,
        FormsModule,
        AiSuggestionsComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './listing-creation.component.html',
    styleUrls: ['./listing-creation.component.css']
})
export class ListingCreationComponent implements OnInit {

    listingForm!: FormGroup;
    images: File[] = [];
    imagePreviews: string[] = [];
    imageSuggestions: { [key: string]: string } = {};
    autoSuggestFields = ['description', 'title', 'price']; // champs à re-suggérer
    contextFields = ['propertyType', 'type', 'area', 'bedRoomsNb', 'bathRoomsNb', 'location', 'furnished', 'price']; // champs déclencheurs
    suggestions: { [field: string]: string } = {};//map
    showPopup = false;
    validationMessages: string[] = [];

    constructor(private router: Router,
                private fb: FormBuilder,
                private sitePostService: SitePostService,
                private aiSocketService: AiSocketService,
                private aiImageSocketService: AiImageSocketService
    ) {
    }

    ngOnInit(): void {
        this.listingForm = this.buildListingForm();
        this.subscribeToContextChanges();

        this.aiSocketService.onMessage().subscribe((data) => {
            this.suggestions = {
                ...this.suggestions,
                [data.field]: data.suggestion
            };
        });

        this.aiImageSocketService.onMessage().subscribe((data) => {
            const {filename, analysis} = data;
            console.log(data.analysis);
            if (analysis) {
                this.imageSuggestions[`image:${filename}`] = analysis;

            }
        });

    }

    buildListingForm(): FormGroup {
        return this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            propertyType: ['', Validators.required],
            type: ['', Validators.required],
            price: [null, [Validators.required, Validators.min(0)]],
            area: [null, [Validators.required, Validators.min(0)]],
            bedRoomsNb: [null],
            bathRoomsNb: [null],
            location: ['', Validators.required],
            availability: [''],
            status: ['DRAFT'],
            furnished: [false],
            isSponsored: [false]
        });
    }


    private convertImageToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    private async handleImageAnalysis(file: File): Promise<void> {
        try {
            const base64Full = await this.convertImageToBase64(file);
            const base64 = base64Full.split(',')[1];
            this.aiImageSocketService.sendImageBase64(file.name, base64);
        } catch (error) {
            console.error("Erreur d’analyse d’image :", error);
        }
    }

    onFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            Array.from(target.files).forEach(file => {
                this.images.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = e.target?.result as string;
                    if (preview) {
                        this.imagePreviews.push(preview);
                        this.handleImageAnalysis(file);

                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }


    getImageSuggestionKey(file: File): string {
        return `image:${file.name}`;
    }

    removePhoto(index: number): void {
        const file = this.images[index];
        const keyToRemove = this.getImageSuggestionKey(file);
        if (keyToRemove in this.imageSuggestions) {
            const {[keyToRemove]: _, ...updated} = this.imageSuggestions;
            this.imageSuggestions = {...updated}; // force déclenchement de ngOnChanges
            console.log('✅ Suggestion supprimée pour :', keyToRemove);
        } else {
            console.warn('❌ Clé non trouvée :', keyToRemove);
        }

        this.images.splice(index, 1);
        this.imagePreviews.splice(index, 1);
    }


    openSimplePopup(errors: any) {
        this.validationMessages = Object.values(errors).map((msg) => {
            const messageStr = msg as string;
            const parts = messageStr.split(':');
            return parts.length > 1 ? parts.slice(1).join(':').trim() : messageStr;
        });

        this.showPopup = true;

        setTimeout(() => {
            this.showPopup = false;
        }, 5000);
    }

    submitForm() {
        if (this.listingForm.valid) {
            this.sitePostService.addSitePost(this.listingForm.value, this.images).subscribe({
                    next: (response) => {
                        const sitePost = response as SitePost;
                        console.log(sitePost.idSitePost);
                        this.router.navigate(['/campaign', sitePost.idSitePost]);
                        this.listingForm.reset();
                    },
                    error: (err) => {
                        if (err.status === 400 && err.error) {
                            if (typeof err.error === 'object') {
                                this.openSimplePopup(err.error);
                            } else {
                                this.openSimplePopup({erreur: 'Erreur inattendue : ' + err.error});
                            }
                        } else {
                            this.openSimplePopup({erreur: 'Erreur serveur inconnue'});
                        }
                    }
                }
            )
        } else {

            this.listingForm.markAllAsTouched();
            this.openSimplePopup({erreur: 'Veuillez compléter tous les champs obligatoires avant de poursuivre'});
            return;
        }
    }

    saveDraft(sitePost: SitePost) {

        if (this.listingForm.valid) {
            this.sitePostService.addSitePost(this.listingForm.value, this.images).subscribe({
                    next: (response) => {
                        this.listingForm.reset();
                    },
                    error: (err) => {
                        console.error("Error submitting complaint:", err);
                    }
                }
            )
        } else {
            this.listingForm.markAllAsTouched();
        }
    }

    onFieldBlur(field: string): void {
        //     const control = this.listingForm.get(field);
        //     const value = control?.value;
        //     const fullForm = this.listingForm.value;
        //
        //     if (value !== null && value !== undefined) {
        //         const strValue = value.toString();
        //         if (strValue.trim() !== '') {
        //             console.log(field, value, fullForm);
        //             this.aiSocketService.send(field, value, fullForm);
        //         }
        //     }
    }

    subscribeToContextChanges(): void {
        const excludedFields = ['status', 'isSponsored'];

        this.contextFields.forEach((contextField) => {
            const control = this.listingForm.get(contextField);

            if (control) {
                control.valueChanges.pipe(debounceTime(500)).subscribe(() => {
                    const formData = this.listingForm.value;

                    // On nettoie le formData pour supprimer les champs inutiles
                    const context = Object.fromEntries(
                        Object.entries(formData).filter(([key]) => !excludedFields.includes(key))
                    );

                    this.autoSuggestFields.forEach((targetField) => {
                        const value = this.listingForm.get(targetField)?.value;

                        if (value && value.toString().trim().length >= 3) {
                            console.log('📤 Sending to AI socket:', {
                                field: targetField,
                                content: value,
                                context: context,
                            });

                            this.aiSocketService.send(targetField, value, context);
                        }
                    });
                });
            }
        });
    }

    onSuggestionApplied(event: { field: string, value: string }): void {
        if (this.listingForm.controls[event.field]) {

            this.listingForm.controls[event.field].setValue(event.value);
        } else {
            console.warn(` Le champ ${event.field} n'existe pas dans le formulaire`);
        }
    }


}
