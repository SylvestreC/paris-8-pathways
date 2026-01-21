// Données de démonstration pour le dashboard de visualisation
// Ces données simulent les parcours étudiants de l'Université Paris 8

export interface StudentRecord {
  id: string;
  niveau: 'Licence' | 'Master';
  domaine: string;
  mention: string;
  parcours: string;
  secteurProfessionnel: string;
  sousSecteur?: string;
  annee: number;
}

export const DOMAINES = [
  'Arts',
  'Sciences Humaines et Sociales',
  'Lettres et Langues',
  'Droit-Économie-Gestion',
  'Sciences et Technologies',
] as const;

export const SECTEURS_PROFESSIONNELS = [
  'Culture et Médias',
  'Éducation et Formation',
  'Commerce et Marketing',
  'Technologies et Numérique',
  'Santé et Social',
  'Administration Publique',
  'Recherche',
  'Communication',
  'Ressources Humaines',
  'Finance et Comptabilité',
] as const;

export const DOMAIN_COLORS: Record<string, string> = {
  'Arts': 'hsl(340, 70%, 55%)',
  'Sciences Humaines et Sociales': 'hsl(215, 75%, 50%)',
  'Lettres et Langues': 'hsl(35, 85%, 55%)',
  'Droit-Économie-Gestion': 'hsl(175, 60%, 40%)',
  'Sciences et Technologies': 'hsl(280, 55%, 50%)',
};

export const SECTOR_COLORS: Record<string, string> = {
  'Culture et Médias': 'hsl(340, 65%, 50%)',
  'Éducation et Formation': 'hsl(215, 70%, 45%)',
  'Commerce et Marketing': 'hsl(35, 80%, 50%)',
  'Technologies et Numérique': 'hsl(175, 55%, 38%)',
  'Santé et Social': 'hsl(145, 55%, 42%)',
  'Administration Publique': 'hsl(220, 30%, 50%)',
  'Recherche': 'hsl(280, 50%, 55%)',
  'Communication': 'hsl(25, 75%, 55%)',
  'Ressources Humaines': 'hsl(190, 60%, 45%)',
  'Finance et Comptabilité': 'hsl(160, 50%, 40%)',
};

// Génération de données de démonstration réalistes
export const generateMockData = (): StudentRecord[] => {
  const data: StudentRecord[] = [];
  let id = 1;

  // Matrice de probabilités domaine -> secteur
  const transitions: Record<string, Record<string, number>> = {
    'Arts': {
      'Culture et Médias': 35,
      'Éducation et Formation': 20,
      'Communication': 25,
      'Commerce et Marketing': 10,
      'Technologies et Numérique': 10,
    },
    'Sciences Humaines et Sociales': {
      'Éducation et Formation': 30,
      'Santé et Social': 25,
      'Ressources Humaines': 15,
      'Administration Publique': 15,
      'Recherche': 15,
    },
    'Lettres et Langues': {
      'Éducation et Formation': 35,
      'Culture et Médias': 20,
      'Communication': 25,
      'Commerce et Marketing': 10,
      'Administration Publique': 10,
    },
    'Droit-Économie-Gestion': {
      'Administration Publique': 25,
      'Finance et Comptabilité': 25,
      'Commerce et Marketing': 20,
      'Ressources Humaines': 20,
      'Technologies et Numérique': 10,
    },
    'Sciences et Technologies': {
      'Technologies et Numérique': 40,
      'Recherche': 25,
      'Éducation et Formation': 15,
      'Santé et Social': 10,
      'Commerce et Marketing': 10,
    },
  };

  const mentions: Record<string, string[]> = {
    'Arts': ['Arts plastiques', 'Musique', 'Cinéma', 'Théâtre', 'Design'],
    'Sciences Humaines et Sociales': ['Psychologie', 'Sociologie', 'Histoire', 'Géographie', 'Philosophie'],
    'Lettres et Langues': ['Lettres modernes', 'LLCER Anglais', 'LLCER Espagnol', 'LEA', 'Sciences du langage'],
    'Droit-Économie-Gestion': ['Droit', 'Économie', 'Gestion', 'AES', 'Commerce international'],
    'Sciences et Technologies': ['Informatique', 'Mathématiques', 'Sciences de la vie', 'Chimie', 'Physique'],
  };

  const parcours: Record<string, Record<string, string[]>> = {
    'Arts': {
      'Arts plastiques': ['Création numérique', 'Photo/Vidéo', 'Arts visuels'],
      'Cinéma': ['Réalisation', 'Scénario', 'Production'],
      'Musique': ['Musicologie', 'Jazz', 'Musiques actuelles'],
      'Théâtre': ['Mise en scène', 'Dramaturgie', 'Performance'],
      'Design': ['Design graphique', 'Design produit', 'UX Design'],
    },
    'Sciences Humaines et Sociales': {
      'Psychologie': ['Clinique', 'Sociale', 'Développement'],
      'Sociologie': ['Urbaine', 'Travail', 'Genre'],
      'Histoire': ['Contemporaine', 'Médiévale', 'Antique'],
      'Géographie': ['Urbaine', 'Environnement', 'Géopolitique'],
      'Philosophie': ['Épistémologie', 'Éthique', 'Esthétique'],
    },
    'Lettres et Langues': {
      'Lettres modernes': ['Création littéraire', 'Édition', 'FLE'],
      'LLCER Anglais': ['Traduction', 'Civilisation', 'Didactique'],
      'LLCER Espagnol': ['Traduction', 'Civilisation', 'Commerce'],
      'LEA': ['Commerce international', 'Traduction spécialisée', 'Communication'],
      'Sciences du langage': ['TAL', 'Phonétique', 'Didactique'],
    },
    'Droit-Économie-Gestion': {
      'Droit': ['Droit privé', 'Droit public', 'Droit des affaires'],
      'Économie': ['Analyse économique', 'Économie internationale', 'Finance'],
      'Gestion': ['Management', 'RH', 'Marketing'],
      'AES': ['Administration', 'Gestion publique', 'Social'],
      'Commerce international': ['Export', 'Logistique', 'Négociation'],
    },
    'Sciences et Technologies': {
      'Informatique': ['Développement web', 'IA/Data', 'Cybersécurité'],
      'Mathématiques': ['Statistiques', 'Modélisation', 'Enseignement'],
      'Sciences de la vie': ['Biologie', 'Écologie', 'Biotechnologies'],
      'Chimie': ['Chimie organique', 'Analyse', 'Matériaux'],
      'Physique': ['Physique théorique', 'Énergies', 'Instrumentation'],
    },
  };

  // Générer 500 étudiants
  const years = [2020, 2021, 2022, 2023, 2024];
  const niveaux: ('Licence' | 'Master')[] = ['Licence', 'Master'];

  for (const domaine of DOMAINES) {
    const domaineCount = domaine === 'Sciences Humaines et Sociales' ? 120 : 
                         domaine === 'Arts' ? 100 :
                         domaine === 'Lettres et Langues' ? 90 :
                         domaine === 'Droit-Économie-Gestion' ? 95 :
                         95;

    const domaineTransitions = transitions[domaine];
    const secteurs = Object.keys(domaineTransitions);
    const weights = Object.values(domaineTransitions);
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    for (let i = 0; i < domaineCount; i++) {
      const mention = mentions[domaine][Math.floor(Math.random() * mentions[domaine].length)];
      const parcoursOptions = parcours[domaine][mention];
      const selectedParcours = parcoursOptions[Math.floor(Math.random() * parcoursOptions.length)];

      // Sélection pondérée du secteur
      let random = Math.random() * totalWeight;
      let selectedSecteur = secteurs[0];
      for (let j = 0; j < secteurs.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          selectedSecteur = secteurs[j];
          break;
        }
      }

      data.push({
        id: `ETU${String(id++).padStart(4, '0')}`,
        niveau: niveaux[Math.floor(Math.random() * niveaux.length)],
        domaine,
        mention,
        parcours: selectedParcours,
        secteurProfessionnel: selectedSecteur,
        annee: years[Math.floor(Math.random() * years.length)],
      });
    }
  }

  return data;
};

