import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { NewsService, NewsItem } from '../../services/news';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-detail.html',
})
export class NewsDetailComponent {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  slug$: Observable<string | null> = this.route.paramMap.pipe(
    map((p) => p.get('slug')),
    shareReplay(1)
  );

  item$: Observable<NewsItem | null> = this.slug$.pipe(
    switchMap((slug) => this.newsService.getBySlug(slug)),
    catchError((err) => {
      console.error('Error cargando detalle:', err);
      return of(null);
    }),
    shareReplay(1)
  );

  related$: Observable<NewsItem[]> = this.slug$.pipe(
    switchMap((slug) => this.newsService.getRelated(slug, 3)),
    catchError((err) => {
      console.error('Error cargando relacionadas:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );

  copyLink() {
    const url = window.location.href;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  }
}