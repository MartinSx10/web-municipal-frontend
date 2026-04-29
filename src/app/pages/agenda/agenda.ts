import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay } from 'rxjs';

import { EventsService, EventItem } from '../../services/events';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css'],
})
export class Agenda {
  private eventsService = inject(EventsService);

  // ✅ TIPADO explícito para evitar "unknown" en el template
  events$: Observable<EventItem[]> = this.eventsService.getAll(50).pipe(
    catchError((err) => {
      console.error('Error cargando agenda:', err);
      return of([] as EventItem[]);
    }),
    shareReplay(1)
  );

  // ✅ Link “Ver detalle”: externo si tiene url, sino va al detalle interno por documentId
  eventLink(e: EventItem) {
    if (e.url) return { external: true, url: e.url };
    return { external: false, url: ['/agenda', e.documentId] };
  }
}