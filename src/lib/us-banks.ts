export interface USBank {
  id: string;
  name: string;
  short: string;
  abbr: string;
  color: string;
  routingNumber: string;
}

export const US_BANKS: USBank[] = [
  { id: "chase",       name: "Chase",             short: "JPMorgan Chase",     abbr: "CH", color: "#117ACA", routingNumber: "021000021" },
  { id: "boa",         name: "Bank of America",   short: "BofA",               abbr: "BA", color: "#E31837", routingNumber: "026009593" },
  { id: "wells",       name: "Wells Fargo",       short: "Wells Fargo Bank",   abbr: "WF", color: "#D71E2B", routingNumber: "121000248" },
  { id: "citi",        name: "Citibank",          short: "Citi",               abbr: "CT", color: "#003B70", routingNumber: "021000089" },
  { id: "usbank",      name: "U.S. Bank",         short: "U.S. Bancorp",       abbr: "US", color: "#0C2074", routingNumber: "091000022" },
  { id: "pnc",         name: "PNC Bank",          short: "PNC Financial",      abbr: "PN", color: "#F58025", routingNumber: "043000096" },
  { id: "capitalone",  name: "Capital One",       short: "Capital One Bank",   abbr: "C1", color: "#D03027", routingNumber: "031176110" },
  { id: "td",          name: "TD Bank",           short: "TD Bank N.A.",       abbr: "TD", color: "#43B02A", routingNumber: "031201360" },
  { id: "truist",      name: "Truist",            short: "Truist Financial",   abbr: "TR", color: "#5C2D91", routingNumber: "061000104" },
  { id: "goldman",     name: "Goldman Sachs",     short: "Marcus by GS",       abbr: "GS", color: "#7399C6", routingNumber: "124085244" },
  { id: "schwab",      name: "Charles Schwab",    short: "Schwab Bank",        abbr: "CS", color: "#00A0DF", routingNumber: "121202211" },
  { id: "ally",        name: "Ally Bank",         short: "Ally Financial",     abbr: "AY", color: "#6E1A8B", routingNumber: "124003116" },
  { id: "discover",    name: "Discover Bank",     short: "Discover",           abbr: "DC", color: "#FF6000", routingNumber: "031100649" },
  { id: "usaa",        name: "USAA",              short: "USAA Federal",       abbr: "UA", color: "#003366", routingNumber: "314074269" },
  { id: "amex",        name: "American Express",  short: "Amex Bank",          abbr: "AE", color: "#2E77BC", routingNumber: "124085066" },
  { id: "fifth",       name: "Fifth Third",       short: "Fifth Third Bank",   abbr: "53", color: "#0072CE", routingNumber: "042000314" },
];
