export interface WhyChooseUsBenefit {
  id: string;
  iconName: "ShieldCheck" | "Ruler" | "ReceiptText" | "Mountain" | "HardHat" | "UserCheck";
  title: string;
  shortDescription: string;
  badge: string;
  highlightDetails?: string[];
}

export interface WhyChooseUsConfig {
  sectionId: string;
  badgeLabel: string;
  mainHeading: {
    prefix: string;
    accent: string;
    suffix?: string;
  };
  subheading: string;
  benefits: WhyChooseUsBenefit[];
  trustSummary: {
    statement: string;
    ctaButtonText: string;
    ctaTargetId: string;
    guaranteeBadges: Array<{
      label: string;
      description: string;
    }>;
  };
}

/**
 * Easily editable business content configuration.
 * Update company claims, credentials, and benefit descriptions here
 * without modifying UI or layout components.
 */
export const whyChooseUsContent: WhyChooseUsConfig = {
  sectionId: "why-choose-us",
  badgeLabel: "THE FENCECO INDIA STANDARD",
  mainHeading: {
    prefix: "Why Property Owners ",
    accent: "Choose Us",
  },
  subheading:
    "Building lasting property boundaries across India with architectural-grade materials, certified setting depths, transparent itemized pricing, and respectful site management from estimate to final inspection.",
  benefits: [
    {
      id: "premium-materials",
      iconName: "ShieldCheck",
      title: "Architectural-Grade Materials",
      shortDescription:
        "We source heavy-gauge aluminum, UV-stabilized virgin vinyl, and seasoned hardwood with zero structural fillers, engineered specifically for harsh monsoons, high humidity, and intense UV exposure.",
      badge: "Mill-Certified Sourcing",
      highlightDetails: [
        "Virgin vinyl with titanium dioxide UV inhibitors",
        "Architectural-grade powder-coated aluminum",
        "Seasoned, termite-resistant treated timber",
      ],
    },
    {
      id: "precision-installation",
      iconName: "Ruler",
      title: "Laser-Aligned Deep Setting",
      shortDescription:
        "Structural integrity begins below the surface. Posts are augered to strict regional wind-load depths and set in high-compression concrete with laser-verified transit plumb lines.",
      badge: "True Plumb & Grade",
      highlightDetails: [
        "Calculated embedment depth for local soil conditions",
        "Transit laser leveling across long perimeter runs",
        "Full concrete collar around every structural post",
      ],
    },
    {
      id: "transparent-estimates",
      iconName: "ReceiptText",
      title: "Clear, Itemized Pricing",
      shortDescription:
        "Every estimate clearly delineates material grades, running footage, post spacing, gate hardware, and installation fees. You receive a guaranteed price with no hidden surprises.",
      badge: "Zero Hidden Fees",
      highlightDetails: [
        "Transparent per-running-foot breakdowns",
        "Itemized automated gate hardware & accessories",
        "Written scope locked before work begins",
      ],
    },
    {
      id: "topography-engineering",
      iconName: "Mountain",
      title: "Custom Slope & Grade Solutions",
      shortDescription:
        "Properties are rarely perfectly level. We custom-rack and step fence panels to hug your property's contours cleanly, preventing pet escape gaps and water-retention issues.",
      badge: "Contour-Matched",
      highlightDetails: [
        "Precision racked panels for gentle slopes",
        "Stepped sections for steep grade breaks",
        "Ground clearance tuned to prevent rot & animal intrusion",
      ],
    },
    {
      id: "site-protection",
      iconName: "HardHat",
      title: "Site Care & Underground Utility Safety",
      shortDescription:
        "Before digging, underground electrical conduits, water pipes, and utility lines are thoroughly surveyed. Our crews protect existing landscaping, driveways, and hardscapes, concluding with a full magnetic fastener sweep.",
      badge: "Safe & Clean Site",
      highlightDetails: [
        "Pre-construction underground utility scan",
        "Turf and paver protection during material hauling",
        "High-power magnetic nail and screw sweeps",
      ],
    },
    {
      id: "dedicated-communication",
      iconName: "UserCheck",
      title: "Dedicated Project Lead",
      shortDescription:
        "You work with a responsive project manager who coordinates site preparation, material delivery, quality checks, and leads a thorough final walkthrough before sign-off.",
      badge: "Direct Communication",
      highlightDetails: [
        "Single point of contact from start to finish",
        "Proactive scheduling and delivery notifications",
        "Final punch-list walkthrough with the property owner",
      ],
    },
  ],
  trustSummary: {
    statement:
      "Every fence is built with verified specifications, verified property lines, and a dedicated team committed to lasting property value.",
    ctaButtonText: "Get a Free Fencing Estimate",
    ctaTargetId: "inquiry-form",
    guaranteeBadges: [
      {
        label: "Direct Manufacturer Warranties",
        description: "Official factory coverage on vinyl, aluminum, and composite components",
      },
      {
        label: "Documented Workmanship Standard",
        description: "Post depth, alignment, and gate hinge calibration checked on every job",
      },
      {
        label: "Municipal & RWA Bylaw Guidance",
        description: "Full assistance with municipal setback requirements, height rules, and RWA guidelines",
      },
    ],
  },
};
