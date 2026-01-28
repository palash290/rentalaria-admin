import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-property',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.css'
})
export class ViewPropertyComponent {

  mediaList: any = [];
  property_id: any;
  propertyDetails: any;
  houseRules: any;
  nearbyLocation: any;

  constructor(private service: CommonService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.property_id = this.router.snapshot.queryParamMap.get('property_id');
    this.getPropertyDetails();
  }

  getPropertyDetails() {
    this.service.get(`admin/get-property-details/${this.property_id}`).subscribe({
      next: (resp: any) => {
        this.propertyDetails = resp.data;

        // ✅ Parse house rules safely
        this.houseRules = [];

        if (resp.data.house_rules) {
          try {
            this.houseRules = JSON.parse(resp.data.house_rules);
          } catch (e) {
            console.error('Invalid house_rules format');
          }
        }

        // ✅ Parse house rules safely
        this.nearbyLocation = [];

        if (resp.data.house_rules) {
          try {
            this.nearbyLocation = JSON.parse(resp.data.nearby_property_location);
          } catch (e) {
            console.error('Invalid house_rules format');
          }
        }

        // ✅ Merge images first, then videos
        this.mediaList = [
          ...(resp.data.images || []),
          ...(resp.data.videos || [])
        ];
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  isVideo(file: string): boolean {
    return file?.toLowerCase().endsWith('.mp4');
  }


}
