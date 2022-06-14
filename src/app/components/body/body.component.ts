
import { AfterViewInit, Component, OnInit, ɵɵsetComponentScope } from '@angular/core';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, AfterViewInit {

  scale:number = 1; //tracks current scale applied

  pos1 = 0; // Tracks outer div positions
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;

  cx = 0; // divg offsetTop and offsetLeft when
  cy = 0; // paint mode is entered.


  //Behaviour State
  paintMode = false;

  //Canvas placement
  left = 0; //offsetLeft
  top = 0; //offsetTop

  //Guide offsets
  topg = 0;
  leftg = 0;


  constructor() { 
  }

  

  ngOnInit(): void {
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

      this.scale += e.deltaY * -0.005;
    
      // Restrict scale
      this.scale = Math.max(this.scale, 0.5);
    
      // Apply scale transform
      const div = document.getElementById('outer');
      if(div?.style.transform != undefined) {
        div.style.transform = `scale(${this.scale}, ${this.scale})`;
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
        if(!this.paintMode) this.enterPaintMode(e);        
      }
    });

    canvas.addEventListener("mouseout", () => {
      //Mouse drag ends
      pressed = false;
      moved = false;
    });

    window.addEventListener('keypress', (e:any) => {
      console.log(e.key);
      if(e.key == ' ') {
        this.paintTile();
      }
    });
    window.addEventListener('keydown', (e:any) =>{
      if(e.key == 'Escape') {
        console.log(`offsetTop = ${div!.offsetTop}, offsetLeft = ${div!.offsetLeft}`);
        this.leavePaintMode();
        console.log(`offsetTop = ${div!.offsetTop}, offsetLeft = ${div!.offsetLeft}`);

      }
    });
    
  }
  ngAfterViewInit(): void {

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
    this.scale = 40;
    let clickPos = this.getMousePos(canvas,e);

    divg!.style.border = '1px solid';

    this.cx = divg!.offsetLeft;
    this.cy = divg!.offsetTop;

    if(div?.style != undefined) {
      this.top = 0;
      this.left = 0;

      this.left += document.documentElement.clientWidth * 0.5;

      this.top += document.documentElement.clientHeight * 0.5;

      div.style.transform = `scale(${this.scale})`;
      div.style.transformOrigin = `top left`;
      // div.style.top = this.top + 'px';    // Position Top Right (0,0) in the midle of
      // div.style.left = this.left + 'px';  // the window.

      this.top += -1 * Math.floor(clickPos.y) * this.scale;
      this.left += -1 * Math.floor(clickPos.x) * this.scale;

      // console.log(`out of paintMode: this.top = ${this.top}, this.left${this.left}`);

      div.style.top = this.top + 'px';  
      div.style.left = this.left  + 'px';
            
    }
    
  }

  dragGuideOnPaintMode(x:any, y:any) {
    const divg = document.getElementById('guideRect');
    console.log(`x,cx = ${x},${this.cx}, y = ${y}`);
    if(x - this.cx > 20) {
      // <-  
      divg!.style.left = -40 + this.leftg + "px";
    }
    else if(x - this.cx < -20) {
      // ->
      divg!.style.left = +40 + this.leftg + "px";
    }
    else if(y - this.cy > 20) {
      // V
      divg!.style.top = -40 + this.topg + "px";
    }
    else if(y - this.cy < -20) {
      // ^
      divg!.style.top = +40 + this.topg + "px";
    }
  }

  paintTile() {
    const div = document.getElementById('outer');
    const canvas : any = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');

    if(this.paintMode) {
      
      let x = Math.round((div!.offsetLeft * -1 + document.documentElement.clientWidth * 0.5) / this.scale);
      let y = Math.round((div!.offsetTop * -1 + document.documentElement.clientHeight * 0.5) / this.scale);
      ctx.fillStyle = 'purple';
      ctx.fillRect(x,y,3,3);
      
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

      divg!.style.top = document.documentElement.clientHeight * 0.5 + 'px';
      divg!.style.left = document.documentElement.clientWidth * 0.5 + 'px';
      
      

    }   
  }


}

/**
 * To change guideRect size:
 *  - adjust guideRect width and height to (brush_size * 40) - 1
 *  - on paintTile() => fillRect(x,y,brush_size,brush_size)
 * 
 * 
 * 
 * 
 * TODO:
 * # Floating Menu for brushes
 * # Fix scroll during paint mode
 * 
 */

