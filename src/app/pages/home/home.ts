import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay, map } from 'rxjs';

import { NewsService, NewsItem } from '../../services/news';
import { NoticeService } from '../../services/notice';

import { ServicesService, ServiceItem } from '../../services/services';
import { EventsService, EventItem } from '../../services/events';
import { EmergencyService, EmergencyItem } from '../../services/emergency';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  private newsService = inject(NewsService);
  noticeService = inject(NoticeService);

  private servicesService = inject(ServicesService);
  private eventsService = inject(EventsService);
  private emergencyService = inject(EmergencyService);

  // 1) Noticias
  latest$: Observable<NewsItem[]> = this.newsService.getLatest(3).pipe(
    catchError((err) => {
      console.error('Error cargando últimas noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );

  // ✅ 2) Services: traemos muchos para poder recortar 4 + 4
  services$: Observable<ServiceItem[]> = this.servicesService.getAll(50).pipe(
    catchError((err) => {
      console.error('Error cargando services:', err);
      return of([] as ServiceItem[]);
    }),
    shareReplay(1)
  );

  // ✅ 4 internos fijos
  accessInternal$: Observable<ServiceItem[]> = this.services$.pipe(
    map((list) => (list ?? []).filter((s) => s.type === 'internal').slice(0, 4)),
    shareReplay(1)
  );

  // ✅ 4 externos fijos
  accessExternal$: Observable<ServiceItem[]> = this.services$.pipe(
    map((list) => (list ?? []).filter((s) => s.type !== 'internal').slice(0, 4)),
    shareReplay(1)
  );

  // 3) Agenda y eventos (Strapi)
  events$: Observable<EventItem[]> = this.eventsService.getUpcoming(4).pipe(
    catchError((err) => {
      console.error('Error cargando events:', err);
      return of([] as EventItem[]);
    }),
    shareReplay(1)
  );

  // 4) Emergencias (Strapi)
  emergencies$: Observable<EmergencyItem[]> = this.emergencyService.getAll().pipe(
    catchError((err) => {
      console.error('Error cargando emergencies:', err);
      return of([] as EmergencyItem[]);
    }),
    shareReplay(1)
  );

  // Helpers para links en el HTML (Servicios)
  serviceHref = (s: ServiceItem) => this.servicesService.buildHref(s);
  serviceTarget = (s: ServiceItem) => (this.servicesService.isExternal(s) ? '_blank' : null);

  // Helpers para links en el HTML (Eventos)
  eventHref = (e: EventItem) => (e.url ? e.url : '/noticias');
  eventTarget = (e: EventItem) => (e.url ? '_blank' : null);

  // Helpers para links en el HTML (Emergencias)
  emergencyHref = (e: EmergencyItem) => this.emergencyService.buildHref(e);

  // UI helpers (Emergencias)
  emergencyIcon = (e: EmergencyItem) => {
    if (e.type === 'whatsapp') return '💬';
    if (e.type === 'url') return '🔗';
    return '📞';
  };

  emergencyCta = (e: EmergencyItem) => {
    if (e.type === 'whatsapp') return 'WhatsApp';
    if (e.type === 'url') return 'Abrir';
    return 'Llamar';
  };

  emergencyTarget = (e: EmergencyItem) =>
    e.type === 'url' || e.type === 'whatsapp' ? '_blank' : null;
}

