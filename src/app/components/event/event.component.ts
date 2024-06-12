import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event.interface';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  isLoaded = false;
  constructor(
    private eventServ: EventService
  ) {

  }


  ngOnInit() {
    this.eventServ.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.isLoaded = true;
      },
      error: (err) => {
        console.log(err);
        this.isLoaded = true;
      }
     

    });


  }
}
