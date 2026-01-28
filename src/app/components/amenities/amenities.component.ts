import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-amenities',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './amenities.component.html',
  styleUrl: './amenities.component.css'
})
export class AmenitiesComponent {

  Form!: FormGroup;
  amenity: any;
  filteredData: any[] = [];
  searchText: string = '';
  loading: boolean = false;
  amenityId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.getAmenities();
  }

  initForm() {
    this.Form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  getAmenities() {
    this.service.get('admin/amenities').subscribe({
      next: (resp: any) => {
        this.amenity = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    let filtered = this.amenity;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { name: any; }) =>
        (item.name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  onSubmit() {
    this.Form.markAllAsTouched();

    const title = this.Form.value.name?.trim();

    if (!title) {
      return;
    }

    if (this.Form.valid) {
      this.loading = true;
      const formURlData: any = new URLSearchParams();
      formURlData.append('name', title);
      this.service.post(this.amenityId ? `admin/amenity/${this.amenityId}` : 'admin/amenity', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getAmenities();
            // this.phaseId = null;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getAmenities();
          }
        },
        error: (error) => {
          this.loading = false;

          const msg =
            error.error?.message ||
            error.error?.error ||
            error.message ||
            "Something went wrong!";

          this.toastr.error(msg);
        }
      });
    } else {
      this.loading = false;
      this.toastr.warning('Please check all the fields!');
    }
  }

  getId(item: any) {
    this.amenityId = item.amenity_id;
    this.Form.patchValue({
      name: item.name
    });
  }

  reset() {
    this.amenityId = '';
    this.Form.patchValue({
      name: '',
    });
  }


}
