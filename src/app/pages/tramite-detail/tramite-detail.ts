import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { TramitesService, TramiteItem } from '../../services/tramites';

@Component({
  selector: 'app-tramite-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tramite-detail.html',
})
export class TramiteDetailComponent {
  private route = inject(ActivatedRoute);
  private tramitesService = inject(TramitesService);

  tramite$: Observable<TramiteItem | null> = this.route.paramMap.pipe(
    map((p) => p.get('slug') || ''),
    switchMap((slug) => this.tramitesService.getBySlug(slug)),
    catchError((err) => {
      console.error('Error cargando trámite:', err);
      return of(null);
    }),
    shareReplay(1)
  );

  // mini helper para “badge”
  modalityLabel(m?: TramiteItem['modality']) {
    if (m === 'online') return 'Online';
    if (m === 'mixto') return 'Mixto';
    return 'Presencial';
  }
}