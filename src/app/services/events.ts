import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type EventItem = {
  id: number;
  documentId: string;
  title: string;
  location?: string;
  startAt?: string;
  endAt?: string | null;
  excerpt?: string;
  url?: string | null;
  order?: number;
  active?: boolean;

  coverUrl?: string | null;
};

@Injectable({ providedIn: 'root' })
export class EventsService {
  private baseUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  // Para Home (próximos)
  getUpcoming(limit = 4): Observable<EventItem[]> {
    const qs =
      `?sort=order:asc&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}` +
      `&populate=*`;

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  // Para /agenda (lista completa)
  getAll(limit = 50): Observable<EventItem[]> {
    const qs =
      `?sort=StartAt:asc&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}` +
      `&populate=*`;

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  // ✅ Detalle (Strapi v5): por documentId
  getByDocumentId(documentId: string): Observable<EventItem | null> {
    return this.http
      .get<any>(`${this.baseUrl}/${encodeURIComponent(documentId)}?populate=*`)
      .pipe(map((res) => (res?.data ? this.mapItem(res.data) : null)));
  }

  // (Opcional) Plan B por id numérico (si alguna vez el backend no acepta documentId)
  getById(id: number): Observable<EventItem | null> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}?populate=*`)
      .pipe(map((res) => (res?.data ? this.mapItem(res.data) : null)));
  }

  private mapItem(x: any): EventItem {
    // cover puede ser array (multiple) o objeto (single)
    const cover = Array.isArray(x.cover) ? x.cover[0] : x.cover;

    const rawUrl =
      cover?.formats?.large?.url ??
      cover?.formats?.medium?.url ??
      cover?.formats?.small?.url ??
      cover?.formats?.thumbnail?.url ??
      cover?.url ??
      null;

    const coverUrl = rawUrl ? this.absoluteUrl(rawUrl) : null;

    return {
      id: x.id,
      documentId: x.documentId ?? '',
      title: x.title ?? '',
      location: x.location ?? '',
      // ✅ tu Strapi devuelve StartAt/EndAt (con mayúscula)
      startAt: x.StartAt ?? x.startAt ?? '',
      endAt: x.EndAt ?? x.endAt ?? null,
      excerpt: x.excerpt ?? '',
      url: x.url ?? null,
      order: x.order ?? 0,
      active: x.active ?? true,
      coverUrl,
    };
  }

  private absoluteUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.apiUrl}${url}`;
  }
}