import { Component, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-poup-view-image',
  templateUrl: './poup-view-image.component.html',
  styleUrls: ['./poup-view-image.component.scss']
})
export class PoupViewImageComponent implements OnInit {

  @Input() srcImage;
  public degree = 0;
  
  constructor(
    private renderer: Renderer2
  ) { }

  onClickRoate() {
    this.degree += 90;   
    let image = document.getElementById('image_view');
    this.renderer.setStyle(
      image,
      'transform',
      `rotate(${this.degree}deg)`
    );
    if((this.degree/90)%2 == 1) {
      console.log('abc');
      console.log(window.innerHeight);
      const height = 500;
      this.renderer.setStyle(
        image,
        'height',
        `${height}px`
      );
      this.renderer.setStyle(
        image,
        'width',
        `auto`
      );
    } else {
      const width = 900;

      this.renderer.setStyle(
        image,
        'height',
        `auto`
      );
      this.renderer.setStyle(
        image,
        'width',
        `${width}px`
      );
    }
  }

  ngOnInit(): void {
    console.log(this.srcImage);
  }

}
