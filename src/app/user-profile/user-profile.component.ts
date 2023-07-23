import { formatDate } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router, 
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * getUser gets all the data displayed about the user
   * getAllMovies will filter the movies id that are added to the favorite movies array
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((response: any) => {
      this.user = response;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = formatDate(this.user.Birthday, 'yyyy-mm-dd', 'en-US', 'UTC+0');

      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        this.favoriteMovies = response.filter((m: { _id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0)
      })
    })
  }

  /**
   * accepts the inputed user data and sends it to the database and sets the localstorage
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem("Username", result.Username);

      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * calls the API to delet user's profile
   */
  deleteUser(): void {
    if (
      confirm( "Are you sure?")
    ) 
    {
      this.fetchApiData.deleteUser().subscribe((result: any) => {
        this.snackBar.open('User successfully deleted', 'OK', {
          duration: 2000
        });
      }, (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      });
      localStorage.clear();
      this.router.navigate(['welcome']);
    }
  }
    
}
