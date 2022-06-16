
import { style } from '@angular/animations';
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

  //Brush Size from childs component
  brush_size_parent = 1;


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

      this.top += -1 * Math.round(clickPos.y) * this.scale;
      this.left += -1 * Math.round(clickPos.x) * this.scale;

      // console.log(`out of paintMode: this.top = ${this.top}, this.left${this.left}`);

      div.style.top = this.top + 'px';  
      div.style.left = this.left  + 'px';
            
    }
    
  }

  /**
   * 
   * @param x 
   * @param y 
   */
  dragGuideOnPaintMode(x:any, y:any) {
    const divg = document.getElementById('guideRect');
    if(x - this.cx > this.scale/2) { //amount moved - the moment paint mode went true
      // <-  
      divg!.style.left = -this.scale + this.leftg + "px";
    }
    else if(x - this.cx < -this.scale/2) {
      // ->
      divg!.style.left = +this.scale + this.leftg + "px";
    }
    else if(y - this.cy > this.scale/2) {
      // V
      divg!.style.top = -this.scale + this.topg + "px";
    }
    else if(y - this.cy < -this.scale/2) {
      // ^
      divg!.style.top = +this.scale + this.topg + "px";
    }
  }

  paintTile() {
    const div = document.getElementById('outer');
    const canvas : any = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    const divg = document.getElementById('guideRect');

    if(this.paintMode) {
      
      /**
       * div.offsetLeft/Top => distance between the left/top side of the view port and the left/top
       * side of the screen (times -1).
       * 
       * document.documentElement.clientWidth/Height => view port width/height
       * 
       * 
       *   
       */

      let x = Math.round(((div!.offsetLeft * -1 + document.documentElement.clientWidth * 0.5) / this.scale) - ((this.brush_size_parent))/2);
      let y = Math.round(((div!.offsetTop * -1 + document.documentElement.clientHeight * 0.5) / this.scale) - ((this.brush_size_parent))/2);
      console.log(`paint* document.documentElement.clientWidth = ${document.documentElement.clientWidth}`);
      
      ctx.fillStyle = 'purple';
      ctx.fillRect(x,y,this.brush_size_parent,this.brush_size_parent);
      
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

      divg!.style.top = document.documentElement.clientHeight * 0.5 - (this.brush_size_parent * this.scale/2) + 'px';
      divg!.style.left = document.documentElement.clientWidth * 0.5 - (this.brush_size_parent * this.scale/2) + 'px';
      
      

    }   
  }

  adjustGuideRectSize(size:any) {
    const divg = document.getElementById('guideRect');
    const div = document.getElementById("outer");

    //Coordinates for the midle of the screen relative to the viewport
    let view_top = Math.round(document.documentElement.clientHeight * 0.5);
    let view_left = Math.round(document.documentElement.clientWidth * 0.5);

    //Coordinates for the midle of the screen relative to the viewport
    let mid_top = div!.offsetTop * -1 + view_top;
    let mid_left = div!.offsetLeft * -1 + view_left;

    //Set mid_top and mid_left to the nearest interesection
    if((mid_top % this.scale) >= this.scale/2) { //half bottom of the 40x40 square
      mid_top += mid_top % this.scale;
    }
    else if((mid_top % this.scale) < this.scale/2) {
      mid_top -= mid_top % this.scale;
    }

    if((mid_left % this.scale) >= this.scale/2) { //half right of the 40x40 square
      mid_left += mid_left % this.scale;
    }
    else if((mid_left % this.scale) < this.scale/2) {
      mid_left -= mid_left % this.scale;
    }

    //Adjust mid_top and mid_left depending on the brush_size
    if((this.brush_size_parent % 2) == 0) { //If it's an even size brush, offset by half the size of the brush
      mid_top -= (this.brush_size_parent/2) * this.scale;
      mid_left -= (this.brush_size_parent/2) * this.scale;
    }
    else { //top right always bigger
      mid_top -= Math.floor(this.brush_size_parent/2) * this.scale;
      mid_left -= Math.floor(this.brush_size_parent/2) * this.scale;
    }

    //Guide size
    divg!.style.width = `${size - 1}px`;
    divg!.style.height = `${size - 1}px`;

    //Guide pos
    let guide_top = 0;
    let guide_left = 0;
    if(((mid_top - div!.offsetTop*-1) % this.scale) <= this.scale) {
      guide_top = (mid_top - div!.offsetTop*-1) - ((mid_top - div!.offsetTop*-1) % this.scale);
    }
    else {
      guide_top = (mid_top - div!.offsetTop*-1) + ((mid_top - div!.offsetTop*-1) % this.scale);
    }

    if(((mid_left - div!.offsetLeft*-1) % this.scale) <= this.scale) {
      console.log(`guide_left = ${(mid_left - div!.offsetLeft*-1)} - ${((mid_left - div!.offsetLeft*-1) % this.scale)}`);
      guide_left = (mid_left - div!.offsetLeft*-1) - ((mid_left - div!.offsetLeft*-1) % this.scale);
    }
    else {
      console.log(`guide_left = ${(mid_left - div!.offsetLeft*-1)} + ${((mid_left - div!.offsetLeft*-1) % this.scale)}`);
      guide_left = (mid_left - div!.offsetLeft*-1) + ((mid_left - div!.offsetLeft*-1) % this.scale);
    }
    
    divg!.style.top = `${guide_top}px`;
    divg!.style.left = `${guide_left}px`;
    console.log(`guide_top = ${guide_top}, guide_left = ${guide_left}`);
;

    //Initial values of bx and cy updated 
    this.cx = divg!.offsetLeft;
    this.cy = divg!.offsetTop;

  }

  getBrushSize(size:any) {
    this.brush_size_parent = size;
    this.adjustGuideRectSize(size*this.scale);
    console.log(`b size:${this.brush_size_parent}`);
  }


}

/**
 * 
 * 
 * TODO:
 * # Align Painting => Odd numbers are always off by 20px (half scale)
 * #                => Even numbers off by a few pixels, might aply to odds too
 * # Speed up guideRect when dragging -> It's taking a lot of time for the guide to catch up
 * # cx, cy => maybe change to initial_x, initial_y or natural_x, natural_y
 * # topg and leftg => guide_y_delta, guide_x_delta
 * w
 */

