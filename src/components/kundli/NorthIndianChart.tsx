interface PlanetPosition {
  name: string;
  symbol: string;
  house: number;
}

interface NorthIndianChartProps {
  planets: PlanetPosition[];
  lagnaSign?: number;
}

const RASHI_NAMES = [
  'Mesh', 'Vrishabh', 'Mithun', 'Kark',
  'Simha', 'Kanya', 'Tula', 'Vrischik',
  'Dhanu', 'Makar', 'Kumbh', 'Meen',
];

export default function NorthIndianChart({ planets, lagnaSign = 1 }: NorthIndianChartProps) {
  const SIZE = 400;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const PAD = 10;

  const housePositions: { cx: number; cy: number; path: string; labelX: number; labelY: number }[] = [
    {
      path: `M${CX},${PAD} L${CX - (CX - PAD)},${CY} L${CX},${CY} Z`,
      cx: CX - (CX - PAD) / 2,
      cy: CY / 2,
      labelX: CX - 55,
      labelY: CY / 2 - 10,
    },
    {
      path: `M${PAD},${PAD} L${CX - (CX - PAD)},${CY} L${CX},${PAD} Z`,
      cx: (PAD + CX) / 2,
      cy: (PAD + CY) / 2 - 10,
      labelX: (PAD + CX) / 2 - 30,
      labelY: (PAD + CY) / 2 - 20,
    },
    {
      path: `M${PAD},${PAD} L${PAD},${CY} L${CX},${CY} Z`,
      cx: PAD + (CX - PAD) / 4,
      cy: CY / 2,
      labelX: PAD + 5,
      labelY: CY / 2 - 10,
    },
    {
      path: `M${PAD},${PAD + (CY - PAD)} L${PAD},${SIZE - PAD} L${CX},${CY} Z`,
      cx: (PAD + CX) / 2,
      cy: CY + (CY - PAD) / 2 + 10,
      labelX: (PAD + CX) / 2 - 30,
      labelY: CY + (CY - PAD) / 2 + 20,
    },
    {
      path: `M${PAD},${SIZE - PAD} L${CX},${SIZE - PAD} L${CX},${CY} Z`,
      cx: CX - (CX - PAD) / 2,
      cy: SIZE - (SIZE - CY) / 2,
      labelX: CX - 55,
      labelY: SIZE - (SIZE - CY) / 2 + 10,
    },
    {
      path: `M${CX},${SIZE - PAD} L${SIZE - PAD},${SIZE - PAD} L${CX},${CY} Z`,
      cx: CX + (CX - PAD) / 2,
      cy: SIZE - (SIZE - CY) / 2,
      labelX: CX + 10,
      labelY: SIZE - (SIZE - CY) / 2 + 10,
    },
    {
      path: `M${SIZE - PAD},${SIZE - PAD} L${SIZE - PAD},${CY} L${CX},${CY} Z`,
      cx: SIZE - PAD - (CX - PAD) / 4,
      cy: CY + (CY - PAD) / 2,
      labelX: SIZE - PAD - 60,
      labelY: CY + (CY - PAD) / 2 + 10,
    },
    {
      path: `M${SIZE - PAD},${CY} L${SIZE - PAD},${PAD} L${CX},${CY} Z`,
      cx: CX + (CX - PAD) / 2,
      cy: (PAD + CY) / 2 + 10,
      labelX: CX + 10,
      labelY: (PAD + CY) / 2 + 20,
    },
    {
      path: `M${SIZE - PAD},${PAD} L${CX},${PAD} L${CX},${CY} Z`,
      cx: SIZE - PAD - (CX - PAD) / 4,
      cy: CY / 2,
      labelX: SIZE - PAD - 60,
      labelY: CY / 2 - 10,
    },
    {
      path: `M${SIZE - PAD},${PAD} L${CX + (CX - PAD)},${CY} L${CX},${PAD} Z`,
      cx: CX + (CX - PAD) / 2,
      cy: (PAD + CY) / 2 - 10,
      labelX: CX + 10,
      labelY: (PAD + CY) / 2 - 20,
    },
    {
      path: `M${CX},${PAD} L${CX + (CX - PAD)},${CY} L${CX},${CY} Z`,
      cx: CX + (CX - PAD) / 2,
      cy: CY / 2,
      labelX: CX + 15,
      labelY: CY / 2 - 10,
    },
    {
      path: `M${PAD},${PAD} L${CX},${PAD} L${CX},${CY} Z`,
      cx: CX / 2,
      cy: CY / 2,
      labelX: CX / 2 - 25,
      labelY: CY / 2 - 10,
    },
  ];

  const NORTH_HOUSE_POSITIONS = [
    { labelX: CX - 10, labelY: CY - 110 },
    { labelX: PAD + 8, labelY: PAD + 18 },
    { labelX: PAD + 8, labelY: CY - 10 },
    { labelX: PAD + 8, labelY: SIZE - PAD - 28 },
    { labelX: CX - 10, labelY: SIZE - PAD - 10 },
    { labelX: SIZE - 65, labelY: SIZE - PAD - 28 },
    { labelX: SIZE - 65, labelY: CY - 10 },
    { labelX: SIZE - 65, labelY: PAD + 18 },
    { labelX: CX - 10, labelY: CY - 110 },
    { labelX: PAD + 8, labelY: PAD + 18 },
    { labelX: PAD + 8, labelY: CY - 10 },
    { labelX: PAD + 8, labelY: SIZE - PAD - 28 },
  ];

  const houseRashi = (house: number) => {
    const rashi = ((lagnaSign - 1 + house - 1) % 12) + 1;
    return rashi;
  };

  const planetsByHouse: { [house: number]: PlanetPosition[] } = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }
  planets.forEach((p) => {
    if (p.house >= 1 && p.house <= 12) {
      planetsByHouse[p.house].push(p);
    }
  });

  const HOUSE_TRIANGLES = [
    { path: `M${CX},${PAD} L${PAD},${CY} L${SIZE - PAD},${CY} Z`, id: 1 },
    { path: `M${PAD},${PAD} L${PAD},${CY} L${CX},${PAD} Z`, id: 12 },
    { path: `M${PAD},${PAD} L${PAD},${CY} L${CX},${CY} Z`, id: 11 },
    { path: `M${PAD},${PAD + (CY - PAD)} L${PAD},${SIZE - PAD} L${CX},${CY} Z`, id: 10 },
    { path: `M${PAD},${SIZE - PAD} L${CX},${SIZE - PAD} L${CX},${CY} Z`, id: 9 },
    { path: `M${CX},${SIZE - PAD} L${SIZE - PAD},${SIZE - PAD} L${CX},${CY} Z`, id: 8 },
    { path: `M${SIZE - PAD},${SIZE - PAD} L${SIZE - PAD},${CY} L${CX},${CY} Z`, id: 7 },
    { path: `M${SIZE - PAD},${CY} L${SIZE - PAD},${PAD} L${CX},${CY} Z`, id: 6 },
    { path: `M${SIZE - PAD},${PAD} L${CX},${PAD} L${CX},${CY} Z`, id: 5 },
    { path: `M${SIZE - PAD},${PAD} L${CX},${CY} L${CX},${PAD} Z`, id: 4 },
    { path: `M${CX},${PAD} L${SIZE - PAD},${CY} L${CX},${CY} Z`, id: 3 },
    { path: `M${PAD},${PAD} L${CX},${PAD} L${CX},${CY} Z`, id: 2 },
  ];

  const CONTENT_POSITIONS = [
    { house: 1, cx: CX, cy: CY - 70 },
    { house: 2, cx: CX - 70, cy: PAD + 40 },
    { house: 3, cx: PAD + 35, cy: CY - 55 },
    { house: 4, cx: PAD + 35, cy: CY },
    { house: 5, cx: PAD + 35, cy: CY + 55 },
    { house: 6, cx: CX - 70, cy: SIZE - PAD - 40 },
    { house: 7, cx: CX, cy: CY + 70 },
    { house: 8, cx: CX + 70, cy: SIZE - PAD - 40 },
    { house: 9, cx: SIZE - PAD - 35, cy: CY + 55 },
    { house: 10, cx: SIZE - PAD - 35, cy: CY },
    { house: 11, cx: SIZE - PAD - 35, cy: CY - 55 },
    { house: 12, cx: CX + 70, cy: PAD + 40 },
  ];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full" style={{ maxHeight: '400px' }}>
      <rect x="0" y="0" width={SIZE} height={SIZE} fill="#fefce8" rx="4" />

      <rect x={PAD} y={PAD} width={SIZE - 2 * PAD} height={SIZE - 2 * PAD} fill="none" stroke="#b45309" strokeWidth="1.5" />
      <line x1={PAD} y1={PAD} x2={SIZE - PAD} y2={SIZE - PAD} stroke="#b45309" strokeWidth="1" />
      <line x1={SIZE - PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} stroke="#b45309" strokeWidth="1" />
      <line x1={CX} y1={PAD} x2={PAD} y2={CY} stroke="#b45309" strokeWidth="1" />
      <line x1={CX} y1={PAD} x2={SIZE - PAD} y2={CY} stroke="#b45309" strokeWidth="1" />
      <line x1={PAD} y1={CY} x2={CX} y2={SIZE - PAD} stroke="#b45309" strokeWidth="1" />
      <line x1={SIZE - PAD} y1={CY} x2={CX} y2={SIZE - PAD} stroke="#b45309" strokeWidth="1" />

      <polygon
        points={`${CX},${PAD + 25} ${PAD + 25},${CY} ${CX},${SIZE - PAD - 25} ${SIZE - PAD - 25},${CY}`}
        fill="white"
        stroke="#b45309"
        strokeWidth="1.5"
      />

      {CONTENT_POSITIONS.map(({ house, cx, cy }) => {
        const rashiNum = houseRashi(house);
        const rashiName = RASHI_NAMES[rashiNum - 1];
        const planetsInHouse = planetsByHouse[house];
        const isLagna = house === 1;

        return (
          <g key={house}>
            <text
              x={cx}
              y={cy - 12}
              textAnchor="middle"
              fontSize="9"
              fill={isLagna ? '#92400e' : '#78716c'}
              fontWeight={isLagna ? 'bold' : 'normal'}
            >
              {isLagna ? `Lag · ${rashiName}` : rashiName}
            </text>
            <text
              x={cx}
              y={cy + 2}
              textAnchor="middle"
              fontSize="8"
              fill="#a16207"
            >
              {rashiNum}
            </text>
            {planetsInHouse.map((p, i) => (
              <text
                key={p.name}
                x={cx + (i % 2 === 0 ? -12 : 12)}
                y={cy + 16 + Math.floor(i / 2) * 14}
                textAnchor="middle"
                fontSize="11"
                fill="#1e40af"
                fontWeight="bold"
              >
                {p.symbol}
              </text>
            ))}
            {isLagna && (
              <text
                x={cx}
                y={cy - 22}
                textAnchor="middle"
                fontSize="8"
                fill="#b45309"
                fontWeight="bold"
              >
                I
              </text>
            )}
          </g>
        );
      })}

      <text x={CX} y={CY - 4} textAnchor="middle" fontSize="9" fill="#78716c">Janam</text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="9" fill="#78716c">Kundli</text>
    </svg>
  );
}
