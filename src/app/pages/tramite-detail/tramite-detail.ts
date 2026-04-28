import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { TramitesService, TramiteItem } from '../../services/tramites';

@Component({
  selector: 'app-tramite-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tramite-detail.html',
  styleUrls: ['./tramite-detail.css'],
})
export class TramiteDetailComponent {
  private route = inject(ActivatedRoute);
  private tramitesService = inject(TramitesService);

  tramite$ = this.route.paramMap.pipe(
    map((p) => p.get('slug') || ''),
    switchMap((slug) => this.tramitesService.getBySlug(slug)),
    catchError((err) => {
      console.error('Error cargando trámite:', err);
      return of(null);
    })
  );

  // Markdown -> HTML sanitizado
  renderMarkdown(md: string | null | undefined): string {
    const raw = marked.parse(md ?? '') as string;
    return DOMPurify.sanitize(raw);
  }
}