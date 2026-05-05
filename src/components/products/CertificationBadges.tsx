const badges = ['ISO 9001', 'RoHS', 'CE', 'FCC'] as const;

export default function CertificationBadges() {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {badges.map((badge) => (
        <svg
          key={badge}
          width="60"
          height="60"
          viewBox="0 0 60 60"
          role="img"
          aria-label={`${badge} compliance badge`}
          className="shrink-0"
        >
          <circle cx="30" cy="30" r="28" fill="#0F4C3A" stroke="#d9f5e5" strokeWidth="1.5" />
          <text
            x="30"
            y={badge === 'ISO 9001' ? '27' : '34'}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={badge === 'ISO 9001' ? '10' : '13'}
            fontWeight="800"
            fontFamily="Arial, sans-serif"
          >
            {badge === 'ISO 9001' ? (
              <>
                <tspan x="30" dy="0">ISO</tspan>
                <tspan x="30" dy="12">9001</tspan>
              </>
            ) : (
              badge
            )}
          </text>
        </svg>
      ))}
    </div>
  );
}
