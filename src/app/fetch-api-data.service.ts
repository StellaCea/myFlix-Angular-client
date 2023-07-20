import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators' ;


//Declaring the API url that will provide data fro the client app
const apiUrl = 'https://myflixapi.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  //Inject the HttpClient module to the constructor params
  //This will provide HttpClient to the entire class, making it available via this-http
  constructor(private http: HttpClient) {
  }

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails 
   * @returns a user that has been added to the DB
   * used in user-registration-form
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Directs user to the login page
   * @param userDetails 
   * @returns log in the user with a token and user info in local storage
   */
  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @returns all the movies from the db
   * used in movie-card component
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

/**
 * 
 * @param title 
 * @returns one movie from the array by its title
 */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
    );
  }

  /**
   * 
   * @param directorName 
   * @returns director's name
   * used in the movie-card component
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director' + directorName, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param genreName 
   * @returns movie's genre
   * used in the movie-card component
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre' + genreName, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @returns the user in user-profile component
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    ); 
  }

  /**
   * 
   * @returns array of favorite movies
   */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param movieId 
   * @returns a movie added to the array of favorite movies
   * used in movie-card component
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Check if the movie has already been added to favorites
  isFavoriteMovie(movieId: string):boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  /**
   * edits user profile and updates information
   * @param updatedUser 
   * @returns data changed in user-profile component and updates it in the DB
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user, updatedUser, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * deletes user's profile
   * @returns a deleted user from the DB
   * used in user-profile component
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param movieId 
   * @returns deleted movie from the favorite movies array
   * used in movie-card component
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);

    if(index > -1) {
      user.FavoriteMovies.splice(index, 1); //remove only 1 item
    }

    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
    //non typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.log('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
