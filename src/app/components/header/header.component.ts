import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AngularFireAuth) {
  }

  ngOnInit(): void {
  }

  login() {
    let user = this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    console.log(user);
  }
  logout() {
    this.auth.signOut();
  }

}
