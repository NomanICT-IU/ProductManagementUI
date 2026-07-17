import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { SignalrService } from '../../services/signalr-service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header implements OnInit, OnDestroy {
  userEmail: string | null = '';

  private notificationSub!: Subscription;
  public notifications: Array<{ user: string; message: string; productId?: any }> = [];
  public notificationCount: number = 0;
  public showDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private signalrService: SignalrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail();

    this.signalrService.startConnection();
    this.signalrService.addNotificationListener();

    this.notificationSub = this.signalrService.notification$.subscribe({
      next: (data) => {
        this.notifications.unshift(data);
        this.notificationCount++;
        this.cdr.detectChanges();
      },
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.notificationCount = 0;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  navigateToDetails(productId: any): void {
    if (productId) {
      this.showDropdown = false;
      this.router.navigate(['/user/products', productId]);
    }
  }
}
