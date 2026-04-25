import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type EmergencyType = 'phone' | 'whatsapp' | 'url';

export type EmergencyItem = {
  id: number;
  title: string;
  description?: string;
  phone?: string | null;
  type: EmergencyType;
  url?: string | null;
  order?: number;
  active?: boolean;
};

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private api = environment.apiUrl;
  private baseUrl = `${this.api}/api/emergencies`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmergencyItem[]> {
    const qs = `?sort=order:asc&filters[active][$eq]=true`;
    return this.http.get<any>(`${this.baseUrl}${qs}`).pipe(
      map((res) => (res?.data ?? []).map((x: any) => this.mapItem(x)))
    );
  }

  private mapItem(x: any): EmergencyItem {
    return {
      id: x.id,
      title: x.title,
      description: x.description ?? '',
      phone: x.phone ?? null,
      type: (x.type ?? 'phone') as EmergencyType,
      url: x.url ?? null,
      order: x.order ?? 0,
      active: x.active ?? true,
    };
  }

  // Helpers para armar el link clickeable
  buildHref(item: EmergencyItem): string {
    if (item.type === 'phone') return `tel:${(item.phone ?? '').replace(/\s/g, '')}`;

    if (item.type === 'whatsapp') {
      const raw = (item.phone ?? '').replace(/[^\d]/g, ''); // +54 3800... => 543800...
      return `https://wa.me/${raw}`;
    }

    return item.url ?? '#';
  }
}