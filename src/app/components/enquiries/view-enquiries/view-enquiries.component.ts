import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-view-enquiries',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-enquiries.component.html',
  styleUrl: './view-enquiries.component.css'
})
export class ViewEnquiriesComponent {

  inqueryId: any;
  inquirieData: any;

  constructor(private route: ActivatedRoute, private service: CommonService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.inqueryId = params['inqueryId'];
    });
    this.getmyinquiries();
  }

  getmyinquiries() {
    this.service.get(`admin/my-inquiries/${this.inqueryId}`).subscribe({
      next: (resp: any) => {
        this.inquirieData = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


}
