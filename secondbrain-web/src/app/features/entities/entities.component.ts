import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent {

  peopleCount = 6;
  companyCount = 4;
  totalEntities = 10;

  entities = [

    {
      name: 'Rahul Sharma',
      type: 'Person',
      description: 'Software Engineer'
    },

    {
      name: 'Narendra Modi',
      type: 'Person',
      description: 'Prime Minister of India'
    },

    {
      name: 'Google',
      type: 'Company',
      description: 'Technology Company'
    },

    {
      name: 'Microsoft',
      type: 'Company',
      description: 'Cloud & Software'
    },

    {
      name: 'Infosys',
      type: 'Company',
      description: 'IT Services'
    },

    {
      name: 'Virat Kohli',
      type: 'Person',
      description: 'Cricketer'
    }

  ];

}