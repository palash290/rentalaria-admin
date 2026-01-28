import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-property-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './property-type.component.html',
  styleUrl: './property-type.component.css'
})
export class PropertyTypeComponent {

  Form!: FormGroup;
  property: any;
  filteredData: any[] = [];
  searchText: string = '';
  loading: boolean = false;
  ptId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.getPropertyTypes();
  }

  initForm() {
    this.Form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  getPropertyTypes() {
    this.service.get('admin/propertyType').subscribe({
      next: (resp: any) => {
        this.property = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    let filtered = this.property;

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
      this.service.post(this.ptId ? `admin/propertyType/${this.ptId}` : 'admin/propertyType', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getPropertyTypes();
            // this.phaseId = null;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
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
    this.ptId = item.property_type_id;
    this.Form.patchValue({
      name: item.name
    });
  }

  reset() {
    this.ptId = '';
    this.Form.patchValue({
      name: '',
    });
  }


}
