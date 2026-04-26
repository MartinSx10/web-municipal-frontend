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

  // guía
  place?: string;
  schedule?: string;
  needsAppointment?: boolean;
  modality?: 'presencial' | 'online' | 'mixto';

  // links
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;

  // markdown / richtext
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
    const qs =
      `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&pagination[pageSize]=1`;

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => {
        const first = (res?.data ?? [])[0];
        return first ? this.mapItem(first) : null;
      })
    );
  }

  private mapItem(x: any): TramiteItem {
    // tu API viene plano (no attributes), por eso usamos x.title, etc.
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
      modality: x.modality ?? 'presencial',

      primaryLabel: x.primaryLabel ?? '',
      primaryUrl: x.primaryUrl ?? '',
      secondaryLabel: x.secondaryLabel ?? '',
      secondaryUrl: x.secondaryUrl ?? '',

      notes: x.notes ?? '',
    };
  }
}