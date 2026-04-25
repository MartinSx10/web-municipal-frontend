import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type MunicipalServiceItem = {
  id: number;
  title: string;
  description?: string;
  icon?: string;     // ej "🪪" o "💳"
  url?: string | null; // link externo o interno
  order?: number;
  active?: boolean;
};

@Injectable({ providedIn: 'root' })
export class MunicipalServicesService {
  private api = environment.apiUrl;
  private baseUrl = `${this.api}/api/services`;

  constructor(private http: HttpClient) {}

  getAll(limit = 4): Observable<MunicipalServiceItem[]> {
    const qs = `?sort=order:asc&filters[active][$eq]=true&pagination[pageSize]=${limit}`;
    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  private mapItem(x: any): MunicipalServiceItem {
    return {
      id: x.id,
      title: x.title,
      description: x.description ?? '',
      icon: x.icon ?? '📌',
      url: x.url ?? null,
      order: x.order ?? 0,
      active: x.active ?? true,
    };
  }
}