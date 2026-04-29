import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { EventsService, EventItem } from '../../services/events';

@Component({
  selector: 'app-agenda-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agenda-detail.html',
})
export class AgendaDetailComponent {
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);

  event$ = this.route.paramMap.pipe(
    map((p) => Number(p.get('id'))),
    switchMap((id) => this.eventsService.getById(id)),
    catchError((err) => {
      console.error('Error cargando detalle evento:', err);
      return of(null);
    })
  );
}