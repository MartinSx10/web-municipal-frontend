import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';
import { TourismService, TourismPlace, TourismCategory } from '../../services/tourism';

type CategoryUi = 'Todos' | 'Naturaleza' | 'Cultura' | 'Eventos' | 'Gastronomía' | 'Alojamiento';

const UI_TO_API: Record<Exclude<CategoryUi, 'Todos'>, TourismCategory> = {
  Naturaleza: 'naturaleza',
  Cultura: 'cultura',
  Eventos: 'eventos',
  'Gastronomía': 'gastronomia',
  Alojamiento: 'alojamiento',
};

const API_TO_UI: Record<TourismCategory, Exclude<CategoryUi, 'Todos'>> = {
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  eventos: 'Eventos',
  gastronomia: 'Gastronomía',
  alojamiento: 'Alojamiento',
};

@Component({
  selector: 'app-tourism',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tourism.html',
  styleUrls: ['./tourism.css'],
})
export class TourismComponent {
  private tourismService = inject(TourismService);

  search = new FormControl<string>('', { nonNullable: true });

  private activeCat$ = new BehaviorSubject<CategoryUi>('Todos');
  activeCat: CategoryUi = 'Todos';

  categories: CategoryUi[] = ['Todos', 'Naturaleza', 'Cultura', 'Eventos', 'Gastronomía', 'Alojamiento'];

  loading = true;
  errorMsg = '';

  // Traemos de Strapi
  items$ = this.tourismService.getAll().pipe(
    map((items: TourismPlace[]) =>
      items.map((x) => ({
        ...x,
        categoryUi: API_TO_UI[x.category],
        // mostramos description si excerpt viene vacío
        excerptToShow: (x.excerpt && x.excerpt.trim().length > 0) ? x.excerpt : (x.description ?? ''),
      }))
    ),
    catchError((err) => {
      console.error('Error cargando turismo:', err);
      this.errorMsg = 'No se pudo cargar Turismo. Probá recargar.';
      return of([] as any[]);
    }),
    shareReplay(1)
  );

  filtered$ = combineLatest([
    this.items$,
    this.search.valueChanges.pipe(startWith(this.search.value)),
    this.activeCat$,
  ]).pipe(
    map(([items, q, cat]) => {
      const query = (q ?? '').trim().toLowerCase();

      return items.filter((x: any) => {
        const matchesCat =
          cat === 'Todos' ? true : x.category === UI_TO_API[cat as Exclude<CategoryUi, 'Todos'>];

        const matchesText =
          !query ||
          (x.title ?? '').toLowerCase().includes(query) ||
          (x.excerptToShow ?? '').toLowerCase().includes(query) ||
          (x.categoryUi ?? '').toLowerCase().includes(query);

        return matchesCat && matchesText;
      });
    })
  );

  constructor() {
    this.items$.subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  setCategory(cat: CategoryUi) {
    this.activeCat = cat;
    this.activeCat$.next(cat);
  }

  clearSearch() {
    this.search.setValue('');
  }
}