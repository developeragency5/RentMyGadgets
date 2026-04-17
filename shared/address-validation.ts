const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
  PR: "Puerto Rico", VI: "Virgin Islands", GU: "Guam", AS: "American Samoa",
  MP: "Northern Mariana Islands",
};

const STATE_NAMES_LOWER = new Set(
  Object.values(US_STATES).map((n) => n.toLowerCase())
);

const STATE_CODES = new Set(Object.keys(US_STATES));

export function normalizeState(state: string): string | null {
  const trimmed = state.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (upper.length === 2 && STATE_CODES.has(upper)) return upper;
  const lower = trimmed.toLowerCase();
  if (STATE_NAMES_LOWER.has(lower)) {
    for (const [code, name] of Object.entries(US_STATES)) {
      if (name.toLowerCase() === lower) return code;
    }
  }
  return null;
}

export function isValidUsZip(zip: string): boolean {
  return /^\d{5}(-?\d{4})?$/.test(zip.trim());
}

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface AddressValidationResult {
  ok: boolean;
  reason?: string;
}

export function validateUsAddress(addr: AddressInput): AddressValidationResult {
  const country = (addr.country ?? "United States").trim().toLowerCase();
  if (
    country &&
    country !== "united states" &&
    country !== "usa" &&
    country !== "us" &&
    country !== "u.s." &&
    country !== "u.s.a."
  ) {
    return { ok: false, reason: "We currently only ship within the United States." };
  }

  const street = addr.street.trim();
  if (street.length < 4 || !/\d/.test(street)) {
    return { ok: false, reason: "Please enter a valid street address with a number." };
  }

  const city = addr.city.trim();
  if (city.length < 2 || !/[A-Za-z]/.test(city)) {
    return { ok: false, reason: "Please enter a valid city." };
  }

  if (!normalizeState(addr.state)) {
    return { ok: false, reason: "Please enter a valid US state." };
  }

  if (!isValidUsZip(addr.zip)) {
    return { ok: false, reason: "Please enter a valid 5-digit ZIP code." };
  }

  return { ok: true };
}
