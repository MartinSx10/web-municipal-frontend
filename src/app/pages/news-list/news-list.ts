import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, startWith, switchMap, catchError, of, shareReplay } from 'rxjs';
import { NewsService, NewsItem } from '../../services/news';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './news-list.html',
})
export class NewsListComponent {
  private newsService = inject(NewsService);

  search = new FormControl('', { nonNullable: true });

  news$: Observable<NewsItem[]> = this.search.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => this.newsService.search(q)),
    catchError((err) => {
      console.error('Error cargando noticias:', err);
      return of([] as NewsItem[]);
    }),
    shareReplay(1)
  );
}