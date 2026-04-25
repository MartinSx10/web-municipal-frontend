export type EmergencyItem = {
  title: string;
  description?: string;
  phone?: string;
  route?: string;
};

export const EMERGENCIES: EmergencyItem[] = [
  { title: 'Emergencias', description: 'Policía / Bomberos / Salud', phone: '911' },
  { title: 'Guardia municipal', description: 'Atención 24hs', phone: '+54 3800 000000' },
  { title: 'Defensa Civil', description: 'Alertas y asistencia', phone: '+54 3800 111111' },
];