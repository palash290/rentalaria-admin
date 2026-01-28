import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-lifestyle-list',
  imports: [RouterLink, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './lifestyle-list.component.html',
  styleUrl: './lifestyle-list.component.css'
})
export class LifestyleListComponent {

  propertyList: any;
  p: any = 1;
  filteredData: any[] = [];
  searchText: string = '';
  loading: boolean = false;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.get('admin/getAllBlogs').subscribe({
      next: (resp: any) => {
        this.propertyList = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.propertyList;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { title: any; }) =>
        (item.title?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  deleteId: any;

  getId(id: any) {
    this.deleteId = id;
  }

  deleteBlog() {
    this.loading = true;
    this.service.delete(`admin/deleteBlog/${this.deleteId}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.loadData();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
