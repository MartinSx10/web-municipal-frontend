import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';

export type Notice = {
  title?: string;
  message?: any; // en Strapi puede venir como string o rich text
  active?: boolean;
  variant?: 'info' | 'warning';
  linkText?: string;
  linkUrl?: string;
  updatedAt?: string;
  documentId?: string;
};

const API = 'http://localhost:1337/api';
const NOTICE_ENDPOINT = 'aviso'; // ✅ según tu Strapi: /api/aviso
const CLOSED_PREFIX = 'municipal_notice_closed_';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  notice$: Observable<Notice | null>;

  constructor(private http: HttpClient) {
    this.notice$ = this.http.get<any>(`${API}/${NOTICE_ENDPOINT}`).pipe(
      map((res) => {
        const d = res?.data ?? null;
        if (!d) return null;

        // v4: data.attributes, v5: data directo
        const a = d?.attributes ?? d;

        return {
          title: a.title,
          message: a.message,
          active: a.active ?? true,
          variant: a.variant ?? 'warning',
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
    const version = n.updatedAt || n.documentId || 'v1';
    return `${CLOSED_PREFIX}${version}`;
  }

  isClosed(n: Notice): boolean {
    return localStorage.getItem(this.getCloseKey(n)) === 'true';
  }

  close(n: Notice) {
    localStorage.setItem(this.getCloseKey(n), 'true');
  }
}