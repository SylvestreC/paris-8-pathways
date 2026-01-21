import { BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

export const MethodologyNote = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-border bg-muted/20 px-6 py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Note méthodologique</h4>
              <p className="text-xs text-muted-foreground">
                Informations sur la collecte et l'interprétation des données
              </p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? 'Masquer' : 'Afficher'}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Source des données</h5>
              <p>
                Les données sont collectées via un formulaire Google Forms et stockées 
                dans une feuille Google Sheets. Les réponses sont contrôlées par des 
                menus déroulants pour garantir la cohérence des agrégations.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Visualisations</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Distribution :</strong> répartition quantitative par catégorie</li>
                <li><strong>Sankey :</strong> flux formation → emploi, largeur = effectif</li>
                <li><strong>Réseau :</strong> structure relationnelle bipartite</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Limites et précautions</h5>
              <p>
                Ce dashboard présente des données déclaratives. Les trajectoires individuelles 
                peuvent être plus complexes. L'outil vise l'exploration et la pédagogie, 
                non l'exhaustivité statistique.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="mr-1 h-3 w-3" />
              Accéder au formulaire de saisie
            </Button>
            <span className="text-xs text-muted-foreground">
              Données de démonstration • Mise à jour : Janvier 2026
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
