import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject, catchError, of, shareReplay, timer, map } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { NewsService, NewsItem } from '../../services/news';
import { NoticeService } from '../../services/notice';

import { ServicesService, ServiceItem } from '../../services/services';
import { EventsService, EventItem } from '../../services/events';
import { EmergencyService, EmergencyItem } from '../../services/emergency';

import { WeatherService } from '../../services/wheater';

type CampaignSlide = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
  linkUrl?: string | null;
  linkText?: string;
  external?: boolean;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  noticeService = inject(NoticeService);

  private servicesService = inject(ServicesService);
  private eventsService = inject(EventsService);
  private emergencyService = inject(EmergencyService);

  private weatherService = inject(WeatherService);

  // ✅ Reloj + clima
  now = new Date();
  tempC: number | null = null;
  weatherLabel = '—';

  private destroy$ = new Subject<void>();

  // ✅ Slider / campañas institucionales
  campaignSlides: CampaignSlide[] = [
    {
      title: 'Prevención vial',
      subtitle: 'Bajemos la velocidad para cuidarnos más.',
      imageUrl: 'assets/campanias/prevencion-vial.jpg',
      alt: 'Campaña de prevención vial',
      linkUrl: '/noticias',
      external: false,
    },
    {
      title: 'Campaña de salud',
      subtitle: 'Vacunación y controles preventivos para la comunidad.',
      imageUrl: 'assets/campanias/salud.jpg',
      alt: 'Campaña de salud',
      linkUrl: '/noticias',
      external: false,
    },
    {
      title: 'Cuidado del ambiente',
      subtitle: 'Separación de residuos y concientización ambiental.',
      imageUrl: 'assets/campanias/ambiente.jpg',
      alt: 'Campaña de cuidado del ambiente',
      linkUrl: '/noticias',
      external: false,
    },
  ];

  currentCampaign = 0;
  private campaignInterval: ReturnType<typeof setInterval> | null = null;

  // 1) Noticias
  latest$: Observable<NewsItem[]> = this.newsService.getLatest(4).pipe(
    catchError((err) => {
      console.error('Error cargando últimas noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );

  // 2) Servicios (Strapi) - base
  services$: Observable<ServiceItem[]> = this.servicesService.getAll(12).pipe(
    catchError((err) => {
      console.error('Error cargando services:', err);
      return of([] as ServiceItem[]);
    }),
    shareReplay(1)
  );

  // ✅ Split para HOME (internos vs externos)
  accessInternal$: Observable<ServiceItem[]> = this.services$.pipe(
    map((items) => items.filter((s) => s.type !== 'external')),
    shareReplay(1)
  );

  accessExternal$: Observable<ServiceItem[]> = this.services$.pipe(
    map((items) => items.filter((s) => s.type === 'external')),
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

  ngOnInit(): void {
    // 1) Reloj (cada 30s)
    timer(0, 30_000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.now = new Date()));

    // 2) Clima (cada 10 min)
    const LAT = -31.57; // Ulapes aprox
    const LON = -66.25; // Ulapes aprox

    timer(0, 10 * 60_000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.weatherService.getNow(LAT, LON))
      )
      .subscribe({
        next: (w) => {
          this.tempC = w.tempC;
          this.weatherLabel = w.label || '—';
        },
        error: (err) => {
          console.error('Error clima:', err);
          this.tempC = null;
          this.weatherLabel = 'Sin datos';
        },
      });

    // 3) Slider automático
    this.startCampaignAutoplay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.stopCampaignAutoplay();
  }

  // =========================================================
  // Helpers para links en el HTML (Servicios)
  // =========================================================
  serviceHref = (s: ServiceItem) => this.servicesService.buildHref(s);
  serviceTarget = (s: ServiceItem) => (this.servicesService.isExternal(s) ? '_blank' : null);

  // =========================================================
  // Helpers para links en el HTML (Eventos)
  // =========================================================
  eventHref = (e: EventItem) => (e.url ? e.url : '/agenda');
  eventTarget = (e: EventItem) => (e.url ? '_blank' : null);

  // =========================================================
  // Helpers para links en el HTML (Emergencias)
  // =========================================================
  emergencyHref = (e: EmergencyItem) => this.emergencyService.buildHref(e);

  emergencyCta = (e: EmergencyItem) => {
    if (e.type === 'whatsapp') return 'WhatsApp';
    if (e.type === 'url') return 'Abrir';
    return 'Llamar';
  };

  emergencyTarget = (e: EmergencyItem) =>
    e.type === 'url' || e.type === 'whatsapp' ? '_blank' : null;

  // =========================================================
  // Helpers slider campañas
  // =========================================================
  get currentCampaignSlide(): CampaignSlide | null {
    if (!this.campaignSlides.length) return null;
    return this.campaignSlides[this.currentCampaign];
  }

  startCampaignAutoplay(): void {
    this.stopCampaignAutoplay();

    if (this.campaignSlides.length <= 1) return;

    this.campaignInterval = setInterval(() => {
      this.nextCampaign();
    }, 5000); // cambia cada 5 segundos
  }

  stopCampaignAutoplay(): void {
    if (this.campaignInterval) {
      clearInterval(this.campaignInterval);
      this.campaignInterval = null;
    }
  }

  nextCampaign(): void {
    if (!this.campaignSlides.length) return;

    this.currentCampaign =
      this.currentCampaign === this.campaignSlides.length - 1
        ? 0
        : this.currentCampaign + 1;
  }

  prevCampaign(): void {
    if (!this.campaignSlides.length) return;

    this.currentCampaign =
      this.currentCampaign === 0
        ? this.campaignSlides.length - 1
        : this.currentCampaign - 1;
  }

  goToCampaign(index: number): void {
    if (index < 0 || index >= this.campaignSlides.length) return;
    this.currentCampaign = index;
  }
}