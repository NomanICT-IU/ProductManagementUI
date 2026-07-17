import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  public notification$ = new Subject<{ user: string; message: string; productId?: any }>();

  constructor() {}

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44313/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Started! 🚀'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  public addNotificationListener() {
    this.hubConnection.on(
      'ReceivedNotification',
      (user: string, message: string, productId?: any) => {
        this.notification$.next({ user, message, productId });
      },
    );
  }

  public broadcastNotification(user: string, message: string, productId?: any) {
    this.hubConnection
      .invoke('SendNotification', user, message, productId)
      .catch((err) => console.error(err));
  }
}
