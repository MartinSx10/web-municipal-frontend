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

  // Noticias
  latest$: Observable<NewsItem[]> = this.newsService.getLatest(3).pipe(
    catchError((err) => {
      console.error('Error cargando últimas noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );

  // Servicios/Trámites
  services$: Observable<ServiceItem[]> = this.servicesService.getAll(4).pipe(
    catchError((err) => {
      console.error('Error cargando services:', err);
      return of([] as ServiceItem[]);
    }),
    shareReplay(1)
  );

  // Eventos (agenda)
  events$: Observable<EventItem[]> = this.eventsService.getUpcoming(3).pipe(
    catchError((err) => {
      console.error('Error cargando events:', err);
      return of([] as EventItem[]);
    }),
    shareReplay(1)
  );

  // Emergencias
  emergencies$: Observable<EmergencyItem[]> = this.emergencyService.getAll().pipe(
    catchError((err) => {
      console.error('Error cargando emergencies:', err);
      return of([] as EmergencyItem[]);
    }),
    shareReplay(1)
  );

  // Helpers para links
  serviceHref = (s: ServiceItem) => this.servicesService.buildHref(s);
  serviceTarget = (s: ServiceItem) => (this.servicesService.isExternal(s) ? '_blank' : null);

  emergencyHref = (e: EmergencyItem) => this.emergencyService.buildHref(e);
}