import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieInfoComponent } from '../movie-info/movie-info.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any [] = [];  //array where movies from the API call will be kept
  constructor(public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) { }
// when the page loads getMovies() fetches all the movies and stores them in the movie array
  ngOnInit(): void {
    this.getMovies();
  }

  //Gets the movies from the API
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens the Genre dialog
   * @param name 
   * @param description 
   */

  openGenre(name: string, description: string): void{
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
    });
  }

  /**
   * Opens the Director doalog
   * @param name 
   * @param bio 
   */

  openDirector(name: string, bio: string): void{
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio
      },
    });
  }

/**
 * Opens the Synopsis dialog about the movie
 * @param description 
 */

  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description
      },
    });
  }

/**
 * Movies will be added/deleted from the user's array of favorite movies
 * @param {string} id 
 */

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((Reasponse: any) => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000
      });
    });
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

  deleteFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((Response: any) => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000
      });
    });
  }
}
