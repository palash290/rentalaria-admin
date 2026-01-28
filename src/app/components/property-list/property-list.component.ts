import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-list',
  imports: [RouterLink, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent {

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
    this.service.get('admin/get-property').subscribe({
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
    this.service.delete(`admin/delete-property/${this.deleteId}`).subscribe({
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
