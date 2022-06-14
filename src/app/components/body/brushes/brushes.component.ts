import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

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

  constructor() { }

  ngOnInit(): void {
    const btn = document.getElementById("brushes-btn");
    const menu = document.getElementById("brushes-menu");

    btn?.addEventListener('mousedown',(e:any)=> {
      this.pressed = true;
      console.log(`top: ${btn!.offsetTop}, left: ${btn!.offsetLeft}`);
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
    });

    btn?.addEventListener('mousemove',(e:any)=> {
      
      if(this.pressed) {
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        console.log(`top: ${btn!.offsetTop}, left: ${btn!.offsetLeft}`);

        console.log(`X: ${e.clientX}, Y: ${e.clientY}`);
        console.log(`this.pos2: ${this.pos2}`);

        btn!.style.top = (btn!.offsetTop - this.pos2) + "px";
        btn!.style.left = (btn!.offsetLeft - this.pos1) + "px";

        console.log(`top: ${btn!.offsetTop}, left: ${btn!.offsetLeft}`);
      }
    });

    btn?.addEventListener('mouseup',()=> {
      this.pressed = false;
      console.log(`top: ${btn!.offsetTop}, left: ${btn!.offsetLeft}`);
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

}
