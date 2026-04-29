import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type EventItem = {
  id: number;
  title: string;
  location?: string;
  startAt?: string; // ISO
  endAt?: string | null;
  excerpt?: string;
  url?: string | null;
  order?: number;
  active?: boolean;

  coverUrl?: string | null; // ✅ imagen
};

@Injectable({ providedIn: 'root' })
export class EventsService {
  private baseUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  // Lista para Home (próximos)
  getUpcoming(limit = 4): Observable<EventItem[]> {
    const qs =
      `?sort=order:asc` +
      `&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}` +
      `&populate=cover`; // ✅ traer imagen

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  // Lista completa para /agenda
  getAll(limit = 50): Observable<EventItem[]> {
    const qs =
      `?sort=startAt:asc` +
      `&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}` +
      `&populate=cover`;

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  // ✅ detalle por ID (para /agenda/:id)
  getById(id: number): Observable<EventItem | null> {
    const qs = `?populate=cover`;
    return this.http.get<any>(`${this.baseUrl}/${id}${qs}`).pipe(
      map((res) => (res?.data ? this.mapItem(res.data) : null))
    );
  }

  private mapItem(x: any): EventItem {
    // Strapi puede venir "plano" o con attributes, cubrimos ambos:
    const a = x?.attributes ? { id: x.id, ...x.attributes } : x;

    const cover = a?.cover?.data;
    const coverUrl = cover?.attributes?.url
      ? `${environment.apiUrl}${cover.attributes.url}`
      : null;

    return {
      id: a.id,
      title: a.title ?? '',
      location: a.location ?? '',
      startAt: a.startAt ?? a.StartAt ?? '',
      endAt: a.endAt ?? a.EndAt ?? null,
      excerpt: a.excerpt ?? '',
      url: a.url ?? null,
      order: a.order ?? 0,
      active: a.active ?? true,
      coverUrl,
    };
  }
}