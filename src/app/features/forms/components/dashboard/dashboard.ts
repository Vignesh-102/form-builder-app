import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  forms: { id: string, title: string, updatedAt: Date }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.forms = [
      { id: '1', title: 'Customer Feedback Form', updatedAt: new Date('2025-08-20T10:30:00') },
      { id: '2', title: 'Employee Survey', updatedAt: new Date('2025-08-25T14:15:00') },
      { id: '3', title: 'Order Tracking Form', updatedAt: new Date('2025-08-28T09:45:00') },
    ];
  }

  createForm(): void {
    this.router.navigate(['formBuilder']);
  }

  openForm(id: string): void {
  }

  deleteForm(id: string): void {
  }
}
