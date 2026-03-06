import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

type SecretariaInfo = {
  slug: string;
  title: string;
  subtitle: string;
  responsable: string;
  domicilio: string;
  horario: string;
  telefono?: string;
  email?: string;
  heroImage: string; // puede ser url o asset
};

@Component({
  selector: 'app-secretaria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './secretaria.html',
  styleUrls: ['./secretaria.css'],
})
export class SecretariaComponent {
  private route = inject(ActivatedRoute);

  slug = '';
  data: SecretariaInfo | null = null;

  // ✅ Datos internos (sin Strapi)
  private readonly SECS: SecretariaInfo[] = [
    {
      slug: 'hacienda',
      title: 'Secretaría de Hacienda',
      subtitle:
        'Administración eficiente de los recursos municipales, transparencia y gestión.',
      responsable: 'A confirmar',
      domicilio: 'Municipalidad de Ulapes — Av. San Martín s/n',
      horario: 'Lunes a Viernes — 08:00 a 13:00',
      telefono: '+54 3800 000000',
      email: 'hacienda@municipio.gob.ar',
      heroImage: 'assets/hero.jpg',
    },
    {
      slug: 'gobierno',
      title: 'Secretaría de Gobierno',
      subtitle:
        'Coordinación institucional, atención ciudadana y gestión de áreas municipales.',
      responsable: 'A confirmar',
      domicilio: 'Municipalidad de Ulapes — Av. San Martín s/n',
      horario: 'Lunes a Viernes — 08:00 a 13:00',
      telefono: '+54 3800 000000',
      email: 'gobierno@municipio.gob.ar',
      heroImage: 'assets/hero.jpg',
    },
    {
      slug: 'seguridad',
      title: 'Secretaría de Seguridad Ciudadana',
      subtitle:
        'Prevención, articulación con fuerzas y programas de seguridad comunitaria.',
      responsable: 'A confirmar',
      domicilio: 'Municipalidad de Ulapes — Av. San Martín s/n',
      horario: 'Lunes a Viernes — 08:00 a 13:00',
      heroImage: 'assets/hero.jpg',
    },
    {
      slug: 'cultura-turismo',
      title: 'Secretaría de Cultura y Turismo',
      subtitle:
        'Cultura, eventos, turismo local y promoción del patrimonio del departamento.',
      responsable: 'A confirmar',
      domicilio: 'Municipalidad de Ulapes — Av. San Martín s/n',
      horario: 'Lunes a Viernes — 08:00 a 13:00',
      heroImage: 'assets/hero.jpg',
    },
    {
      slug: 'ambiente',
      title: 'Secretaría de Ambiente y Desarrollo Urbano',
      subtitle:
        'Ambiente, obras, planificación urbana y mantenimiento de espacios públicos.',
      responsable: 'A confirmar',
      domicilio: 'Municipalidad de Ulapes — Av. San Martín s/n',
      horario: 'Lunes a Viernes — 08:00 a 13:00',
      heroImage: 'assets/hero.jpg',
    },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      const slug = p.get('slug') ?? '';
      this.slug = slug;

      this.data = this.SECS.find((x) => x.slug === slug) ?? null;
    });
  }
}