import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-add-property',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent {

  Form!: FormGroup;
  loading: boolean = false;
  selectedImages: any[] = [];
  deleteIds: number[] = [];
  property_id: any;
  selectedLocations: string[] = [];
  selectedRules: string[] = [];
  allAmenity: any;
  allCity: any;
  minDate: any;
  selectedAmenityIds: number[] = [];
  propertyTypes: any;
  @ViewChild('drEmail') drEmail!: ElementRef<HTMLButtonElement>;
  @ViewChild('houseRules') houseRules!: ElementRef<HTMLButtonElement>;
  public Editor: any = ClassicEditor;
  public content = '';
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'fontSize',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo'
      ]
    },
    fontSize: {
      options: [
        12,
        14,
        16,
        18,
        20,
        24,
        28,
        'default'
      ]
    },
    image: {
      toolbar: []
    }
  };


  constructor(private fb: FormBuilder, private toastr: NzMessageService, private route: Router,
    private service: CommonService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.property_id = this.router.snapshot.queryParamMap.get('property_id');
    this.Form = this.fb.group({
      property_name: ['', [Validators.required]],
      // description: ['', [Validators.required]],
      city: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      sq_foot: ['', [Validators.required]],
      type: ['', [Validators.required]],
      bedrooms: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      bathroom: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      // houseRules: ['', [Validators.required]],
      // rent: ['', [Validators.required]],
      rent: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*(\.\d+)?$/)
      ]],
      deposit: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*(\.\d+)?$/)
      ]],
      availableFrom: ['', [Validators.required]],
    });
    if (this.property_id) {
      this.getPropertyDetails();
    }
    this.getAmenities();
    this.dateValidation();
  }

  getPropertyDetails() {
    this.service.get(`admin/get-property-details/${this.property_id}`).subscribe({
      next: (resp: any) => {

        this.Form.patchValue({
          property_name: resp.data.property_name,
          // description: resp.data.property_description || '',
          city: resp.data.city_id,
          // address: resp.data.address,
          type: resp.data.property_type_id,
          sq_foot: resp.data.square_footage,
          bedrooms: resp.data.total_bedrooms,
          bathroom: resp.data.total_bathrooms,
          houseRules: resp.data.house_rules,
          rent: resp.data.monthly_rent,
          deposit: resp.data.security_deposit,
          availableFrom: this.formatToYMD(resp.data.available_from)
        });
        this.selectedRules = JSON.parse(resp.data.house_rules);
        this.selectedLocations = JSON.parse(resp.data.nearby_property_location);
        // this.selectedImages = resp.data.images;

        this.content = resp.data.property_description || '';
        this.terminalName = resp.data.address;
        // debugger
        this.latitude = Number(resp.data.latitude);
        this.longitude = Number(resp.data.longitude);

        this.selectedImages = [];

        // API IMAGES
        resp.data.images.forEach((img: any) => {
          this.selectedImages.push({
            id: img.id,
            file: null,
            url: img.file,
            type: 'image'
          });
        });

        // API VIDEO (only one)
        resp.data.videos.forEach((vid: any) => {
          this.selectedImages.push({
            id: vid.id,
            file: null,
            url: vid.file,
            type: 'video'
          });
        });


        this.selectedAmenityIds = resp.data.amenities.map(
          (a: any) => a.amenity_id
        );
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  formatToYMD(date: any): string {
    const d = this.ensureDate(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  ensureDate(date: any): Date {
    if (date instanceof Date) {
      return date;
    }

    // handles "2026-01-19" and ISO strings
    const [y, m, d] = date.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  dateValidation() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  getAmenities() {
    this.service.get('admin/amenities').subscribe({
      next: (resp: any) => {
        this.allAmenity = resp.data;
        this.getPropertyTypes();
        this.getCities();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getCities() {
    this.service.get('admin/getAllcity').subscribe({
      next: (resp: any) => {
        this.allCity = resp.data;
        this.getPropertyTypes();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getPropertyTypes() {
    this.service.get('admin/propertyType').subscribe({
      next: (resp: any) => {
        this.propertyTypes = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    this.Form.markAllAsTouched();

    // basic validation
    if (this.Form.invalid) {
      this.toastr.warning('Please check all the fields!');
      return;
    }

    // at least one image validation
    if (!this.selectedImages.length) {
      this.toastr.warning('Please upload at least one image');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    /* ---------------- BASIC DETAILS ---------------- */
    formData.append('property_name', this.Form.value.property_name);
    // formData.append('property_description', this.Form.value.description);
    formData.append('property_description', this.content);
    // formData.append('property_location', this.Form.value.location);
    formData.append('city_id', this.Form.value.city);
    // formData.append('address', this.Form.value.address);
    formData.append('address', this.terminalName);

    formData.append('latitude', this.latitude);
    formData.append('longitude', this.longitude);

    /* ---------------- NEARBY LOCATIONS ---------------- */
    formData.append(
      'nearby_property_location',
      JSON.stringify(this.selectedLocations)
    );

    /* ---------------- AMENITIES ---------------- */
    formData.append(
      'amenities',
      this.selectedAmenityIds.join(',')
    );

    /* ---------------- PROPERTY DETAILS ---------------- */
    formData.append('square_footage', this.Form.value.sq_foot);
    formData.append('property_type_id', this.Form.value.type);
    formData.append('total_bedrooms', this.Form.value.bedrooms);
    formData.append('total_bathrooms', this.Form.value.bathroom);

    /* ---------------- HOUSE RULES ---------------- */
    // formData.append('house_rules', this.Form.value.houseRules);
    formData.append(
      'house_rules',
      JSON.stringify(this.selectedRules)
    );

    /* ---------------- PRICING ---------------- */
    formData.append('monthly_rent', this.Form.value.rent);
    formData.append('security_deposit', this.Form.value.deposit);
    formData.append('available_from', this.Form.value.availableFrom);

    // append deleteIds when updating
    if (this.property_id && this.deleteIds.length) {
      formData.append('delete_image_ids', this.deleteIds.join(','));
    }


    /* ---------------- IMAGES & VIDEOS ---------------- */
    this.selectedImages.forEach((item: any, i: number) => {
      if (item.file) {
        formData.append('files', item.file);
      }
    });

    /* ---------------- API CALL ---------------- */
    this.service.post(this.property_id ? `admin/update-property/${this.property_id}` : 'admin/create-property', formData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.Form.reset();
          this.selectedImages = [];
          this.selectedAmenityIds = [];
          this.selectedLocations = [];
          this.route.navigateByUrl('/home/property-list');
        } else {
          this.toastr.warning(resp.message);
        }
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Something went wrong.');
        this.loading = false;
      }
    });
  }


  increaseBedrooms() {
    const current = this.Form.controls['bedrooms'].value || 0;
    this.Form.controls['bedrooms'].setValue(current + 1);
  }

  decreaseBedrooms() {
    const current = this.Form.controls['bedrooms'].value || 0;

    if (current > 0) {
      this.Form.controls['bedrooms'].setValue(current - 1);
    }
  }

  increaseBathroom() {
    const current = this.Form.controls['bathroom'].value || 0;
    this.Form.controls['bathroom'].setValue(current + 1);
  }

  decreaseBathroom() {
    const current = this.Form.controls['bathroom'].value || 0;

    if (current > 0) {
      this.Form.controls['bathroom'].setValue(current - 1);
    }
  }

  onAmenityChange(event: Event, amenityId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedAmenityIds.push(amenityId);
    } else {
      this.selectedAmenityIds = this.selectedAmenityIds.filter(
        amenity_id => amenity_id !== amenityId
      );
    }

    console.log('Selected Amenities:', this.selectedAmenityIds);
  }

  removeLocation(index: number) {
    this.selectedLocations.splice(index, 1);
  }

  addLocation(email: string) {
    const trimmedEmail = email.trim();

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!trimmedEmail) {
      return;
    }

    // Check valid email
    // if (!emailRegex.test(trimmedEmail)) {
    //   this.toastr.error('Please enter a valid email address');
    //   return;
    // }

    // Check duplicate email
    if (this.selectedLocations.includes(trimmedEmail)) {
      this.toastr.error('Location already added');
      return;
    }

    // Add email
    this.selectedLocations.push(trimmedEmail);
    this.drEmail.nativeElement.value = '';
  }

  removeRules(index: number) {
    this.selectedRules.splice(index, 1);
  }

  addRule(email: string) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    // Check duplicate email
    if (this.selectedRules.includes(trimmedEmail)) {
      this.toastr.error('Location already added');
      return;
    }

    // Add email
    this.selectedRules.push(trimmedEmail);
    this.houseRules.nativeElement.value = '';
  }


  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    Array.from(target.files).forEach(file => {
      const fileType = file.type;

      // IMAGE
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            file,
            url: e.target.result,
            type: 'image'
          });
        };
        reader.readAsDataURL(file);
      }

      // VIDEO (ONLY ONE TOTAL)
      else if (fileType === 'video/mp4') {

        if (this.hasVideo()) return;

        const videoURL = URL.createObjectURL(file);
        this.selectedImages.push({
          file,
          url: videoURL,
          type: 'video'
        });
      }
    });

    target.value = '';
  }


  hasVideo(): boolean {
    return this.selectedImages.some(item => item.type === 'video');
  }

  removeImage(index: number): void {
    debugger
    const img = this.selectedImages[index];

    // when file === null, it means it's from backend and contains the 'id'
    if (img.id) {
      this.deleteIds.push(img.id);
    }

    this.selectedImages.splice(index, 1);
  }


  terminalName: any;
  isSearchActiveFrom = false;
  allTerminalsList: any;
  selectedUkraneCityName: any;
  latitude: any;
  longitude: any;

  isTouched: any = {
    stopName: false,
    terminalName: false
  };

  searchTerminal() {
    if (this.terminalName == '') {
      this.isSearchActiveFrom = false;
      return
    }

    this.isSearchActiveFrom = true;

    const formData = new URLSearchParams();
    formData.append('location', this.terminalName);

    this.service
      .post('admin/get-location', formData.toString())
      .subscribe((res: any) => {
        if (res.success == true) {
          this.allTerminalsList = res.data;
        }
      });
  };

  onBlur(fieldName: string): void {
    this.isTouched[fieldName] = true;
  }

  searchByFromCity(item: any, selectedName?: any) {
    this.terminalName = selectedName ? selectedName : item.description;
    this.isSearchActiveFrom = false;
    this.getLetLongUkrane();
  };

  getLetLongUkrane() {
    const formURlData = new URLSearchParams();
    formURlData.set('address', `${this.terminalName}`);

    this.service.post('admin/get-lat-long', formURlData.toString()).subscribe((response: any) => {
      if (response.success) {
        // this.letLong = response.data;
        this.latitude = response.data.lat;
        this.longitude = response.data.lng;
      }
    });
  }


}
