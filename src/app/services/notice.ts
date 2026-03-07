import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export type Notice = {
  id?: number;
  title?: string;
  message?: string;
  active?: boolean;
  variant?: 'info' | 'warning' | 'success' | 'danger' | string;
  linkText?: string;
  linkUrl?: string;
  updatedAt?: string;
  documentId?: string;
};

const API = 'https://web-municipal-backend-production.up.railway.app';
const NOTICE_ENDPOINT = '/api/aviso'; // ✅ SINGLE TYPE real
const CLOSED_PREFIX = 'municipal_notice_closed_';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  notice$: Observable<Notice | null>;

  constructor(private http: HttpClient) {
    this.notice$ = this.http.get<any>(`${API}${NOTICE_ENDPOINT}`).pipe(
      map((res) => {
        const d = res?.data ?? null;
        if (!d) return null;

        // v4: data.attributes, v5: data directo
        const a = d?.attributes ?? d;

        return {
          id: d.id ?? a.id,
          title: a.title,
          message: typeof a.message === 'string' ? a.message : String(a.message ?? ''),
          active: a.active ?? true,
          variant: a.variant ?? 'info',
          linkText: a.linkText,
          linkUrl: a.linkUrl,
          updatedAt: a.updatedAt ?? d.updatedAt,
          documentId: a.documentId ?? d.documentId,
        } as Notice;
      }),
      catchError((err) => {
        console.error('Error cargando aviso:', err);
        return of(null);
      }),
      shareReplay(1)
    );
  }

  private getCloseKey(n: Notice): string {
    // si cambia el aviso (updatedAt/documentId), vuelve a mostrarse
    const version = n.updatedAt || n.documentId || String(n.id ?? 'v1');
    return `${CLOSED_PREFIX}${version}`;
  }

  isClosed(n: Notice): boolean {
    return localStorage.getItem(this.getCloseKey(n)) === 'true';
  }

  close(n: Notice) {
    localStorage.setItem(this.getCloseKey(n), 'true');
  }
}