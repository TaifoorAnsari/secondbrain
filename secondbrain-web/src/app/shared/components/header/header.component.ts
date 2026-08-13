import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  imports : [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router)
  user = this.authService.currentUser;
  isHomePage = signal(false);
  currentRoute = this.router.url;

  menuOpen = signal(false);

  ngOnInit(): void {
      if(this.currentRoute === "/") {
        this.isHomePage.set(true)
      }
  }

  greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 17) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  });

  avatarUrl = computed(() => {
    const avatar = this.user()?.avatar;

    if (!avatar) {
      return null;
    }

    if (
      avatar.startsWith('http://') ||
      avatar.startsWith('https://') ||
      avatar.startsWith('data:')
    ) {
      return avatar;
    }

    return `${environment.apiUrl}${avatar}`;
  });

  initials = computed(() => {
    const fullName = this.user()?.fullName;

    if (!fullName) {
      return 'U';
    }

    return fullName.charAt(0).toUpperCase();
  });
routerlink: any;

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  profile() {
    this.menuOpen.set(false);
    this.router.navigate(['/profile']);
  }

  loginToAccount() {
    console.log(this.user(), 'current user');
    this.router.navigate(['/login']);
  }

  settings(): void {
    this.router.navigate(['/settings']);
    this.menuOpen.set(false);
  }
}