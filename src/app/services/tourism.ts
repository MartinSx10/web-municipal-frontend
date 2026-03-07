import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export type TourismCategory =
  | 'naturaleza'
  | 'cultura'
  | 'eventos'
  | 'gastronomia'
  | 'alojamiento';

export type TourismPlace = {
  id: number;
  title: string;
  category: TourismCategory;     // viene de "valores"
  excerpt?: string;
  description?: string;
  coverUrl?: string | null;
  slug?: string | null;
  mapsUrl?: string | null;
};

@Injectable({ providedIn: 'root' })
export class TourismService {
  private api = environment.apiUrl; // ej: https://web-municipal-backend-production.up.railway.app
  private baseUrl = `${this.api}/api/places`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TourismPlace[]> {
    return this.http
      .get<any>(`${this.baseUrl}?sort=publishedAt:desc&populate=cover`)
      .pipe(map((res) => (res.data ?? []).map((item: any) => this.mapItem(item))));
  }

  // ✅ traer 1 lugar por slug
  getBySlug(slug: string | null): Observable<TourismPlace | null> {
    if (!slug) return of(null);

    const url =
      `${this.baseUrl}?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&populate=cover`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const first = res?.data?.[0];
        return first ? this.mapItem(first) : null;
      })
    );
  }

  private mapItem(base: any): TourismPlace {
    const cover = base.cover ?? null;

    const relativeUrl =
      cover?.formats?.small?.url ??
      cover?.formats?.thumbnail?.url ??
      cover?.url ??
      null;

    const raw = (base.valores ?? '').toString().toLowerCase().trim();

    const category: TourismCategory =
      raw === 'naturaleza' ? 'naturaleza' :
      raw === 'cultura' ? 'cultura' :
      raw === 'eventos' ? 'eventos' :
      raw === 'gastronomía' || raw === 'gastronomia' ? 'gastronomia' :
      raw === 'alojamiento' ? 'alojamiento' :
      'eventos';

    return {
      id: base.id,
      title: base.title ?? '',
      slug: base.slug ?? null,
      category,
      excerpt: base.excerpt ?? '',
      description: base.description ?? '',
      mapsUrl: base.mapsUrl ?? null,
      // ✅ /uploads/... se pega al ORIGIN del backend
      coverUrl: relativeUrl ? `${this.api}${relativeUrl}` : null,
    };
  }
}