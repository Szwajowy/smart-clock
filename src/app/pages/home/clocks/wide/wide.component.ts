import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-wide-clock',
  templateUrl: './wide.component.html',
  styleUrls: ['./wide.component.scss']
})
export class WideComponent implements OnInit {

  @Input() time;
  @Input() timezone$;

  constructor() { }

  ngOnInit() {
  }

}
