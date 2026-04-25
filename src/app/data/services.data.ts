export type ServiceItem = {
  title: string;
  description: string;
  icon?: string;          // opcional (emoji o nombre)
  route?: string;         // ruta interna
  url?: string;           // link externo
};

export const SERVICES: ServiceItem[] = [
  { title: 'Licencia de conducir', description: 'Requisitos y turnos', icon: '🪪', route: '/tramites' },
  { title: 'Pago de tasas', description: 'Boletas y medios de pago', icon: '💳', route: '/tramites' },
  { title: 'Habilitaciones', description: 'Comercios y actividades', icon: '🏪', route: '/tramites' },
  { title: 'Reclamos', description: 'Canales y seguimiento', icon: '📩', route: '/contacto' },
];