import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userData: any;

  constructor(private router: Router, private apiService: CommonService) { }

  @ViewChild('closeModal') closeModal!: ElementRef;


  userType: any;

  ngOnInit() {
    this.apiService.refreshSidebar$.subscribe(() => {
      this.getProfile();
    });
  }

  logout() {
    this.router.navigateByUrl('/');
    this.closeModal.nativeElement.click();
    localStorage.clear();
  }

  getProfile() {
    this.apiService.get('admin/profile').subscribe({
      next: (resp: any) => {
        this.userData = resp.data;
        localStorage.setItem('teamEmail', resp.data.email);
        localStorage.setItem('userId', resp.data.id);
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


}
