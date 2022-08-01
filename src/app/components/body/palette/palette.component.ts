import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit {

  show_palette = false;
  moved = false;
  pressed = false;

  pos1 = 0; // Tracks outer div positions
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;

  @Output() tileColor = new EventEmitter<any>(); 

  constructor() { }

  ngOnInit(): void {
    const canvas : any = document.getElementById('palette-canvas');
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('palette-btn');
    const icon = document.getElementById('brush-icon');
    let pos;

    btn?.addEventListener('mousedown',(e:any)=> {
      this.pressed = true;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
    });

    window.addEventListener('mousemove',(e:any)=> {
      if(this.pressed) { // Drag algo
        this.moved = true;
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        btn!.style.top = (btn!.offsetTop - this.pos2) + "px";
        btn!.style.left = (btn!.offsetLeft - this.pos1) + "px";

      }
    });

    btn?.addEventListener('mouseup',()=> {
      this.pressed = false;
      if(this.moved) this.moved = false;
      else {
        this.togglePalette();
      }
      
    });

    
    
    canvas?.addEventListener('mousemove', (e:any)=> {
      //palette is drawn on a canvas,
      //so the selected color is extracted through mouse positioning -> getImageData
      if(this.show_palette){
        pos = this.getMousePos(canvas,e);
        let rgb = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        //ctx.fillRect(80,20,40,10);
        btn!.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        this.tileColor.emit(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
      }
    });

    btn?.addEventListener('mouseover', ()=>{
      icon!.style.transform = `scale(1.3,1.3) rotate(-30deg)`;
    });

    btn?.addEventListener('mouseout', ()=>{
      icon!.style.transform = `scale(1,1) rotate(0deg)`;
    });

  }

  togglePalette() {
    const canvas : any = document.getElementById('palette-canvas');
    const ctx = canvas.getContext('2d');
    if(this.show_palette == true) {
      //clear
      ctx.clearRect(0,0,canvas.width,canvas.height);
      canvas.style.pointerEvents = 'none';
      this.show_palette = !this.show_palette
    }
    else {
      canvas.style.pointerEvents = 'auto';
      let img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 50);
      };
      img.src = './assets/img_colormap.gif';
      this.show_palette = !this.show_palette;
    }
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

}
