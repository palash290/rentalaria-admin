import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-enquiries',
  imports: [RouterLink, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './enquiries.component.html',
  styleUrl: './enquiries.component.css'
})
export class EnquiriesComponent {

  allInquiries: any;
  loading: boolean = false;
  p: any = 1;
  filteredData: any[] = [];
  searchText: string = '';
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getmyinquiries();
  }

  getmyinquiries() {
    this.service.get('admin/getAllinquiries').subscribe({
      next: (resp: any) => {
        this.allInquiries = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.allInquiries;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { property_name: any; }) =>
        (item.property_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  deleteId: any;

  getId(id: any) {
    this.deleteId = id;
  }

  deleteProperty() {
    this.loading = true;
    this.service.delete(`admin/delete-inquiry/${this.deleteId}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getmyinquiries();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

}
