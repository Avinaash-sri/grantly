import React, { useState } from 'react';
import { ApplicationItem, Scholarship } from '../../types';

interface PortfolioChartProps {
  applications: ApplicationItem[];
  scholarships: Scholarship[];
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ applications, scholarships }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group applications by coverage
  const trackedScholarships = applications
    .map((app) => scholarships.find((s) => s.id === app.scholarshipId))
    .filter(Boolean) as Scholarship[];

  const categoryTotals: { [key: string]: { label: string; amount: number; color: string } } = {
    'Full Tuition & Living': { label: 'Tuition & Full Stipend', amount: 0, color: '#2C4E6F' },
    'Full Tuition': { label: 'Tuition Waivers', amount: 0, color: '#5C88B5' },
    'Research Fellowship': { label: 'Research Fellowships', amount: 0, color: '#C5A880' },
    'Stipend & Travel': { label: 'Stipends & Travel', amount: 0, color: '#8D8276' },
    'Partial Tuition': { label: 'Institutional Grants', amount: 0, color: '#3E658C' }
  };

  trackedScholarships.forEach((sch) => {
    if (categoryTotals[sch.coverage]) {
      categoryTotals[sch.coverage].amount += sch.amount;
    } else {
      categoryTotals['Full Tuition & Living'].amount += sch.amount;
    }
  });

  const categories = Object.values(categoryTotals).filter((c) => c.amount > 0);
  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0) || 1;

  // Compute donut slices
  let accumulatedAngle = 0;
  const radius = 70;
  const cx = 95;
  const cy = 95;

  const slices = categories.map((cat, idx) => {
    const fraction = cat.amount / totalAmount;
    const angle = fraction * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (accumulatedAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...cat,
      fraction,
      pathData,
      idx
    };
  });

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] block">
            CAPITAL DISTRIBUTION
          </span>
          <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
            Portfolio Coverage Breakdown
          </h3>
        </div>
        <span className="text-xs font-mono text-[#7E8B99]">
          {trackedScholarships.length} Tracked Endowments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-6 flex items-center justify-center relative">
          <svg width="190" height="190" viewBox="0 0 190 190" className="transform -rotate-90">
            {slices.map((slice) => (
              <path
                key={slice.label}
                d={slice.pathData}
                fill={slice.color}
                opacity={hoveredIndex === null || hoveredIndex === slice.idx ? 1 : 0.4}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(slice.idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
            {/* Center cutout for donut hole */}
            <circle cx={cx} cy={cy} r="48" className="fill-[#FAF8F5] dark:fill-[#161B22]" />
          </svg>

          {/* Central Total Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99]">
              Tracked
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#12161A] dark:text-[#F7F5F0]">
              ${(totalAmount / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="md:col-span-6 space-y-3">
          {categories.map((cat, idx) => (
            <div
              key={cat.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2.5 rounded border transition-colors cursor-pointer ${
                hoveredIndex === idx
                  ? 'bg-[#F3EFE7] dark:bg-[#1B2129] border-[#2C4E6F] dark:border-[#5C88B5]'
                  : 'bg-white dark:bg-[#1B2129] border-[#E5E0D4] dark:border-[#2A3340]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="font-medium text-[#12161A] dark:text-[#F7F5F0]">
                    {cat.label}
                  </span>
                </div>
                <span className="font-mono font-semibold text-[#12161A] dark:text-[#F7F5F0]">
                  ${cat.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-[#E5E0D4] dark:bg-[#2A3340] h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: cat.color,
                    width: `${((cat.amount / totalAmount) * 100).toFixed(1)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

