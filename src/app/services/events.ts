import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type EventItem = {
  id: number;
  title: string;
  location?: string;
  startAt?: string;  // ISO
  endAt?: string | null;
  excerpt?: string;
  url?: string | null;
  order?: number;
  active?: boolean;
};

@Injectable({ providedIn: 'root' })
export class EventsService {
  private baseUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  getUpcoming(limit = 3): Observable<EventItem[]> {
    const qs = `?sort=order:asc&filters[active][$eq]=true&pagination[pageSize]=${limit}`;
    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  private mapItem(x: any): EventItem {
    return {
      id: x.id,
      title: x.title ?? '',
      location: x.location ?? '',
      // ✅ tu API trae StartAt/EndAt
      startAt: x.StartAt ?? '',
      endAt: x.EndAt ?? null,
      excerpt: x.excerpt ?? '',
      url: x.url ?? null,
      order: x.order ?? 0,
      active: x.active ?? true,
    };
  }
}