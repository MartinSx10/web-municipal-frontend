import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type TramiteItem = {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  icon?: string;
  order?: number;
  active?: boolean;

  place?: string;
  schedule?: string;
  needsAppointment?: boolean;
  modality?: 'presencial' | 'online' | 'mixto';

  primaryLabel?: string | null;
  primaryUrl?: string | null;
  secondaryLabel?: string | null;
  secondaryUrl?: string | null;

  notes?: string;
};

@Injectable({ providedIn: 'root' })
export class TramitesService {
  private baseUrl = `${environment.apiUrl}/api/tramites`;

  constructor(private http: HttpClient) {}

  getAll(limit = 50): Observable<TramiteItem[]> {
    const qs =
      `?sort=order:asc&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}`;
    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  getBySlug(slug: string): Observable<TramiteItem | null> {
    const qs = `?filters[slug][$eq]=${encodeURIComponent(slug)}`;
    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => {
        const first = (res?.data ?? [])[0];
        return first ? this.mapItem(first) : null;
      })
    );
  }

  private mapItem(x: any): TramiteItem {
    // Strapi devuelve plano (como el JSON que pegaste)
    return {
      id: x.id,
      title: x.title ?? '',
      slug: x.slug ?? '',
      subtitle: x.subtitle ?? '',
      excerpt: x.excerpt ?? '',
      icon: x.icon ?? '',
      order: x.order ?? 0,
      active: x.active ?? true,

      place: x.place ?? '',
      schedule: x.schedule ?? '',
      needsAppointment: x.needsAppointment ?? false,
      modality: (x.modality ?? 'presencial') as any,

      primaryLabel: x.primaryLabel ?? null,
      primaryUrl: x.primaryUrl ?? null,
      secondaryLabel: x.secondaryLabel ?? null,
      secondaryUrl: x.secondaryUrl ?? null,

      notes: x.notes ?? '',
    };
  }
}