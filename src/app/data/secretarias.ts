export type Secretaria = {
  slug: string;
  nombre: string;
  descripcion: string;
  responsable: string;
  domicilio: string;
  horario: string;
  heroImage?: string; // opcional
};

export const SECRETARIAS: Secretaria[] = [
  {
    slug: 'hacienda',
    nombre: 'Secretaría de Hacienda',
    descripcion:
      'Administrar en forma eficiente los recursos municipales para que retornen a la comunidad mediante obras y servicios.',
    responsable: 'A definir',
    domicilio: 'Ulapes – La Rioja, Av. San Martín s/n',
    horario: 'Lun a Vie — 08:00 a 13:00',
    heroImage: '/assets/secretarias/hacienda.jpg',
  },
  {
    slug: 'gobierno',
    nombre: 'Secretaría de Gobierno',
    descripcion:
      'Coordina la gestión administrativa e institucional, articulando acciones con las distintas áreas del municipio.',
    responsable: 'A definir',
    domicilio: 'Ulapes – La Rioja, Av. San Martín s/n',
    horario: 'Lun a Vie — 08:00 a 13:00',
    heroImage: '/assets/secretarias/gobierno.jpg',
  },
  {
    slug: 'seguridad-ciudadana',
    nombre: 'Secretaría de Seguridad Ciudadana',
    descripcion:
      'Acciones de prevención, coordinación y acompañamiento para fortalecer la seguridad y la convivencia.',
    responsable: 'A definir',
    domicilio: 'Ulapes – La Rioja, Av. San Martín s/n',
    horario: 'Lun a Vie — 08:00 a 13:00',
    heroImage: '/assets/secretarias/seguridad.jpg',
  },
  {
    slug: 'cultura-turismo',
    nombre: 'Secretaría de Cultura y Turismo',
    descripcion:
      'Promoción cultural, eventos y desarrollo turístico del departamento.',
    responsable: 'A definir',
    domicilio: 'Ulapes – La Rioja, Av. San Martín s/n',
    horario: 'Lun a Vie — 08:00 a 13:00',
    heroImage: '/assets/secretarias/cultura.jpg',
  },
  {
    slug: 'ambiente-urbano',
    nombre: 'Secretaría de Ambiente y Desarrollo Urbano',
    descripcion:
      'Gestión ambiental, residuos, planificación urbana y mejoras del espacio público.',
    responsable: 'A definir',
    domicilio: 'Ulapes – La Rioja, Av. San Martín s/n',
    horario: 'Lun a Vie — 08:00 a 13:00',
    heroImage: '/assets/secretarias/ambiente.jpg',
  },
];