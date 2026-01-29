import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-lifestyle',
  imports: [RouterLink, CKEditorModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-lifestyle.component.html',
  styleUrl: './add-lifestyle.component.css'
})
export class AddLifestyleComponent {

  Form!: FormGroup;
  public Editor: any = ClassicEditor;
  public content = '';
  loading: boolean = false;
  allTags: any;
  selectedtagsIds: number[] = [5, 6];
  blog_id: any;

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

  constructor(private fb: FormBuilder, private toastr: NzMessageService, private service: CommonService,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.blog_id = this.route.snapshot.queryParamMap.get('blog_id');
    this.Form = this.fb.group({
      title: ['', Validators.required],
      short_description: ['', Validators.required],
      is_featured: ['1']
    });
    // this.getTags();

    if (this.blog_id) {
      this.getBlogDetails();
    }
  }

  getBlogDetails() {
    this.service.get(`admin/blog/${this.blog_id}`).subscribe({
      next: (resp: any) => {
        const blog = resp.data;

        // Patch form
        this.Form.patchValue({
          title: blog.title,
          short_description: blog.short_description,
          is_featured: String(blog.is_featured)
        });

        this.content = blog.content;

        this.previewImage = blog.cover_image;

        // Convert tag string → array
        if (blog.tag_ids) {
          this.selectedtagsIds = blog.tag_ids
            .split(',')
            .map((id: string) => Number(id.trim()));
        }
      }
    });
  }

  getTags() {
    this.service.get('admin/getAllTags').subscribe({
      next: (resp: any) => {
        this.allTags = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onTagChange(event: Event, amenityId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedtagsIds.push(amenityId);
    } else {
      this.selectedtagsIds = this.selectedtagsIds.filter(
        amenity_id => amenity_id !== amenityId
      );
    }

    // console.log('Selected Amenities:', this.selectedtagsIds);
  }


  submit() {
    this.Form.markAllAsTouched();

    const title = this.Form.value.title?.trim();
    const short_description = this.Form.value.short_description?.trim();

    if (!title || !short_description) {
      return;
    }

    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new FormData();
      formURlData.set('title', this.Form.value.title);
      formURlData.set('short_description', this.Form.value.short_description);
      formURlData.set('content', this.content);
      formURlData.set('is_featured', this.Form.value.is_featured);
      if (this.selectedFile) {
        formURlData.append('cover_image', this.selectedFile);
      }
      formURlData.append(
        'tags',
        this.selectedtagsIds.join(',')
      );
      this.service.post(this.blog_id ? `admin/updateBlog/${this.blog_id}` : 'admin/createBlog', formURlData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.loading = false;
            this.toastr.success(resp.message);
            this.router.navigateByUrl('/home/lifestyle-list');
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
    }
  }

  selectedFile: File | null = null;
  previewImage: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // Optional: validate type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.previewImage = null;

    // Reset file input so same image can be selected again
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.value = '';
  }



}
