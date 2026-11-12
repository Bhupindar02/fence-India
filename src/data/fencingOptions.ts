export type PrivacyLevel = "Full Privacy" | "Semi-Private" | "Open View";
export type MaintenanceLevel = "Low" | "Moderate" | "High";
export type BudgetTier = "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹";
export type MaterialCategory = "wood" | "vinyl" | "metal" | "composite" | "ranch";

export interface FencingOption {
  id: string;
  name: string;
  category: MaterialCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  image: string;
  pricePerLinearFootEstimate: {
    min: number;
    max: number;
    currency: string;
    unit: string;
    displayRange: string;
    isEstimate: boolean;
  };
  budgetTier: BudgetTier;
  privacyLevel: PrivacyLevel;
  privacyPercentage: number;
  maintenanceLevel: MaintenanceLevel;
  maintenanceDetails: string;
  durability: string;
  advantages: string[];
  typicalApplications: string[];
  availableStyles: string[];
  variableFactorsNote: string;
}

export const FENCING_OPTIONS: FencingOption[] = [
  {
    id: "wood-privacy",
    name: "Wood Privacy Fencing",
    category: "wood",
    categoryLabel: "Natural Wood",
    tagline: "Timeless warmth, natural beauty, and complete property privacy",
    description:
      "Crafted from seasoned Burma Teak, treated Sal wood, and weather-cured pine, natural wood fencing offers authentic organic character, unmatched design versatility, and total visual seclusion for residential properties.",
    image: "/images/fencing/wood-privacy.jpg",
    pricePerLinearFootEstimate: {
      min: 1800,
      max: 3200,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹1,800 – ₹3,200",
      isEstimate: true,
    },
    budgetTier: "₹₹",
    privacyLevel: "Full Privacy",
    privacyPercentage: 100,
    maintenanceLevel: "Moderate",
    maintenanceDetails: "Stain or seal every 2–3 years to maintain color and moisture resistance in monsoon regions.",
    durability: "15 – 25+ Years (with regular anti-termite treatment & rot-resistant post footing)",
    advantages: [
      "100% natural, biodegradable wood texture with authentic premium aroma",
      "Easily polished, stained or painted to harmonize with architectural finishes",
      "Excellent acoustic dampening for urban and suburban quietness",
      "Concealed stainless steel fastener options for clean sightlines",
    ],
    typicalApplications: [
      "Independent Villas & Bungalow Boundaries",
      "Courtyard & Pool Perimeter Privacy",
      "Child & Pet Safe Play Areas",
      "Property Line Separation & Screening",
    ],
    availableStyles: ["Board-on-Board", "Shadowbox", "Horizontal Contemporary", "Dog-Ear Picket"],
    variableFactorsNote:
      "Price varies based on teak vs. treated hardwood, fence height (6ft vs. 8ft), concrete footing depth, gate hardware, and terrain grade.",
  },
  {
    id: "vinyl-pvc",
    name: "Vinyl / PVC Fencing",
    category: "vinyl",
    categoryLabel: "Engineered Vinyl",
    tagline: "Zero maintenance, pristine finish, and lifetime architectural resilience",
    description:
      "Manufactured with heavy-duty UV-stabilized virgin vinyl, our PVC privacy fences will never rot, warp, crack, or require repainting. Delivering crisp modern aesthetics built to withstand harsh Indian monsoons and high heat with minimal seasonal upkeep.",
    image: "/images/fencing/vinyl-pvc.jpg",
    pricePerLinearFootEstimate: {
      min: 2600,
      max: 4600,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹2,600 – ₹4,600",
      isEstimate: true,
    },
    budgetTier: "₹₹₹",
    privacyLevel: "Full Privacy",
    privacyPercentage: 100,
    maintenanceLevel: "Low",
    maintenanceDetails: "Zero painting or staining; wash occasionally with water and mild soap.",
    durability: "30+ Years to Lifetime (UV-inhibited warranty backing)",
    advantages: [
      "100% termite-proof, waterproof, and impervious to blistering sun",
      "Interlocking tongue-and-groove pickets provide complete privacy",
      "Engineered steel-reinforced bottom rails prevent sagging over time",
      "Available in pure white, almond, desert sand, and realistic woodgrain finishes",
    ],
    typicalApplications: [
      "Gated Communities & Villa Societies (RWAs)",
      "Coastal & High-Humidity Cities (Mumbai, Chennai, Goa)",
      "Swimming Pool & Terrace Perimeter Enclosures",
      "Low-Maintenance Premium Residential Boundaries",
    ],
    availableStyles: ["Full Privacy Tongue & Groove", "Lattice Top Accent", "Spindle Top", "Ranch Picket"],
    variableFactorsNote:
      "Price varies based on color/texture choices, wind-load reinforcement packages, gate widths, and post concrete embedment.",
  },
  {
    id: "ornamental-aluminum",
    name: "Ornamental Aluminum Fencing",
    category: "metal",
    categoryLabel: "Metal & Aluminum",
    tagline: "Sophisticated perimeter security, open views, and rust-free durability",
    description:
      "Engineered from high-tensile architectural aluminum with a marine-grade powder-coated finish. Delivers the classic grandeur of historic wrought iron without the rust, corrosion, or relentless repainting.",
    image: "/images/fencing/ornamental-aluminum.jpg",
    pricePerLinearFootEstimate: {
      min: 3000,
      max: 5400,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹3,000 – ₹5,400",
      isEstimate: true,
    },
    budgetTier: "₹₹₹",
    privacyLevel: "Open View",
    privacyPercentage: 15,
    maintenanceLevel: "Low",
    maintenanceDetails: "Maintenance-free electrostatically applied powder coat; occasional rinse.",
    durability: "40+ Years (rust-proof core architectural metal)",
    advantages: [
      "Impervious to rust, monsoon rains, and coastal salt spray",
      "Preserves surrounding landscaped gardens while securing property borders",
      "Precision self-closing safety latches for child and pool security",
      "Rackable panel construction contours effortlessly to sloped site grades",
    ],
    typicalApplications: [
      "Swimming Pool Safety Enclosures",
      "Front Lawn & Boundary Defining",
      "Golf Course, Lakefront & Waterfront Properties",
      "Modern Architectural Landscaping",
    ],
    availableStyles: ["Flat Top Contemporary", "Spear Point Traditional", "Ring & Finial Decorative", "Puppy Picket Bottom"],
    variableFactorsNote:
      "Price varies based on picket spacing (standard vs. fine picket), decorative finials, grade rackability, and automated gate operators.",
  },
  {
    id: "steel-wrought-iron",
    name: "Steel & Wrought-Iron Fencing",
    category: "metal",
    categoryLabel: "Metal & Aluminum",
    tagline: "Uncompromising physical strength, heritage aesthetics, and maximum security",
    description:
      "Fabricated with heavy-gauge galvanized steel and architectural wrought iron, welded into rigid perimeter panels. Provides the highest structural barrier strength and impact resistance available.",
    image: "/images/fencing/steel-wrought-iron.jpg",
    pricePerLinearFootEstimate: {
      min: 4200,
      max: 7500,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹4,200 – ₹7,500",
      isEstimate: true,
    },
    budgetTier: "₹₹₹₹",
    privacyLevel: "Open View",
    privacyPercentage: 20,
    maintenanceLevel: "Moderate",
    maintenanceDetails: "Inspect powder coat periodically; touch up scratches to prevent oxidation.",
    durability: "50+ Years (heavy-gauge hot-dip galvanized core)",
    advantages: [
      "Maximum impact resistance and physical barrier security",
      "Prestige curb appeal that enhances luxury property appraisals",
      "Solid welded construction prevents panel racking or tampering",
      "Pairs seamlessly with granite, stone, and brick masonry columns",
    ],
    typicalApplications: [
      "Luxury Kothis, Bungalows & Residential Estates",
      "Commercial & Industrial High-Security Perimeters",
      "Heritage & Farmhouse Properties",
      "Automated Driveway Gate Portals",
    ],
    availableStyles: ["Estate Welded Spear", "Modern Minimalist Square Bar", "Archway Ornamented", "Masonry Column Inset"],
    variableFactorsNote:
      "Price varies based on steel gauge thickness, custom fabrication, masonry pillar integration, and automated entry systems.",
  },
  {
    id: "composite-privacy",
    name: "Modern Composite Fencing",
    category: "composite",
    categoryLabel: "Composite Material",
    tagline: "Next-generation eco-luxury, rich wood aesthetics, and zero splintering",
    description:
      "A premium fusion of recycled hardwood fibers and high-density polymers, framed in anodized architectural aluminum posts. Creates a sleek, modern horizontal look with superior resistance to wind, monsoons, and termites.",
    image: "/images/fencing/composite-privacy.jpg",
    pricePerLinearFootEstimate: {
      min: 3500,
      max: 6000,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹3,500 – ₹6,000",
      isEstimate: true,
    },
    budgetTier: "₹₹₹₹",
    privacyLevel: "Full Privacy",
    privacyPercentage: 100,
    maintenanceLevel: "Low",
    maintenanceDetails: "Never requires staining, painting, or sanding. Simple annual pressure rinse.",
    durability: "30 – 50 Years (scratch- and fade-resistant cap layer)",
    advantages: [
      "Deep natural timber woodgrain with 100% termite proofing and zero rotting",
      "Modular horizontal tongue-and-groove system offers contemporary architectural lines",
      "Superior acoustic sound-barrier properties to block road and neighborhood noise",
      "Sustainably manufactured from up to 95% recycled timber and polymers",
    ],
    typicalApplications: [
      "High-End Contemporary Architecture",
      "Urban & Suburban Noise Reduction",
      "Luxury Villa Patio Enclosures",
      "All-Weather Outdoor Living Spaces",
    ],
    availableStyles: ["Horizontal Flush Slats", "Integrated Frosted Acrylic Slats", "Vertical Acoustic", "Bi-Color Contrast"],
    variableFactorsNote:
      "Price varies based on horizontal framing system, post metal finishes, embedded acoustic panels, and gate integration.",
  },
  {
    id: "chain-link",
    name: "Chain-Link Fencing (Vinyl-Coated)",
    category: "metal",
    categoryLabel: "Metal & Aluminum",
    tagline: "Cost-effective, highly durable, and resilient perimeter containment",
    description:
      "Built with commercial-grade galvanized steel mesh coated in smooth black or green weather-resistant vinyl. Delivers exceptional boundary security, plot demarcation, and open visibility at the most economical rate.",
    image: "/images/fencing/chain-link.jpg",
    pricePerLinearFootEstimate: {
      min: 1200,
      max: 2200,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹1,200 – ₹2,200",
      isEstimate: true,
    },
    budgetTier: "₹",
    privacyLevel: "Open View",
    privacyPercentage: 10,
    maintenanceLevel: "Low",
    maintenanceDetails: "Virtually zero maintenance. Bonded PVC coating prevents rust and snagging.",
    durability: "20 – 30 Years (galvanized core with bonded protective coating)",
    advantages: [
      "Most economical per-running-foot fencing solution available",
      "Black or green finish blends seamlessly into natural greenery and landscaping",
      "High wind transparency; will not blow down in severe storm gusts",
      "Optional privacy slats can be inserted to increase privacy up to 85%",
    ],
    typicalApplications: [
      "Large Plot Demarcation & Boundary Enclosures",
      "Sports Courts & Institutional Enclosures",
      "Agricultural Land & Orchard Boundary Protection",
      "Industrial & Warehouse Storage Yards",
    ],
    availableStyles: ["Black Vinyl Coated", "Green Vinyl Coated", "Traditional Galvanized", "Slotted Privacy Insert"],
    variableFactorsNote:
      "Price varies based on wire gauge (9 vs. 11 gauge), bottom tension wire, privacy slat inserts, and gate widths.",
  },
  {
    id: "split-rail",
    name: "Split-Rail & Post Boundary Fencing",
    category: "ranch",
    categoryLabel: "Farm & Ranch",
    tagline: "Rustic charm, open-space demarcation, and landscape harmony",
    description:
      "Hand-hewn from naturally rot-resistant seasoned timber logs. Features classic notched posts and interlocking horizontal rails that follow the natural contours of rolling terrain, farmhouses, and countryside retreats.",
    image: "/images/fencing/split-rail.jpg",
    pricePerLinearFootEstimate: {
      min: 1400,
      max: 2600,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹1,400 – ₹2,600",
      isEstimate: true,
    },
    budgetTier: "₹",
    privacyLevel: "Open View",
    privacyPercentage: 5,
    maintenanceLevel: "Low",
    maintenanceDetails: "Natural weathering to a silver patina; treated against wood-borers and moisture.",
    durability: "15 – 25 Years (treated timber with natural decay resistance)",
    advantages: [
      "Natural rustic aesthetic that blends into plantations, gardens, and expansive lots",
      "Follows steep hills and rolling topography without awkward stepping",
      "Easily paired with subtle wire mesh backing to secure pets and gardens",
      "Extremely economical for large perimeter property lines",
    ],
    typicalApplications: [
      "Farmhouses & Countryside Retreats",
      "Resorts & Heritage Properties",
      "Plantation & Trail Borders",
      "Front Lawn Decorative Demarcation",
    ],
    availableStyles: ["2-Rail Rustic", "3-Rail Standard", "4-Rail High Barrier", "Mesh-Backed Pet Enclosure"],
    variableFactorsNote:
      "Price varies based on rail count (2-rail vs. 3-rail), wood species, welded wire backing mesh, and custom corner posts.",
  },
  {
    id: "farm-ranch",
    name: "Farm & Ranch Post-and-Board",
    category: "ranch",
    categoryLabel: "Farm & Ranch",
    tagline: "High-visibility pasture enclosure, livestock safety, and rural elegance",
    description:
      "Engineered for expansive rural estates, agricultural land, and equestrian paddocks. Features smooth, heavy-duty horizontal boards fastened to solid round or square concrete-anchored posts for maximum containment and aesthetics.",
    image: "/images/fencing/farm-ranch.jpg",
    pricePerLinearFootEstimate: {
      min: 1100,
      max: 2100,
      currency: "INR",
      unit: "per running foot (installed estimate)",
      displayRange: "₹1,100 – ₹2,100",
      isEstimate: true,
    },
    budgetTier: "₹",
    privacyLevel: "Open View",
    privacyPercentage: 10,
    maintenanceLevel: "Moderate",
    maintenanceDetails: "Periodic inspection of fasteners; repaint or stain every 4–5 years if painted.",
    durability: "20 – 35 Years (pressure-treated posts with copper azole)",
    advantages: [
      "Safe containment engineered specifically for livestock, horses, and open acreage",
      "Clean linear curb appeal that defines large acreage with elegance",
      "Smooth interior boards prevent animal injury or rubbing splinters",
      "Highly scalable and cost-effective across hundreds of running feet",
    ],
    typicalApplications: [
      "Equestrian Facilities & Horse Paddocks",
      "Agricultural Plots & Stud Farms",
      "Expansive Rural Estate Perimeters",
      "Vineyard, Orchard & Plantation Demarcation",
    ],
    availableStyles: ["3-Board Classic", "4-Board Equestrian", "Crossbuck (X-Pattern)", "Black Board Estate Fence"],
    variableFactorsNote:
      "Price varies based on board count (3 vs. 4 boards), hardwood vs. treated pine, electric wire additions, and driveway gate spans.",
  },
];
