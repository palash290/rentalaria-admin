import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-view-lifestyle',
  imports: [RouterLink],
  templateUrl: './view-lifestyle.component.html',
  styleUrl: './view-lifestyle.component.css'
})
export class ViewLifestyleComponent {

  blog_id: any;
  blogDetails: any;

  constructor(private service: CommonService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.blog_id = this.router.snapshot.queryParamMap.get('blog_id');
    this.getBlogDetails();
  }

  getBlogDetails() {
    this.service.get(`admin/blog/${this.blog_id}`).subscribe({
      next: (resp: any) => {
        this.blogDetails = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


}
