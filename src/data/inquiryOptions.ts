export interface InquiryOptionsConfig {
  propertyTypes: string[];
  fenceTypes: Array<{
    id: string;
    label: string;
  }>;
  fenceHeights: string[];
  gateOptions: string[];
  timelines: string[];
  contactMethods: string[];
}

export const inquiryOptions: InquiryOptionsConfig = {
  propertyTypes: [
    "Independent Villa / Bungalow / Kothi",
    "Gated Villa Society / RWA Community",
    "Apartment Complex / Residential Society",
    "Commercial Hub / IT Park / Business",
    "Farmhouse / Agricultural Acreage",
    "Industrial Plot / Warehouse / Factory",
  ],
  fenceTypes: [
    { id: "wood", label: "Wood Privacy (Teak / Treated Hardwood)" },
    { id: "vinyl", label: "Vinyl / PVC Privacy" },
    { id: "aluminum", label: "Ornamental Aluminum" },
    { id: "steel", label: "Steel & Architectural Wrought Iron" },
    { id: "composite", label: "Modern Composite Privacy" },
    { id: "chain-link", label: "Galvanized / Black Vinyl Chain-Link" },
    { id: "split-rail", label: "Split-Rail with Wire Mesh" },
    { id: "farm-ranch", label: "Farm & Ranch Post-and-Board" },
    { id: "not-sure", label: "Not sure yet (Need Expert Recommendation)" },
  ],
  fenceHeights: [
    "4 Feet (Front Perimeter / Decorative)",
    "5 Feet (Boundary / Containment)",
    "6 Feet (Standard Residential Privacy)",
    "8 Feet (Commercial / Maximum Security)",
    "Custom / Not sure yet",
  ],
  gateOptions: [
    "0 Gates (Perimeter Run Only)",
    "1 Single Pedestrian Walk Gate (4 ft)",
    "2 Pedestrian Walk Gates",
    "1 Automated Driveway Gate (10–14 ft)",
    "Walk Gate + Automated Driveway Gate",
    "Custom / Not sure yet",
  ],
  timelines: [
    "Immediately (1–2 Weeks)",
    "Within 1 Month",
    "1–3 Months",
    "Planning & Budgeting Phase",
  ],
  contactMethods: ["Phone Call", "WhatsApp Message", "Email"],
};
