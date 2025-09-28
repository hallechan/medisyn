import type { Medication } from '../types';

export const resolveMedicationIcon = (med: Medication): string => {
  if (med.type) {
    switch (med.type) {
      case 'bottle':
        return '/bottle.png';
      case 'spray':
        return '/spray.png';
      case 'cream':
        return '/cream.png';
      case 'injection':
        return '/injection.png';
      case 'pill':
      default:
        return '/pill.png';
    }
  }

  const source = `${med.name} ${med.dosage} ${med.schedule}`.toLowerCase();
  if (source.includes('spray')) {
    return '/spray.png';
  }
  if (source.includes('inject') || source.includes('injection') || source.includes('shot')) {
    return '/injection.png';
  }
  if (source.includes('cream') || source.includes('patch') || source.includes('topical')) {
    return '/cream.png';
  }
  if (source.includes('suspension') || source.includes('syrup') || source.includes('solution')) {
    return '/bottle.png';
  }
  return source.includes('daily') || source.includes('weekly') ? '/bottle.png' : '/pill.png';
};
