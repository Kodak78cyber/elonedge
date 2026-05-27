/* Mock asset data for ElonEdge — all Elon Musk-linked ventures */

export interface ElonAsset {
  id: string;
  symbol: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  change24h: number;
  changePct24h: number;
  marketCap: string;
  color: string;
  gradient: string;
  annualReturn: number;
  volatility: number;
  priceHistory: number[];   /* 30-day */
}

/* Deterministic pseudo-random based on seed */
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHistory(basePrice: number, volatility: number, seed: number): number[] {
  const rand = seededRand(seed);
  const points: number[] = [];
  let price = basePrice * (0.85 + rand() * 0.1);
  for (let i = 0; i < 30; i++) {
    const drift = (rand() - 0.44) * volatility * price * 0.025;
    price = Math.max(price * 0.7, price + drift);
    points.push(Number(price.toFixed(2)));
  }
  /* End near the current price */
  const scale = basePrice / points[points.length - 1];
  return points.map(p => Number((p * scale).toFixed(2)));
}

export const ELON_ASSETS: ElonAsset[] = [
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla",
    description: "Electric vehicles & clean energy",
    category: "NYSE · Listed",
    basePrice: 248.42,
    change24h: 3.26,
    changePct24h: 1.33,
    marketCap: "$789.4B",
    color: "#E31937",
    gradient: "from-red-600/20 to-red-600/5",
    annualReturn: 18.4,
    volatility: 3.8,
    priceHistory: generateHistory(248.42, 3.8, 7),
  },
  {
    id: "spacex",
    symbol: "SPACEX",
    name: "SpaceX",
    description: "Aerospace & space exploration",
    category: "Private · Secondary",
    basePrice: 185.0,
    change24h: 5.55,
    changePct24h: 3.09,
    marketCap: "$350.0B",
    color: "#4F8EF7",
    gradient: "from-blue-500/20 to-blue-500/5",
    annualReturn: 42.8,
    volatility: 5.2,
    priceHistory: generateHistory(185.0, 5.2, 13),
  },
  {
    id: "xcorp",
    symbol: "XCORP",
    name: "X Corp",
    description: "Social media & payments platform",
    category: "Private · Secondary",
    basePrice: 34.2,
    change24h: -0.82,
    changePct24h: -2.34,
    marketCap: "$44.0B",
    color: "#E4E4E4",
    gradient: "from-neutral-400/20 to-neutral-400/5",
    annualReturn: 9.2,
    volatility: 7.1,
    priceHistory: generateHistory(34.2, 7.1, 23),
  },
  {
    id: "nrlk",
    symbol: "NRLK",
    name: "Neuralink",
    description: "Brain-computer interface technology",
    category: "Private · Secondary",
    basePrice: 42.6,
    change24h: 1.24,
    changePct24h: 2.99,
    marketCap: "$8.5B",
    color: "#A855F7",
    gradient: "from-purple-500/20 to-purple-500/5",
    annualReturn: 64.1,
    volatility: 8.4,
    priceHistory: generateHistory(42.6, 8.4, 37),
  },
  {
    id: "stlk",
    symbol: "STLK",
    name: "Starlink",
    description: "Global satellite internet network",
    category: "Private · Secondary",
    basePrice: 98.75,
    change24h: 2.18,
    changePct24h: 2.26,
    marketCap: "$150.0B",
    color: "#22D3EE",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    annualReturn: 31.7,
    volatility: 4.6,
    priceHistory: generateHistory(98.75, 4.6, 41),
  },
  {
    id: "xai",
    symbol: "XAI",
    name: "xAI",
    description: "Artificial intelligence & Grok",
    category: "Private · Secondary",
    basePrice: 62.3,
    change24h: 9.72,
    changePct24h: 18.47,
    marketCap: "$50.0B",
    color: "#F59E0B",
    gradient: "from-amber-500/20 to-amber-500/5",
    annualReturn: 88.3,
    volatility: 11.2,
    priceHistory: generateHistory(62.3, 11.2, 53),
  },
  {
    id: "bore",
    symbol: "BORE",
    name: "Boring Co.",
    description: "Infrastructure & tunnel construction",
    category: "Private · Secondary",
    basePrice: 18.9,
    change24h: 0.31,
    changePct24h: 1.67,
    marketCap: "$5.7B",
    color: "#92400E",
    gradient: "from-amber-900/30 to-amber-900/5",
    annualReturn: 12.5,
    volatility: 3.2,
    priceHistory: generateHistory(18.9, 3.2, 67),
  },
];

export function getAsset(id: string): ElonAsset | undefined {
  return ELON_ASSETS.find(a => a.id === id);
}

/* Simulated live price — slightly randomizes around base price */
export function getLivePrice(asset: ElonAsset, seed?: number): number {
  const noise = ((seed ?? Date.now()) % 200) / 10000; /* ±1% */
  const sign = ((seed ?? Date.now()) % 3 === 0) ? -1 : 1;
  return Number((asset.basePrice * (1 + sign * noise)).toFixed(2));
}
