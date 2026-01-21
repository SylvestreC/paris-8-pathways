import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { StudentRecord, DOMAIN_COLORS, SECTOR_COLORS, getNetworkData } from '@/data/mockData';
import { FilterState } from '@/hooks/useDataFilter';

interface NetworkChartProps {
  data: StudentRecord[];
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
}

interface SimulationNode {
  id: string;
  group: 'domaine' | 'secteur';
  value: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  value: number;
}

export const NetworkChart = ({ data, filters, onToggleFilter }: NetworkChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 400 });
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

    const { nodes: rawNodes, links: rawLinks } = getNetworkData(data);

    // Prepare simulation data
    const nodes: SimulationNode[] = rawNodes.map(n => ({
      id: n.id,
      group: n.group,
      value: n.value,
    }));

    const nodeById = new Map(nodes.map(n => [n.id, n]));

    const links: SimulationLink[] = rawLinks
      .filter(l => nodeById.has(l.source) && nodeById.has(l.target))
      .map(l => ({
        source: nodeById.get(l.source)!,
        target: nodeById.get(l.target)!,
        value: l.value,
      }));

    const width = dimensions.width;
    const height = dimensions.height;

    // Scales
    const nodeRadius = d3.scaleSqrt()
      .domain([0, d3.max(nodes, d => d.value) || 1])
      .range([8, 35]);

    const linkWidth = d3.scaleLinear()
      .domain([0, d3.max(links, d => d.value) || 1])
      .range([1, 8]);

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(links)
        .id(d => d.id)
        .distance(150)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX(d => d.group === 'domaine' ? width * 0.25 : width * 0.75).strength(0.3))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('collision', d3.forceCollide<SimulationNode>().radius(d => nodeRadius(d.value) + 5));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-width', d => linkWidth(d.value))
      .attr('stroke-opacity', d => {
        const sourceNode = d.source as SimulationNode;
        const targetNode = d.target as SimulationNode;
        if (filters.domaine && sourceNode.id !== filters.domaine) return 0.1;
        if (filters.secteur && targetNode.id !== filters.secteur) return 0.1;
        return 0.4;
      });

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, SimulationNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on('click', (event, d) => {
        const filterKey = d.group === 'domaine' ? 'domaine' : 'secteur';
        onToggleFilter(filterKey, d.id);
      });

    const isHighlighted = (d: SimulationNode) => {
      if (!filters.domaine && !filters.secteur) return true;
      if (d.group === 'domaine' && filters.domaine) return d.id === filters.domaine;
      if (d.group === 'secteur' && filters.secteur) return d.id === filters.secteur;
      return true;
    };

    node.append('circle')
      .attr('r', d => nodeRadius(d.value))
      .attr('fill', d => {
        const colors = d.group === 'domaine' ? DOMAIN_COLORS : SECTOR_COLORS;
        return colors[d.id] || 'hsl(var(--muted))';
      })
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .attr('opacity', d => isHighlighted(d) ? 1 : 0.3)
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        const tooltip = d3.select('#network-tooltip');
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .html(`
            <strong>${d.id}</strong>
            <br/>${d.value} étudiants
            <br/><em>${d.group === 'domaine' ? 'Domaine de formation' : 'Secteur professionnel'}</em>
          `);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('opacity', isHighlighted(d) ? 1 : 0.3);
        d3.select('#network-tooltip').style('opacity', 0);
      });

    // Node labels (only for larger nodes)
    node.append('text')
      .attr('dy', d => nodeRadius(d.value) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('opacity', d => isHighlighted(d) ? 1 : 0.3)
      .text(d => {
        if (nodeRadius(d.value) < 15) return '';
        const maxLen = 15;
        return d.id.length > maxLen ? d.id.slice(0, maxLen) + '…' : d.id;
      });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => {
          const source = d.source as SimulationNode;
          return source.x ?? 0;
        })
        .attr('y1', d => {
          const source = d.source as SimulationNode;
          return source.y ?? 0;
        })
        .attr('x2', d => {
          const target = d.target as SimulationNode;
          return target.x ?? 0;
        })
        .attr('y2', d => {
          const target = d.target as SimulationNode;
          return target.y ?? 0;
        });

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, filters, onToggleFilter]);

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-4">
        <h3 className="chart-title">Réseau Biparti</h3>
        <p className="chart-subtitle">
          Structure relationnelle entre formations et secteurs d'emploi
        </p>
      </div>

      <div ref={containerRef} className="relative">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        <div
          id="network-tooltip"
          className="tooltip-chart"
          style={{ opacity: 0 }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-primary" />
          <span>Domaine de formation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-accent" />
          <span>Secteur professionnel</span>
        </div>
        <span className="text-muted-foreground/60">• Taille = nombre d'étudiants</span>
      </div>
    </div>
  );
};
