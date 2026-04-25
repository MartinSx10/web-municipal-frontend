export type EventItem = {
  title: string;
  date: string;     // "2026-04-30"
  time?: string;    // "18:00"
  place?: string;
  route?: string;
};

export const EVENTS: EventItem[] = [
  { title: 'Operativo de documentación', date: '2026-04-30', time: '09:00', place: 'Plaza principal', route: '/agenda' },
  { title: 'Feria de emprendedores', date: '2026-05-03', time: '17:00', place: 'Polideportivo', route: '/agenda' },
  { title: 'Vacunación antigripal', date: '2026-05-10', time: '08:30', place: 'Centro de salud', route: '/agenda' },
];