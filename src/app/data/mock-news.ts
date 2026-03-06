export type News = {
  title: string;
  slug: string;
  date: string; // yyyy-mm-dd
  excerpt: string;
  content: string;
};

export const MOCK_NEWS: News[] = [
  {
    title: 'Nueva obra de iluminación en el barrio',
    slug: 'nueva-obra-iluminacion-barrio',
    date: '2026-03-01',
    excerpt: 'Se realizaron mejoras en el alumbrado público para reforzar la seguridad.',
    content:
      'La Municipalidad informa que se completó la instalación de nuevas luminarias LED. ' +
      'Las tareas se realizaron por etapas y continuarán en otros sectores durante las próximas semanas.',
  },
  {
    title: 'Operativo de limpieza y descacharrado',
    slug: 'operativo-limpieza-descacharrado',
    date: '2026-02-28',
    excerpt: 'Cronograma por zonas y recomendaciones para vecinos.',
    content:
      'El operativo se desarrollará por barrios. Se solicita a los vecinos sacar residuos voluminosos ' +
      'en los días indicados. Recordá mantener veredas limpias y colaborar con el personal municipal.',
  },
];