import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, map, of, shareReplay } from 'rxjs';

import { EventsService, EventItem } from '../../services/events';

type FilterKey = 'all' | 'today' | 'week' | 'month' | 'past';

type LinkInfo =
  | { external: true; url: string }
  | { external: false; url: any[] };

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css'],
})
export class Agenda {
  private eventsService = inject(EventsService);

  // filtro seleccionado
  filter: FilterKey = 'all';

  // base (trae todo)
  private eventsRaw$ = this.eventsService.getAll(100).pipe(
    catchError((err) => {
      console.error('Error cargando agenda:', err);
      return of([] as EventItem[]);
    }),
    shareReplay(1)
  );

  // filtrado + ordenado para el template
  events$ = this.eventsRaw$.pipe(
    map((events) => {
      // orden por fecha asc
      const sorted = [...events].sort((a, b) => {
        const da = new Date(a.startAt ?? '').getTime();
        const db = new Date(b.startAt ?? '').getTime();
        return da - db;
      });

      return sorted.filter((e) => this.matchesFilter(e, this.filter));
    })
  );

  // Cambia filtro
  setFilter(key: FilterKey) {
    this.filter = key;
    // no hace falta nada más: el async pipe re-renderiza, y el map usa this.filter
    // Angular vuelve a ejecutar el template y recalcula el pipe.
  }

  // Link “Ver detalle”: externo si tiene url, sino va al detalle interno por documentId
  eventLink(e: EventItem): LinkInfo {
    if (e.url) return { external: true, url: e.url };
    return { external: false, url: ['/agenda', e.documentId] };
  }

  // --- helpers de filtro ---
  private matchesFilter(e: EventItem, key: FilterKey): boolean {
    const start = this.toDate(e.startAt);
    if (!start) return key === 'all';

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const isPast = start.getTime() < todayStart.getTime();
    const isToday = start.getTime() >= todayStart.getTime() && start.getTime() < todayEnd.getTime();

    if (key === 'all') return true;
    if (key === 'today') return isToday;
    if (key === 'past') return isPast;

    if (key === 'week') {
      const end = new Date(todayStart);
      end.setDate(end.getDate() + 7);
      return start.getTime() >= todayStart.getTime() && start.getTime() < end.getTime();
    }

    if (key === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return start.getTime() >= monthStart.getTime() && start.getTime() < nextMonthStart.getTime();
    }

    return true;
  }

  private toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}