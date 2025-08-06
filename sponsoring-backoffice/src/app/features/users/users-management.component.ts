import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../core/services/admin-data.service';
import { User, PaginatedResponse, UserRole } from '../../core/models/admin.interface';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  Math = Math;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminDataService.getUsers({
      page: this.currentPage,
      limit: 10,
      search: this.searchTerm
    }).subscribe({
      next: (response: PaginatedResponse<User>) => {
        this.users = response.data;
        this.totalPages = response.totalPages;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  getRoleClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-danger-100 text-danger-800';
      case UserRole.AGENT:
        return 'bg-primary-100 text-primary-800';
      case UserRole.USER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminDataService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}