export const mockData = generateMockData();

// Agrégations pour les visualisations
export interface FlowData {
  source: string;
  target: string;
  value: number;
}

export interface NodeData {
  id: string;
  group: 'domaine' | 'secteur';
  value: number;
}

export interface LinkData {
  source: string;
  target: string;
  value: number;
}

export const getDistributionByField = (
  data: StudentRecord[], 
  field: keyof StudentRecord
): { name: string; value: number }[] => {
  const counts: Record<string, number> = {};
  data.forEach(record => {
    const key = String(record[field]);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getFlowData = (data: StudentRecord[]): FlowData[] => {
  const flows: Record<string, number> = {};
  data.forEach(record => {
    const key = `${record.domaine}→${record.secteurProfessionnel}`;
    flows[key] = (flows[key] || 0) + 1;
  });
  return Object.entries(flows).map(([key, value]) => {
    const [source, target] = key.split('→');
    return { source, target, value };
  });
};

export const getNetworkData = (data: StudentRecord[]): { nodes: NodeData[]; links: LinkData[] } => {
  const domaineSet = new Set<string>();
  const secteurSet = new Set<string>();
  const domaineCounts: Record<string, number> = {};
  const secteurCounts: Record<string, number> = {};
  const linkCounts: Record<string, number> = {};

  data.forEach(record => {
    domaineSet.add(record.domaine);
    secteurSet.add(record.secteurProfessionnel);
    domaineCounts[record.domaine] = (domaineCounts[record.domaine] || 0) + 1;
    secteurCounts[record.secteurProfessionnel] = (secteurCounts[record.secteurProfessionnel] || 0) + 1;
    
    const linkKey = `${record.domaine}→${record.secteurProfessionnel}`;
    linkCounts[linkKey] = (linkCounts[linkKey] || 0) + 1;
  });

  const nodes: NodeData[] = [
    ...Array.from(domaineSet).map(id => ({ id, group: 'domaine' as const, value: domaineCounts[id] })),
    ...Array.from(secteurSet).map(id => ({ id, group: 'secteur' as const, value: secteurCounts[id] })),
  ];

  const links: LinkData[] = Object.entries(linkCounts).map(([key, value]) => {
    const [source, target] = key.split('→');
    return { source, target, value };
  });

  return { nodes, links };
};
