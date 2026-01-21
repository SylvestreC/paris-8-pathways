import { GraduationCap, Briefcase, TrendingUp, Users } from 'lucide-react';
import { StudentRecord } from '@/data/mockData';

interface StatCardsProps {
  data: StudentRecord[];
}

export const StatCards = ({ data }: StatCardsProps) => {
  const licenceCount = data.filter(d => d.niveau === 'Licence').length;
  const masterCount = data.filter(d => d.niveau === 'Master').length;
  
  const domainesUniques = new Set(data.map(d => d.domaine)).size;
  const secteursUniques = new Set(data.map(d => d.secteurProfessionnel)).size;
  
  // Top sector
  const sectorCounts: Record<string, number> = {};
  data.forEach(d => {
    sectorCounts[d.secteurProfessionnel] = (sectorCounts[d.secteurProfessionnel] || 0) + 1;
  });
  const topSector = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      icon: Users,
      label: 'Effectif total',
      value: data.length,
      detail: `${licenceCount} L / ${masterCount} M`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: GraduationCap,
      label: 'Domaines de formation',
      value: domainesUniques,
      detail: 'disciplines universitaires',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      icon: Briefcase,
      label: 'Secteurs professionnels',
      value: secteursUniques,
      detail: 'secteurs d\'activité',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: TrendingUp,
      label: 'Secteur principal',
      value: topSector ? topSector[1] : 0,
      detail: topSector ? topSector[0] : '-',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground truncate" title={stat.detail}>
                {stat.detail}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
