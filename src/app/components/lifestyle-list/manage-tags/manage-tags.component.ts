import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-tags',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-tags.component.html',
  styleUrl: './manage-tags.component.css'
})
export class ManageTagsComponent {

  Form!: FormGroup;
  tags: any;
  loading: boolean = false;
  tagId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.getAmenities();
  }

  initForm() {
    this.Form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }

  getAmenities() {
    this.service.get('admin/getAllTags').subscribe({
      next: (resp: any) => {
        this.tags = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
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
      this.service.post(this.tagId ? `admin/updateTag/${this.tagId}` : 'admin/createTag', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getAmenities();
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
    this.tagId = item.tag_id;
    this.Form.patchValue({
      name: item.name
    });
  }

  reset() {
    this.tagId = '';
    this.Form.patchValue({
      name: '',
    });
  }

  deleteProperty() {
    this.loading = true;
    this.service.delete(`admin/deleteTag/${this.tagId}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getAmenities();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
