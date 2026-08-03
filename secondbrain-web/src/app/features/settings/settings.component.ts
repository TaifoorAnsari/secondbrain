import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  user = {
    fullName: 'Shaaf Ansari',
    username: 'shaaf',
    email: 'shaaf@example.com',
    phone: '+91 9876543210',
    bio: 'Angular Developer | Building SecondMind'
  };

  notifications = {
    morning: true,
    evening: true,
    email: false,
    browser: true
  };

  saveSettings() {
    console.log('Settings Saved');
    console.log(this.user);
    console.log(this.notifications);
  }

}