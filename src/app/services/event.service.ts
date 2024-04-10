import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {

    //https://testapi.fundark.com/api/event
    private url = environment.endpoints.api;

    constructor(private http: HttpClient) { }

    //data:
    // [{ "_id": "6616a620aeee0764ca88801d", 
    //"eventId": "13740", 
    // "eventTitle": "El SALVADOR WEB3 EVENT", 
    // "eventDescription": "El SALVADOR WEB3 EVENT", 
    // "eventLocation": "San Salvador, El Salvador", 
    // "eventDate": "2024-06-16T00:00:00.000Z", 
    // "eventRegistrationDeadline": "2024-05-31T00:00:00.000Z", 
    // "eventRegistrationUrl": "", 
    // "eventOrganizer": "Pay.Cool", 
    // "eventCustomerServiceEmail":
    //  "marketing@pay.cool", "__v": 0 }]
    getEvents() {
        return this.http.get(`${this.url}/event`);
    }


    getEvent(id: number) {
        return this.http.get(`${this.url}/events/${id}`);
    }

    
    // addEvent(event: Event) {
    //     return this.http.post('http://localhost:3000/events', event);
    // }

    // updateEvent(event: Event) {
    //     return this.http.put(`http://localhost:3000/events/${event.id}`, event);
    // }

    // deleteEvent(id: number) {
    //     return this.http.delete(`http://localhost:3000/events/${id}`);
    // }
}
