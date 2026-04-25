import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  coverUrl?: string | null;
};

@Injectable({ providedIn: 'root' })
export class NewsService {
  private api = environment.apiUrl; 
  private baseUrl = `${this.api}/api/news1`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NewsItem[]> {
    return this.http
      .get<any>(`${this.baseUrl}?sort=publishedAt:desc&populate=cover`)
      .pipe(map((res) => (res.data ?? []).map((item: any) => this.mapItem(item))));
  }

  search(query: string): Observable<NewsItem[]> {
    const q = query.trim();
    if (!q) return this.getAll();

    const url =
      `${this.baseUrl}?sort=publishedAt:desc&populate=cover` +
      `&filters[title][$containsi]=${encodeURIComponent(q)}`;

    return this.http
      .get<any>(url)
      .pipe(map((res) => (res.data ?? []).map((item: any) => this.mapItem(item))));
  }

  getLatest(limit: number): Observable<NewsItem[]> {
    return this.http
      .get<any>(
        `${this.baseUrl}?sort=publishedAt:desc&populate=cover&pagination[page]=1&pagination[pageSize]=${limit}`
      )
      .pipe(map((res) => (res.data ?? []).map((item: any) => this.mapItem(item))));
  }

  getRelated(currentSlug: string | null, limit = 3): Observable<NewsItem[]> {
    return this.getLatest(limit + 2).pipe(
      map((items) => items.filter((n) => n.slug !== currentSlug).slice(0, limit))
    );
  }

  getBySlug(slug: string | null): Observable<NewsItem | null> {
    if (!slug) return of(null);

    const url = `${this.baseUrl}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const first = res?.data?.[0];
        return first ? this.mapItem(first) : null;
      })
    );
  }

  private mapItem(base: any): NewsItem {
    const coverFirst = Array.isArray(base.cover) ? base.cover[0] : base.cover;

    const relativeUrl =
      coverFirst?.formats?.small?.url ??
      coverFirst?.formats?.thumbnail?.url ??
      coverFirst?.url ??
      null;

    return {
      id: base.id,
      title: base.title,
      slug: base.slug,
      excerpt: base.excerpt,
      content: base.content,
      publishedAt: base.publishedAt,
      // ✅ /uploads/... se pega al ORIGIN del backend, no a /api/news1
      coverUrl: relativeUrl ? `${this.api}${relativeUrl}` : null,
    };
  }
}