import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  checkmarkCircleOutline,
  listOutline,
  barChartOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.html',
  styleUrls: ['./bottom-navigation.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterModule,
    CommonModule,
    IonIcon
  ]
})
export class BottomNavigationComponent {

  constructor() {
    addIcons({
      homeOutline,
      checkmarkCircleOutline,
      listOutline,
      barChartOutline,
      personOutline
    });
  }

}