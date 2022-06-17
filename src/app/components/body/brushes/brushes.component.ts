import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-brushes',
  templateUrl: './brushes.component.html',
  styleUrls: ['./brushes.component.scss']
})
export class BrushesComponent implements OnInit {

  toggled = false;
  pressed = false;
  stop_menu_expansion = false;
  moved = false;
  selected = false;

  pos1 = 0; // Tracks outer div positions
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;

  @Output() brushSize = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    const btn = document.getElementById("brushes-btn");
    const menu = document.getElementById("brushes-menu");

    btn?.addEventListener('mousedown',(e:any)=> {
      this.pressed = true;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
    });

    window.addEventListener('mousemove',(e:any)=> {
      
      if(this.pressed) { // Drag algo
        this.moved = true;
        this.stop_menu_expansion = true;
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        btn!.style.top = (btn!.offsetTop - this.pos2) + "px";
        btn!.style.left = (btn!.offsetLeft - this.pos1) + "px";

        console.log(`this.toggled = ${this.toggled}`);
      }
    });

    btn?.addEventListener('mouseup',()=> {
      this.pressed = false;
      if(!this.moved && !this.toggled){
        this.toggleBrushes();
        this.toggled = true;
      }
      else if(!this.moved && this.toggled){
        this.toggleBrushes();
        this.toggled = false;
      }

      if(this.moved) this.moved = false;
      
    });
  


  }

  toggleBrushes(){
    const menu = document.getElementById("brushes-menu");
    if(this.toggled) {
      menu!.classList.remove("brushes-menu");
    }
    else {
      menu!.classList.add("brushes-menu");
    }
    

  }

  changeBrushSize(size:any) {
    this.brushSize.emit(size);
  }

}
