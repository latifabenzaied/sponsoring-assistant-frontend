import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AiSocketService {
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket('ws://localhost:8001/ws/suggestions');
        this.socket$.subscribe({
            next: (msg) => console.log('Message from server:', msg),
            error: (err) => console.error('WebSocket error:', err),
            complete: () => console.warn('WebSocket closed'),
        });
    }

    send(field: string, content: string, context: any): void {
        const payload = {
            field,
            content,
            context,
        };
        this.socket$.next(JSON.stringify(payload));
    }

    onMessage() {
        return this.socket$;
    }

    close() {
        this.socket$.complete();
    }
}
