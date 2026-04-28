import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { TramitesService, TramiteItem } from '../../services/tramites';

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tramites.html',
  styleUrls: ['./tramites.css'],
})
export class TramitesComponent {
  private tramitesService = inject(TramitesService);

  tramites$: Observable<TramiteItem[]> = this.tramitesService.getAll(50).pipe(
    catchError((err) => {
      console.error('Error cargando trámites:', err);
      return of([] as TramiteItem[]);
    }),
    shareReplay(1)
  );
}