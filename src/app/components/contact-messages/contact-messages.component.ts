import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-messages',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './contact-messages.component.html',
  styleUrl: './contact-messages.component.css'
})
export class ContactMessagesComponent {

  contactData: any;
  p: any = 1;
  filteredData: any[] = [];
  searchText: string = '';

  constructor(private toastr: NzMessageService, private service: CommonService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.get('admin/get-All-Message').subscribe({
      next: (resp: any) => {
        this.contactData = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.contactData;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { full_name: any; }) =>
        (item.full_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  msgDetail: any;

  getSingleDetail(item: any) {
    this.msgDetail = item;
  }


}
