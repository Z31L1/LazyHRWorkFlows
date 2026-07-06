import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface AtsGaugeProps {
  score: number; // 0 to 100
  width?: number;
  height?: number;
}

export const AtsGauge: React.FC<AtsGaugeProps> = ({
  score,
  width = 240,
  height = 140,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous renders
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth / 2, chartHeight);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left + chartWidth / 2}, ${margin.top + radius})`);

    // Define color scale / gradient
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 50, 100])
      .range(["#ef4444", "#f97316", "#10b981"]); // Red -> Orange -> Green

    // Gauge arc generator
    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.65)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Background track
    g.append("path")
      .datum({ endAngle: Math.PI / 2 })
      .attr("d", arc)
      .attr("fill", "#1e293b")
      .attr("class", "stroke-slate-800/40")
      .attr("stroke-width", 1);

    // Dynamic color arc based on score
    const targetAngle = -Math.PI / 2 + (score / 100) * Math.PI;

    const valueArc = d3
      .arc<any>()
      .innerRadius(radius * 0.65)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    const path = g
      .append("path")
      .datum({ endAngle: -Math.PI / 2 })
      .attr("fill", colorScale(score))
      .attr("d", valueArc);

    // Animate the arc filling
    path
      .transition()
      .duration(1000)
      .ease(d3.easeQuadOut)
      .attrTween("d", function (d: any) {
        const interpolate = d3.interpolate(d.endAngle, targetAngle);
        return function (t) {
          d.endAngle = interpolate(t);
          return valueArc(d) || "";
        };
      });

    // Add tick marks or speed levels
    const ticks = [0, 25, 50, 75, 100];
    const tickData = ticks.map((t) => {
      const angle = -Math.PI / 2 + (t / 100) * Math.PI;
      return {
        value: t,
        angle,
      };
    });

    // Tick lines
    g.selectAll(".tick-line")
      .data(tickData)
      .enter()
      .append("line")
      .attr("x1", (d) => Math.cos(d.angle) * (radius * 0.55))
      .attr("y1", (d) => Math.sin(d.angle) * (radius * 0.55))
      .attr("x2", (d) => Math.cos(d.angle) * (radius * 0.62))
      .attr("y2", (d) => Math.sin(d.angle) * (radius * 0.62))
      .attr("stroke", "#475569")
      .attr("stroke-width", 1.5);

    // Tick labels
    g.selectAll(".tick-label")
      .data(tickData)
      .enter()
      .append("text")
      .attr("x", (d) => Math.cos(d.angle) * (radius * 0.45))
      .attr("y", (d) => Math.sin(d.angle) * (radius * 0.45))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "9px")
      .style("font-family", "monospace")
      .text((d) => d.value);

    // Needle group
    const needle = g.append("g").attr("class", "needle");

    // Needle pivot (circle center)
    needle
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 7)
      .attr("fill", "#f8fafc")
      .attr("stroke", "#475569")
      .attr("stroke-width", 2);

    // Needle pointer shape
    const needlePath = d3.line()([
      [-3, 0],
      [0, -radius * 0.9],
      [3, 0],
      [-3, 0],
    ]);

    const needlePointer = needle
      .append("path")
      .attr("d", needlePath)
      .attr("fill", "#f8fafc")
      .attr("transform", "rotate(-90)"); // Start at 0 (aligned left at -90deg)

    // Animate needle rotation
    const targetDegrees = (score / 100) * 180 - 90; // Map 0-100 score to -90 to 90 degrees
    needlePointer
      .transition()
      .duration(1000)
      .ease(d3.easeQuadOut)
      .attr("transform", `rotate(${targetDegrees})`);

    // Center Score Text
    g.append("text")
      .attr("x", 0)
      .attr("y", radius * 0.3)
      .attr("text-anchor", "middle")
      .attr("fill", "#f8fafc")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .text(`${score}%`);

    g.append("text")
      .attr("x", 0)
      .attr("y", radius * 0.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .style("font-size", "9px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "1px")
      .style("font-weight", "600")
      .text("ATS Score");

  }, [score, width, height]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible select-none"
        id="ats-d3-gauge-svg"
      />
    </div>
  );
};
