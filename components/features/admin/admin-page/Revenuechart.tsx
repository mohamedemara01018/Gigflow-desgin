"use client";

import { ChevronDown } from "lucide-react";
import { useId, useMemo } from "react";

const DEFAULT_DATA = [12, 18, 20, 24, 22, 30, 42, 40, 55, 50, 60, 72];

/**
 * Builds a smoothed SVG path through a set of points using a simple
 * Catmull-Rom -> cubic Bezier conversion, so the line curves the way
 * the design shows instead of connecting points with straight segments.
 */
function buildSmoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
}

interface RevenueChartProps {
    data?: number[];
    platformFees?: string;
    freelancerEarnings?: string;
    clientSpend?: string;
}

function RevenueChart({
    data = DEFAULT_DATA,
    platformFees = "$45,200",
    freelancerEarnings = "$380,450",
    clientSpend = "$425,650",
}: RevenueChartProps) {
    const gradientId = useId();
    const width = 600;
    const height = 240;

    const { linePath, areaPath, markers } = useMemo(() => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const points = data.map((value, i) => ({
            x: (i / (data.length - 1)) * width,
            y: height - ((value - min) / range) * (height - 24) - 12,
        }));

        const line = buildSmoothPath(points);
        const area = `${line} L ${width} ${height} L 0 ${height} Z`;

        // Show a handful of marker dots, not one per data point.
        const markerIndices = [
            Math.round(data.length * 0.3),
            Math.round(data.length * 0.55),
            data.length - 1,
        ];
        const markerPoints = markerIndices.map((i) => points[i]);

        return { linePath: line, areaPath: area, markers: markerPoints };
    }, [data]);

    return (
        <section className="card lg:col-span-2">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Revenue over Time
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Platform fees collected across last 30 days
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant text-body-sm text-on-surface px-3.5 py-2 rounded-md hover:bg-surface-container-low transition-colors">
                    Last 30 Days
                    <ChevronDown size={16} />
                </button>
            </div>

            <div className="mt-6 -mx-2">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-56"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    {[0.25, 0.5, 0.75].map((f) => (
                        <line
                            key={f}
                            x1={0}
                            x2={width}
                            y1={height * f}
                            y2={height * f}
                            stroke="var(--color-outline-variant)"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                        />
                    ))}

                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} />

                    {markers.map((m, i) => (
                        <circle
                            key={i}
                            cx={m.x}
                            cy={m.y}
                            r={5}
                            fill="var(--color-surface-container-lowest)"
                            stroke="var(--color-primary)"
                            strokeWidth={2.5}
                        />
                    ))}
                </svg>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-outline-variant">
                <div>
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Platform Fees
                    </p>
                    <p className="text-body-lg font-semibold text-primary mt-1">
                        {platformFees}
                    </p>
                </div>
                <div>
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Freelancer Earnings
                    </p>
                    <p className="text-body-lg font-semibold text-on-surface mt-1">
                        {freelancerEarnings}
                    </p>
                </div>
                <div>
                    <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Client Spend
                    </p>
                    <p className="text-body-lg font-semibold text-on-surface mt-1">
                        {clientSpend}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default RevenueChart;