import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  first_name: any;
  designation: any;
  loading: boolean = false;
  profileImg: string | ArrayBuffer | null = null;
  selectedFile!: File;
  userType: any;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl({ value: this.userEmail, disabled: true }),
    });
  }

  loadUserProfile() {
    this.service.get('admin/profile').subscribe({
      next: (resp: any) => {
        this.userEmail = resp.data.email;
        this.first_name = resp.data.full_name;
        this.profileImg = resp.data.profile_image;
        this.profileForm.patchValue({
          name: this.first_name,
          designation: this.designation,
          email: this.userEmail,
          company_name: resp.data.company_name
        });
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();

    const first_name = this.profileForm.value.name?.trim();

    if (!first_name) {
      return;
    }

    if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new FormData();
      formURlData.append('full_name', this.profileForm.value.name);

      if (this.selectedFile) {
        formURlData.append('profile_image', this.selectedFile);
      }

      this.service.post('admin/profile', formURlData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.service.triggerHeaderRefresh();
            this.loadUserProfile();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.loadUserProfile();
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.toastr.warning('Please check all the fields!');
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {

        this.profileImg = reader.result;

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


}
