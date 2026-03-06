import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, shareReplay } from 'rxjs/operators';
import { TourismService, TourismPlace } from '../../services/tourism';

@Component({
  selector: 'app-tourism-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tourism-detail.html',
  styleUrls: ['./tourism-detail.css'],
})
export class TourismDetail {
  private route = inject(ActivatedRoute);
  private tourismService = inject(TourismService);

  errorMsg = '';

  // Cargamos el item por slug y reaccionamos si cambia
  item$: Observable<TourismPlace | null> = this.route.paramMap.pipe(
    map((p) => p.get('slug')),
    distinctUntilChanged(),
    switchMap((slug) => this.tourismService.getBySlug(slug)),
    catchError((err) => {
      console.error('Error cargando detalle turismo:', err);
      this.errorMsg = 'No pudimos cargar el lugar. Probá nuevamente.';
      return of(null);
    }),
    shareReplay(1)
  );

  // Solo para mostrar categoría linda
  categoryUi(cat: TourismPlace['category'] | undefined | null): string {
    switch (cat) {
      case 'naturaleza': return 'Naturaleza';
      case 'cultura': return 'Cultura';
      case 'eventos': return 'Eventos';
      case 'gastronomia': return 'Gastronomía';
      case 'alojamiento': return 'Alojamiento';
      default: return 'Turismo';
    }
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
  }
}
