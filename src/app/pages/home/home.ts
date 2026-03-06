import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { NewsService, NewsItem } from '../../services/news';
import { NoticeService } from '../../services/notice';

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

  latest$: Observable<NewsItem[]> = this.newsService.getLatest(3).pipe(
    catchError((err) => {
      console.error('Error cargando últimas noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );
}