import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  layout = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  menuOpen = signal(false);

  initials = computed(() => {
    const fullName = this.user()?.fullName;
    console.log(this.user(),"111111111")
    console.log('Full Name:', fullName); // Debugging line

    if (!fullName) return 'U';

    return fullName.charAt(0).toUpperCase();
  });

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
    console.log(this.user(),"current user ")
    this.router.navigate(['/login']);
  }
}