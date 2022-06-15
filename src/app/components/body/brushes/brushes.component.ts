import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-brushes',
  templateUrl: './brushes.component.html',
  styleUrls: ['./brushes.component.scss']
})
export class BrushesComponent implements OnInit {

  toggled = false;
  pressed = false;

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
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;


        console.log(`X: ${e.clientX}, Y: ${e.clientY}`);
        console.log(`this.pos2: ${this.pos2}`);

        btn!.style.top = (btn!.offsetTop - this.pos2) + "px";
        btn!.style.left = (btn!.offsetLeft - this.pos1) + "px";
      }
    });

    btn?.addEventListener('mouseup',()=> {
      this.pressed = false;
    });
  


  }

  toggleBrushes(){
    const menu = document.getElementById("brushes-menu");
    if(this.toggled) {
      menu!.classList.remove("brushes-menu");
      console.log('removing');
      this.toggled = false;
    }
    else {
      menu!.classList.add("brushes-menu");
      console.log('adding');
      this.toggled = true;
    }
    

  }

  changeBrushSize(size:any) {
    this.brushSize.emit(size);
  }

}
