import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

export interface ImageAnalysisMessage {
    filename: string;
    analysis: string;
}

@Injectable({
    providedIn: 'root'
})
export class AiImageSocketService {
    private socket$: WebSocketSubject<any>;
    private readonly socketUrl = 'ws://localhost:8000/ws/image-analysis';

    private messageSubject = new Subject<ImageAnalysisMessage>();

    constructor() {
        this.socket$ = webSocket(this.socketUrl);

        this.socket$.subscribe({
            next: (msg: ImageAnalysisMessage) => {
                console.log('📩 Message reçu du serveur:', msg);
                this.messageSubject.next(msg); //
            },
            error: (err) => console.error('❌ WebSocket error:', err),
            complete: () => console.warn('⚠️ WebSocket closed'),
        });
    }

    sendImageBase64(filename: string, base64: string): void {
        this.socket$.next({
            filename,
            image_base64: base64
        });
    }

    onMessage() {
        return this.socket$;
    }

    close(): void {
        this.socket$.complete();
    }
}
