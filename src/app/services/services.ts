import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type ServiceType = 'internal' | 'external' | 'phone' | 'whatsapp';

export type ServiceItem = {
  id: number;
  title: string;
  subtitle?: string;
  icon?: string;
  type: ServiceType;
  url?: string | null;
  order?: number;
  active?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private baseUrl = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  getAll(limit = 4): Observable<ServiceItem[]> {
    const qs =
      `?sort=order:asc&filters[active][$eq]=true` +
      `&pagination[pageSize]=${limit}`;

    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  private mapItem(x: any): ServiceItem {
    return {
      id: x.id,
      title: x.title ?? '',
      subtitle: x.subtitle ?? '',
      icon: x.icon ?? '',
      type: (x.type ?? 'internal') as ServiceType,
      url: x.url ?? null,
      order: x.order ?? 0,
      active: x.active ?? true,
    };
  }

  // 🔹 arma el link final según type (y maneja url null)
  buildHref(s: ServiceItem): string {
    if (s.type === 'external') return s.url ?? '#';

    if (s.type === 'phone') return `tel:${(s.url ?? '').replace(/\s/g, '')}`;

    if (s.type === 'whatsapp') {
      const raw = (s.url ?? '').replace(/[^\d]/g, '');
      return raw ? `https://wa.me/${raw}` : '#';
    }

    // internal
    return s.url && s.url.startsWith('/') ? s.url : '/contacto';
  }

  isExternal(s: ServiceItem): boolean {
    return s.type === 'external' || s.type === 'whatsapp';
  }
}