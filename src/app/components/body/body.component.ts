
import { AfterViewInit, Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, AfterViewInit {

  scale:number = 40; //tracks current scale applied

  pos1 = 0; // Tracks outer div positions
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;

  cx = 0; // divg offsetTop and offsetLeft when
  cy = 0; // paint mode is entered.

  paint_x = 0; // painting top left coordinates
  paint_y = 0;

  color = 'blue';

  clickPos = {x:0,y:0};


  //Initial behaviour states
  paintMode = false;

  //Canvas placement
  left = 0; //offsetLeft
  top = 0; //offsetTop

  //Guide offsets
  topg = 0;
  leftg = 0;

  //Initial Brush Size
  brush_size_parent = 1;

  //Check Login
  isLogged:boolean = false;


  constructor(public auth: AngularFireAuth) { 
  }
  

  

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if(user) this.isLogged = true;
      else this.isLogged = false;
    });

    let img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 240, 110);
    };
    img.src = './assets/pepehands.png';


    //Canvas and Div variables
    const canvas : any = document.getElementById('myCanvas');
    const div = document.getElementById("outer");
    let ctx = canvas.getContext('2d');
    const divg = document.getElementById('guideRect');

    //Event states
    let pressed = false;
    let moved = false;
    
    //Canvas Setup
    div!.style.left = (document.documentElement.clientWidth - 1000)/2 + 'px';
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,1000,1000);
    ctx.fillStyle = 'red';
    ctx.fillRect(300,200,180,290);
    ctx.fillRect(0,0,1,1);
    ctx.fillRect(500,500,1,1);
    ctx.fillRect(100,100,1,1);

    //Guide Setup
    divg!.style.top = document.documentElement.clientHeight * 0.5 + 'px';
    divg!.style.left = document.documentElement.clientWidth * 0.5 + 'px';

    //Wheel zoom
    canvas.addEventListener("wheel",(e:any)=>{
      e.preventDefault();
      console.log(`${e.deltaY}`);

      const div = document.getElementById('outer');
      if(div?.style.transform != undefined) {
        if(this.paintMode && e.deltaY > 0) {
          // this.scale = 4;
          // div.style.transform = `scale(${this.scale})`;
          // div.style.transformOrigin = `top left`;

          // // Same formula used to enter paintMode
          // div.style.top = `${(this.clickPos.y * -this.scale) + (document.documentElement.clientHeight * 0.5)}px`;
          // div.style.left = `${(this.clickPos.x * -this.scale) + (document.documentElement.clientWidth * 0.5)}px`;
          this.leavePaintMode();
        }
        else if(this.paintMode && e.deltaY < 0){
          this.scale = 40;
          div.style.transformOrigin = `top left`;
          div.style.transform = `scale(${this.scale}, ${this.scale})`;

          // Same formula used to enter paintMode
          div.style.top = `${(this.clickPos.y * -this.scale) + (document.documentElement.clientHeight * 0.5)}px`;
          div.style.left = `${(this.clickPos.x * -this.scale) + (document.documentElement.clientWidth * 0.5)}px`;
        }
      }

    });
    

    canvas.addEventListener("mousedown", (e:any) => {
      //Setup for the mouse drag
      pressed = true;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;

    });
    canvas.addEventListener("mousemove", (e:any)=> {

      //Apply offset to move div with canvas around
      if(pressed) {
        moved = true; //Signals drag event
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        if(div?.style != undefined) {
          if(this.paintMode) {
            this.topg = divg!.offsetTop - this.pos2;
            this.leftg = divg!.offsetLeft - this.pos1;
            divg!.style.top = this.topg + "px";
            divg!.style.left = this.leftg + "px";
            this.dragGuideOnPaintMode(this.leftg, this.topg);

          }
          div.style.top = (div.offsetTop - this.pos2) + "px";
          div.style.left = (div.offsetLeft - this.pos1) + "px";

        }
      }
    });
    canvas.addEventListener("mouseup", (e:any) => {
      //Mouse drag ends
      pressed = false;
      if(moved) {
        moved = false;
      }
      //Handle 'Click' Event
      else {
        if(!this.paintMode && this.isLogged){
          this.enterPaintMode(e); 
        }
        else if(!this.paintMode && !this.isLogged) {
          this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        }
      }
    });

    canvas.addEventListener("mouseout", () => {
      //Mouse drag ends
      pressed = false;
      moved = false;
    });

    window.addEventListener('keypress', (e:any) => {
      if(e.key == ' ') {
        this.paintTile();
      }
    });
    window.addEventListener('keydown', (e:any) =>{
      if(e.key == 'Escape') {
        this.leavePaintMode();
      }
    });
    
  }
  ngAfterViewInit(): void {
    //Track log state
  //   firebase.auth().onAuthStateChanged((user)=> {
  //     if (user) {
  //       this.isLogged = true;
  //     } else {
  //       this.isLogged = false;
  //     }
  //     console.log(user?.uid);
  //  });
  }


  getMousePos(canvas:any, evt:any):any {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

  enterPaintMode(e:any):void {
    this.paintMode = true;
    const div = document.getElementById('outer');
    const divg = document.getElementById('guideRect');
    const canvas : any = document.getElementById('myCanvas');
    this.clickPos = this.getMousePos(canvas,e);

    // Makes Guide rect visible
    divg!.style.border = '1px solid';

    this.cx = divg!.offsetLeft; // Updates initial guide rect position
    this.cy = divg!.offsetTop;

    if(div?.style != undefined) {
      div.style.transform = `scale(${this.scale})`; // Makes the top left of the canvas go towards the top left of the view
      div.style.transformOrigin = `top left`; // -> (0,0) becomes the left top corner. Increment to move top/right.

      // Setup to position canvas/view on the clicked tile
      this.left = document.documentElement.clientWidth * 0.5;
      this.top = document.documentElement.clientHeight * 0.5;
      this.top += -1 * Math.round(this.clickPos.y) * this.scale;
      this.left += -1 * Math.round(this.clickPos.x) * this.scale;

      div.style.top = this.top + 'px';  
      div.style.left = this.left  + 'px';

      // Get initial paint_x and paint_y
      this.adjustGuideRectSize(this.brush_size_parent*this.scale);
            
    }
    
  }

  /**
   * 
   * @param x 
   * @param y 
   */
  dragGuideOnPaintMode(x:any, y:any) {
    const divg = document.getElementById('guideRect');
    if(x - this.cx > this.scale/2) {
      // <-  
      divg!.style.left = -this.scale + this.leftg + "px";
      this.paint_x -= 1;
    }
    else if(x - this.cx < -this.scale/2) {
      // ->
      divg!.style.left = +this.scale + this.leftg + "px";
      this.paint_x += 1;
    }
    if(y - this.cy > this.scale/2) {
      // V
      divg!.style.top = -this.scale + this.topg + "px";
      this.paint_y -= 1;
    }
    else if(y - this.cy < -this.scale/2) {
      // ^
      divg!.style.top = +this.scale + this.topg + "px";
      this.paint_y += 1;
    }
  }

  paintTile() {
    const canvas : any = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    if(this.paintMode) {
      ctx.fillStyle = this.color; //**Change this -> color pallet
      ctx.fillRect(this.paint_x,this.paint_y,this.brush_size_parent,this.brush_size_parent);
    }
  }

  leavePaintMode() {
    const divg = document.getElementById('guideRect');
    const div = document.getElementById("outer");

    if(this.paintMode) {
      this.paintMode = false;
      divg!.style.border = 'none';
      div!.style.transformOrigin = 'top left';
      div!.style.left = (document.documentElement.clientWidth - 1000)/2 + 'px';
      div!.style.top = '0px';
      
      div!.style.transform = 'scale(1)';

    }   
  }

  adjustGuideRectSize(size:any) {
    const divg = document.getElementById('guideRect');
    const div = document.getElementById("outer");

    //Coordinates for the midle of the screen relative to the viewport
    let view_top = Math.round(document.documentElement.clientHeight * 0.5);
    let view_left = Math.round(document.documentElement.clientWidth * 0.5);

    //Coordinates for the midle of the screen relative to the canvas
    let mid_top = div!.offsetTop * -1 + view_top;
    let mid_left = div!.offsetLeft * -1 + view_left;

    //Set mid_top and mid_left to the nearest interesection
    if((mid_top % this.scale) >= this.scale/2) { //half bottom of the 40x40 square
      mid_top += this.scale - (mid_top % this.scale);
    }
    else if((mid_top % this.scale) < this.scale/2) {
      mid_top -=(mid_top % this.scale);
    }

    if((mid_left % this.scale) >= this.scale/2) { //half right of the 40x40 square
      mid_left += this.scale - (mid_left % this.scale);
    }
    else if((mid_left % this.scale) < this.scale/2) {
      mid_left -=(mid_left % this.scale);
    } //(mid_left,mid_top) -> coordinates for the nearest intersection from the midle of the screen

    //Adjust mid_top and mid_left depending on the brush_size
    if((this.brush_size_parent % 2) == 0) { //If it's an even size brush, offset by half the size of the brush
      mid_top -= (this.brush_size_parent/2) * this.scale;
      mid_left -= (this.brush_size_parent/2) * this.scale;
    }
    else { // Top right always bigger
      mid_top -= Math.floor(this.brush_size_parent/2) * this.scale;
      mid_left -= Math.floor(this.brush_size_parent/2) * this.scale;
    }

    //Guide size
    divg!.style.width = `${size - 1}px`;
    divg!.style.height = `${size - 1}px`;

    //Guide pos
    let guide_top = (mid_top - div!.offsetTop*-1);
    let guide_left = (mid_left - div!.offsetLeft*-1);
    
    divg!.style.top = `${guide_top}px`;
    divg!.style.left = `${guide_left}px`;

    //Initial values of bx and cy updated 
    this.cx = divg!.offsetLeft;
    this.cy = divg!.offsetTop;

    //Paint coordinates update
    this.paint_y = mid_top/this.scale;
    this.paint_x = mid_left/this.scale;

  }

  getBrushSize(size:any) {
    this.brush_size_parent = size;
    this.adjustGuideRectSize(size*this.scale);
  }

  getColor(color:any) {
    this.color = color;
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

  checkLogin(): boolean{
    firebase.auth().onAuthStateChanged((user)=> {
      if (user) {
        return true;
      } else {
        return false;
      }
   });
   return false;
  }

}

/**
 * TODO:
 * ## Start Backend
 */

