import { Component } from '@angular/core';
import { MovieCardComponent } from './movie-card/movie-card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

/**
 * default entry point to the myFlix application
 */
export class AppComponent {
  title = 'myFlix-Angular-client';
}