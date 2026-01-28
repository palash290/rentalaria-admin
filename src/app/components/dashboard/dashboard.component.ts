import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  dashboardData: any;
  recentInquries: any;

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.get('admin/dashboard').subscribe({
      next: (resp: any) => {
        this.dashboardData = resp.data.stats;
        this.recentInquries = resp.data.recentEnquiries;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

}
