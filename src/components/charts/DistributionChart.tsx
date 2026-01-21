import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { StudentRecord, DOMAIN_COLORS, SECTOR_COLORS, getDistributionByField } from '@/data/mockData';
import { FilterState } from '@/hooks/useDataFilter';

interface DistributionChartProps {
  data: StudentRecord[];
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
  viewMode: 'domaine' | 'secteur';
  onViewModeChange: (mode: 'domaine' | 'secteur') => void;
}

export const DistributionChart = ({
  data,
  filters,
  onToggleFilter,
  viewMode,
  onViewModeChange,
}: DistributionChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 320 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw chart
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 80, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const field = viewMode === 'domaine' ? 'domaine' : 'secteurProfessionnel';
    const distributionData = getDistributionByField(data, field);
    const colors = viewMode === 'domaine' ? DOMAIN_COLORS : SECTOR_COLORS;
    const activeFilter = viewMode === 'domaine' ? filters.domaine : filters.secteur;

    // Scales
    const x = d3
      .scaleBand()
      .domain(distributionData.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(distributionData, d => d.value) || 0])
      .nice()
      .range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-dasharray', '3,3');

    g.selectAll('.grid .domain').remove();

    // Bars
    g.selectAll('.bar')
      .data(distributionData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name)!)
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', d => colors[d.name] || 'hsl(var(--muted))')
      .attr('opacity', d => (activeFilter && d.name !== activeFilter ? 0.3 : 1))
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        const filterKey = viewMode === 'domaine' ? 'domaine' : 'secteur';
        onToggleFilter(filterKey, d.name);
      })
      .on('mouseenter', function(event, d) {
        if (!activeFilter || d.name === activeFilter) {
          d3.select(this).attr('opacity', 0.8);
        }
        
        // Show tooltip
        const tooltip = d3.select('#distribution-tooltip');
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .html(`<strong>${d.name}</strong><br/>${d.value} étudiants`);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('opacity', activeFilter && d.name !== activeFilter ? 0.3 : 1);
        d3.select('#distribution-tooltip').style('opacity', 0);
      })
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // Value labels
    g.selectAll('.label')
      .data(distributionData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => d.value)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50 + 300)
      .attr('opacity', 1);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-35)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.5em')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '11px');

    g.selectAll('.domain').attr('stroke', 'hsl(var(--border))');
    g.selectAll('.tick line').attr('stroke', 'hsl(var(--border))');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '11px');

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '12px')
      .text('Nombre d\'étudiants');

  }, [data, dimensions, viewMode, filters, onToggleFilter]);

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="chart-title">Distribution</h3>
          <p className="chart-subtitle">
            {viewMode === 'domaine' 
              ? 'Répartition par domaine de formation' 
              : 'Répartition par secteur professionnel'}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => onViewModeChange('domaine')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'domaine' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Domaines
          </button>
          <button
            onClick={() => onViewModeChange('secteur')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'secteur' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Secteurs
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        <div
          id="distribution-tooltip"
          className="tooltip-chart"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
};
