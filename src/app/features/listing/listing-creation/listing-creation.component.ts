import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AiSuggestionsComponent} from '../../../shared/components/ai-suggestions/ai-suggestions.component';
import {SitePostService} from "../../../core/services/SitePostService";
import {SitePost} from "../../../core/models/listing.interface";

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

    constructor(private router: Router,
                private fb: FormBuilder,
                private sitePostService: SitePostService) {
    }

    ngOnInit(): void {
        this.listingForm = this.fb.group({
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
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    removePhoto(index: number) {
        this.images.splice(index, 1);
    }

    submitForm() {
        if (this.listingForm.valid) {
            this.sitePostService.addSitePost(this.listingForm.value,this.images).subscribe({
                    next: (response) => {
                        const sitePost = response as SitePost;
                        this.listingForm.reset();
                        console.log(response);
                        this.router.navigate(['/campaign',sitePost.idSitePost]);
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

    saveDraft(sitePost: SitePost) {

            if (this.listingForm.valid) {
                    this.sitePostService.addSitePost(this.listingForm.value,this.images).subscribe({
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
}
