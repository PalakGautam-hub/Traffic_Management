interface StatCardProps {
  title: string;
  value: string | number;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  subtitle?: string;
}

export default function StatCard({ title, value, color, subtitle }: StatCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-steel-500/10",
      text: "text-steel-400",
      border: "border-steel-500/20",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    green: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    },
    yellow: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className="glass-card p-5 group hover:bg-white/[0.06] transition-colors relative overflow-hidden">
      {/* Background glow effect on hover */}
      <div className={`absolute -right-12 -top-12 w-32 h-32 ${currentStyle.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1 md:space-y-2 flex-col flex-1 min-w-0 pr-4">
          <p className="text-steel-400 text-xs sm:text-sm font-medium tracking-wide truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm truncate">
              {value}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[10px] sm:text-xs font-semibold text-steel-500 uppercase tracking-widest mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${currentStyle.bg} ${currentStyle.border} border shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <svg
            className={`w-5 h-5 sm:w-6 sm:h-6 ${currentStyle.text}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={currentStyle.icon}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
