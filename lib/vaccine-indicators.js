export const VACCINE_INDICATORS = {
  measles: {
    code: 'WHS4_543',
    name: 'MCV1 Coverage',
    targetDisease: 'Measles'
  },
  polio: {
    code: 'vpolio',
    name: 'Pol3 Coverage',
    targetDisease: 'Polio'
  },
  hepatitisb: {
    code: 'WHS7_102',
    name: 'HepB3 Coverage',
    targetDisease: 'Hepatitis B'
  },
  dtp: {
    code: 'WHS4_544',
    name: 'DTP3 Coverage',
    targetDisease: 'Diphtheria-Tetanus-Pertussis'
  },
  rubella: {
    code: 'WHS9_86',
    name: 'RCV1 Coverage',
    targetDisease: 'Rubella'
  },
  hib: {
    code: 'WHS5_89',
    name: 'Hib3 Coverage',
    targetDisease: 'Haemophilus influenzae type B'
  },
  pneumococcal: {
    code: 'WHS10_93',
    name: 'PCV3 Coverage',
    targetDisease: 'Pneumococcal disease'
  },
  rotavirus: {
    code: 'WHS11_95',
    name: 'RotaC Coverage',
    targetDisease: 'Rotavirus'
  },
  yellowfever: {
    code: 'IMMUNIZATION_YFV',
    name: 'YFV Coverage',
    targetDisease: 'Yellow Fever'
  },
  meningococcal: {
    code: 'WHS13_99',
    name: 'MenA Coverage',
    targetDisease: 'Meningococcal disease'
  },
  bcg: {
    code: 'WHS8_110',
    name: 'BCG Coverage',
    targetDisease: 'Tuberculosis'
  }
};

// Optional: Vaccine ordering and display names
export const VACCINE_DISPLAY_NAMES = {
  measles: 'Measles (MCV1)',
  polio: 'Polio (Pol3)',
  hepatitisb: 'Hepatitis B (HepB3)',
  dtp: 'DTP3',
  rubella: 'Rubella (RCV1)',
  hib: 'Hib (Hib3)',
  pneumococcal: 'Pneumococcal (PCV3)',
  rotavirus: 'Rotavirus (RotaC)',
  yellowfever: 'Yellow Fever (YFV)',
  meningococcal: 'Meningococcal (MenA)',
  bcg: 'BCG'
}; 