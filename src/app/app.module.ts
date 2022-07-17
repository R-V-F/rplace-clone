import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { BrushesComponent } from './components/body/brushes/brushes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { PaletteComponent } from './components/body/palette/palette.component';
import { LoadComponent } from './components/body/load/load.component';
import { SaveComponent } from './components/body/save/save.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { PlaceitComponent } from './components/body/placeit/placeit.component';


const firebaseConfig = {
  apiKey: "AIzaSyAXaFZfApG_7fgC1R4eEe2qv1MdFEJOLvw",
  authDomain: "dotcanvas-b2cb6.firebaseapp.com",
  projectId: "dotcanvas-b2cb6",
  storageBucket: "dotcanvas-b2cb6.appspot.com",
  messagingSenderId: "17330917183",
  appId: "1:17330917183:web:3f19c6cb457970ef8f4d8a"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    BrushesComponent,
    PaletteComponent,
    LoadComponent,
    SaveComponent,
    PlaceitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
