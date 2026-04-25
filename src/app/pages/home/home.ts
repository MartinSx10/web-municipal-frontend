import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay } from 'rxjs';

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

  // 2) Servicios y trámites (Strapi) -> 6 para que se vea completo
  services$: Observable<ServiceItem[]> = this.servicesService.getAll(6).pipe(
    catchError((err) => {
      console.error('Error cargando services:', err);
      return of([] as ServiceItem[]);
    }),
    shareReplay(1)
  );

  // 3) Agenda y eventos (Strapi) -> 4 para que se vea más “real”
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
}