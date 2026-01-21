import { GraduationCap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
}

export const Header = ({ totalCount, filteredCount }: HeaderProps) => {
  const isFiltered = filteredCount !== totalCount;

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Parcours Étudiants Paris 8
              </h1>
              <p className="text-sm text-muted-foreground">
                Observatoire des trajectoires formation-emploi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="stat-card flex items-center gap-3 px-4">
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">
                {isFiltered ? (
                  <>
                    <span className="text-primary">{filteredCount}</span>
                    <span className="text-muted-foreground text-lg"> / {totalCount}</span>
                  </>
                ) : (
                  totalCount
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {isFiltered ? 'étudiants filtrés' : 'étudiants total'}
              </p>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-sm">
                Ce dashboard visualise les parcours de formation et d'insertion 
                professionnelle des étudiants de l'Université Paris 8.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Cliquez sur les éléments des graphiques pour filtrer les données.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
