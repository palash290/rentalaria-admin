import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-insta-images',
  imports: [RouterLink, CommonModule],
  templateUrl: './insta-images.component.html',
  styleUrl: './insta-images.component.css'
})
export class InstaImagesComponent {

  selectedImages: any[] = [];
  deleteIds: number[] = [];
  loading: boolean = false;
  // replacedImageId: any;

  constructor(private toastr: NzMessageService, private service: CommonService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.get('admin/getInstagram-Images').subscribe({
      next: (resp: any) => {
        // this.selectedImages = resp.data.images;
        resp.data.forEach((img: any) => {
          this.selectedImages.push({
            id: img.id,
            file: null,
            url: img.image_name,
            type: 'image'
          });
        });
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    if (!this.selectedImages.length) {
      this.toastr.warning('Please upload at least one image');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    // upload ONLY newly selected files
    this.selectedImages.forEach((img: any) => {
      if (img.file) {
        formData.append('files', img.file);
      }
    });

    // if replacing image
    // if (this.replacedImageId) {
    //   formData.append('id', this.replacedImageId.toString());
    // }

    // delete only when no replacement
    if (this.deleteIds.length) {
      formData.append('delete_image', this.deleteIds.join(','));
    }

    /* ---------------- API CALL ---------------- */
    this.service.post('admin/upload-images', formData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.selectedImages = []
          this.toastr.success(resp.message);
          this.loadData();
          this.deleteIds = [];
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
    });

    target.value = '';
  }


  removeImage(index: number): void {
    const img = this.selectedImages[index];

    if (!img.file && img.id) {
      // store deleted backend image id
      this.deleteIds.push(img.id);
      // this.replacedImageId = img.id;
    }

    this.selectedImages.splice(index, 1);
  }



}
