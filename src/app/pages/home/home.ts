import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { NewsService, NewsItem } from '../../services/news';
import { NoticeService } from '../../services/notice';
import { SERVICES } from '../../data/services.data';
import { EVENTS } from '../../data/events.data';
import { EMERGENCIES } from '../../data/emergency.data';

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
  services = SERVICES;
  events = EVENTS;
  emergencies = EMERGENCIES;

  latest$: Observable<NewsItem[]> = this.newsService.getLatest(3).pipe(
    catchError((err) => {
      console.error('Error cargando últimas noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );
}