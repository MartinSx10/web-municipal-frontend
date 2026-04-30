import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type WeatherNow = {
  tempC: number | null;
  label: string; // ej: "Despejado"
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  /**
   * Open-Meteo (sin API key)
   * Pasale lat/lon de tu localidad.
   */
  getNow(lat: number, lon: number): Observable<WeatherNow> {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code` +
      `&timezone=auto`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const cur = res?.current;
        const temp = typeof cur?.temperature_2m === 'number' ? cur.temperature_2m : null;
        const code = typeof cur?.weather_code === 'number' ? cur.weather_code : null;

        return {
          tempC: temp !== null ? Math.round(temp * 10) / 10 : null,
          label: this.codeToLabel(code),
        };
      })
    );
  }

  // Mapeo simple (lo podés extender cuando quieras)
  private codeToLabel(code: number | null): string {
    if (code === null) return '—';
    if (code === 0) return 'Despejado';
    if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
    if ([45, 48].includes(code)) return 'Niebla';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Llovizna';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Lluvia';
    if ([71, 73, 75, 77].includes(code)) return 'Nieve';
    if ([80, 81, 82].includes(code)) return 'Chaparrones';
    if ([95, 96, 99].includes(code)) return 'Tormenta';
    return 'Clima';
  }
}