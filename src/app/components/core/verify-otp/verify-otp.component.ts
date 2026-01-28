import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import { ValidationErrorService } from '../../../services/validation-error.service';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, CommonModule,
    NzFlexDirective, NzInputOtpComponent],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {

  Form: FormGroup;
  atValues: any;
  loading: boolean = false;
  isLoadingResend: boolean = false;
  isPasswordVisible: boolean = false;
  userEmail: any;
  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService,
    private service: CommonService, private router: Router, private route: ActivatedRoute
  ) {
    this.Form = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
    });
    // this.userEmail = localStorage.getItem('userEmail');
  }

  onSubmit() {
    // this.modalService.openResetModal();
    // return
    this.Form.markAllAsTouched()
    if (this.Form.valid) {
      this.loading = true
      const formURlData = new URLSearchParams()
      formURlData.set('email', this.userEmail)
      formURlData.set('otp', this.Form.value.otp)
      // formURlData.set('newPassword', this.Form.value.password)
      this.service
        .post('admin/verify-otp', formURlData.toString())
        .subscribe({
          next: (resp: any) => {
            if (resp.success == true) {
              this.loading = false;
              this.toastr.success(resp.message);
              this.router.navigateByUrl('/reset-password');
            } else {
              this.loading = false;
              this.toastr.warning(resp.message);
            }
          },
          error: (error: any) => {
            this.loading = false;
            this.toastr.warning(error || 'Something went wrong!');
          }
        })
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  resendOtp() {
    this.isLoadingResend = true
    const formURlData = new URLSearchParams()
    formURlData.set('email', this.userEmail)
    this.service
      .post('public/resend-otp', formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoadingResend = false;
            this.toastr.success(resp.message);
          } else {
            this.isLoadingResend = false;
            this.toastr.warning(resp.message);
          }
        },
        error: (error: any) => {
          this.isLoadingResend = false;
          this.toastr.warning(error || 'Something went wrong!');
        }
      })
  }


}
