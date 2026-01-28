import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  userList: any;
  p: any = 1;
  filteredData: any[] = [];
  searchText: string = '';
  loading: boolean = false;
  @ViewChild('closeModalBlock') closeModalBlock!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.get('admin/users').subscribe({
      next: (resp: any) => {
        this.userList = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.userList;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { full_name: any; email: any; }) =>
      (item.full_name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  userId: any;

  selectedUser: any;
  nextStatus!: number; // 0 or 1

  get modalTitle(): string {
    return this.nextStatus === 0 ? 'Block User' : 'Unblock User';
  }

  get modalMessage(): string {
    return this.nextStatus === 0
      ? 'Are you sure you want to block this user?'
      : 'Are you sure you want to unblock this user?';
  }

  get confirmBtnText(): string {
    return this.nextStatus === 0 ? 'Yes, Block' : 'Yes, Unblock';
  }

  onToggleUser(item: any) {
    this.selectedUser = item;
    this.nextStatus = item.is_active === 0 ? 1 : 0;
  }

  confirmToggle() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('userId', this.selectedUser.user_id);

    this.service.post('admin/toggle-status', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.selectedUser.is_active = this.nextStatus;
        this.userList = resp.data;
        this.closeModalBlock.nativeElement.click();
        this.filterTable();
        this.loading = false;
        this.toastr.success(resp.message);
      }
    });
  }


}
