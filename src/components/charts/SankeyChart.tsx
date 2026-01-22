import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { StudentRecord, DOMAIN_COLORS, SECTOR_COLORS, getFlowData } from '@/data/mockData';
import { FilterState } from '@/hooks/useDataFilter';

interface SankeyChartProps {
  data: StudentRecord[];
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
}

interface SankeyNodeData {
  name: string;
  type: 'domaine' | 'secteur';
}

interface SankeyLinkData {
  source: number;
  target: number;
  value: number;
}

export const SankeyChart = ({ data, filters, onToggleFilter }: SankeyChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 450 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 180, bottom: 20, left: 180 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data
    const flowData = getFlowData(data);
    
    // Get unique nodes
    const domaines = [...new Set(data.map(d => d.domaine))];
    const secteurs = [...new Set(data.map(d => d.secteurProfessionnel))];
    
    const nodes: SankeyNodeData[] = [
      ...domaines.map(name => ({ name, type: 'domaine' as const })),
      ...secteurs.map(name => ({ name, type: 'secteur' as const })),
    ];

    const nodeIndex = new Map(nodes.map((n, i) => [n.name, i]));

    const links: SankeyLinkData[] = flowData
      .filter(f => nodeIndex.has(f.source) && nodeIndex.has(f.target))
      .map(f => ({
        source: nodeIndex.get(f.source)!,
        target: nodeIndex.get(f.target)!,
        value: f.value,
      }));

    // Create sankey generator
    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeWidth(16)
      .nodePadding(12)
      .extent([[0, 0], [width, height]])
      .nodeSort(null);

    const sankeyData = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d })),
    });

    // Determine if a node/link should be highlighted
    const isHighlighted = (nodeName: string, nodeType: 'domaine' | 'secteur') => {
      if (!filters.domaine && !filters.secteur) return true;
      if (nodeType === 'domaine' && filters.domaine) return nodeName === filters.domaine;
      if (nodeType === 'secteur' && filters.secteur) return nodeName === filters.secteur;
      return true;
    };

    // Draw links
    const link = g.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(sankeyData.links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => {
        const sourceNode = d.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
        return DOMAIN_COLORS[sourceNode.name] || 'hsl(var(--muted))';
      })
      .attr('stroke-width', d => Math.max(1, d.width || 0))
      .attr('stroke-opacity', d => {
        const sourceNode = d.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
        const targetNode = d.target as SankeyNode<SankeyNodeData, SankeyLinkData>;
        if (filters.domaine && sourceNode.name !== filters.domaine) return 0.1;
        if (filters.secteur && targetNode.name !== filters.secteur) return 0.1;
        return 0.5;
      })
      .attr('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('stroke-opacity', 0.8);
        
        const sourceNode = d.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
        const targetNode = d.target as SankeyNode<SankeyNodeData, SankeyLinkData>;
        
        const tooltip = d3.select('#sankey-tooltip');
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .html(`
            <strong>${sourceNode.name}</strong> → <strong>${targetNode.name}</strong>
            <br/>${d.value} étudiants
          `);
      })
      .on('mouseleave', function(event, d) {
        const sourceNode = d.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
        const targetNode = d.target as SankeyNode<SankeyNodeData, SankeyLinkData>;
        let opacity = 0.5;
        if (filters.domaine && sourceNode.name !== filters.domaine) opacity = 0.1;
        if (filters.secteur && targetNode.name !== filters.secteur) opacity = 0.1;
        d3.select(this).attr('stroke-opacity', opacity);
        d3.select('#sankey-tooltip').style('opacity', 0);
      });

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(sankeyData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        const filterKey = d.type === 'domaine' ? 'domaine' : 'secteur';
        onToggleFilter(filterKey, d.name);
      });

    node.append('rect')
      .attr('x', d => d.x0!)
      .attr('y', d => d.y0!)
      .attr('width', d => d.x1! - d.x0!)
      .attr('height', d => Math.max(1, d.y1! - d.y0!))
      .attr('fill', d => {
        const colors = d.type === 'domaine' ? DOMAIN_COLORS : SECTOR_COLORS;
        return colors[d.name] || 'hsl(var(--muted))';
      })
      .attr('opacity', d => isHighlighted(d.name, d.type) ? 1 : 0.3)
      .attr('rx', 3)
      .on('mouseenter', function() {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('opacity', isHighlighted(d.name, d.type) ? 1 : 0.3);
      });

    // Node labels
    node.append('text')
      .attr('x', d => d.type === 'domaine' ? d.x0! - 8 : d.x1! + 8)
      .attr('y', d => (d.y0! + d.y1!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.type === 'domaine' ? 'end' : 'start')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('opacity', d => isHighlighted(d.name, d.type) ? 1 : 0.4)
      .text(d => {
        const maxLength = 22;
        return d.name.length > maxLength ? d.name.slice(0, maxLength) + '…' : d.name;
      });

    // Value labels on nodes
    node.append('text')
      .attr('x', d => d.type === 'domaine' ? d.x0! - 8 : d.x1! + 8)
      .attr('y', d => (d.y0! + d.y1!) / 2 + 14)
      .attr('text-anchor', d => d.type === 'domaine' ? 'end' : 'start')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '10px')
      .attr('opacity', d => isHighlighted(d.name, d.type) ? 1 : 0.4)
      .text(d => `${d.value} étudiants`);

  }, [data, dimensions, filters, onToggleFilter]);

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-4">
        <h3 className="chart-title">Flux Formation → Emploi</h3>
        <p className="chart-subtitle">
          Trajectoires des étudiants : du domaine de formation vers le secteur professionnel
        </p>
      </div>

      <div ref={containerRef} className="relative">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        <div
          id="sankey-tooltip"
          className="tooltip-chart"
          style={{ opacity: 0 }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-medium text-muted-foreground mb-2">Domaines de formation</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DOMAIN_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-muted-foreground mb-2">Secteurs professionnels</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SECTOR_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
