export interface TestimonialItem {
  id: string;
  author: string;
  location: string;
  projectScope: string;
  rating: number;
  date: string;
  reviewText: string;
  source?: string;
  isVerified: boolean;
  avatarInitials: string;
}

export interface TestimonialsConfig {
  sectionId: string;
  badgeLabel: string;
  mainHeading: {
    prefix: string;
    accent: string;
    suffix?: string;
  };
  subheading: string;
  aggregateRating: {
    average: number;
    totalReviews: number;
    platform: string;
  } | null;
  ctaText: string;
  ctaTargetId: string;
  testimonials: TestimonialItem[];
}

export const testimonialsContent: TestimonialsConfig = {
  sectionId: "testimonials",
  badgeLabel: "CLIENT TESTIMONIALS",
  mainHeading: {
    prefix: "What Our ",
    accent: "Customers Say",
  },
  subheading:
    "Real feedback from property owners across India who trusted FenceCo with their perimeter boundaries, privacy, and long-term installation quality.",
  aggregateRating: null,
  ctaText: "Request Your Fencing Estimate",
  ctaTargetId: "inquiry-form",
  testimonials: [
    {
      id: "review-1",
      author: "Rajesh & Ananya Sharma",
      location: "Whitefield, Bengaluru",
      projectScope: "6 ft Teak Wood Privacy · 185 Rft",
      rating: 5,
      date: "October 2024",
      reviewText:
        "The laser leveling on our perimeter fence line made all the difference. Our plot has a slight slope toward the rainwater drain area, and the crew custom-racked every section so there are zero ground gaps for our pets. Completed in three days and left the site completely tidy.",
      source: "Verified Client",
      isVerified: true,
      avatarInitials: "RS",
    },
    {
      id: "review-2",
      author: "Vikram Malhotra",
      location: "DLF Phase 5, Gurugram",
      projectScope: "Ornamental Architectural Black Aluminum · 140 Rft",
      rating: 5,
      date: "November 2024",
      reviewText:
        "We needed a pool and garden boundary that met gated community setback codes and RWA architectural guidelines. FenceCo provided complete CAD spec sheets before breaking ground. The gate hardware is rock-solid with self-closing magnetic latch hinges that click shut perfectly every time.",
      source: "Verified Client",
      isVerified: true,
      avatarInitials: "VM",
    },
    {
      id: "review-3",
      author: "Arjun & Priya Patel",
      location: "Koregaon Park, Pune",
      projectScope: "White Privacy Vinyl with Lattice Cap · 210 Rft",
      rating: 5,
      date: "December 2024",
      reviewText:
        "Transparent, itemized quote with zero surprises. Other vendors gave vague verbal ballparks, but FenceCo walked the boundary with a laser measure, verified underground water and electrical lines, and delivered top-tier virgin vinyl panels that look stunning.",
      source: "Verified Client",
      isVerified: true,
      avatarInitials: "AP",
    },
    {
      id: "review-4",
      author: "Sunil Singhania",
      location: "Sector 62, Noida",
      projectScope: "Industrial Galvanized Chain-Link · 320 Rft",
      rating: 5,
      date: "January 2025",
      reviewText:
        "Secured our commercial warehouse yard with 8-foot chain-link and privacy screening. The concrete footing depths were inspected and verified on every terminal post. Exceptional turnaround time and true professional project management.",
      source: "Commercial Client",
      isVerified: true,
      avatarInitials: "SS",
    },
    {
      id: "review-5",
      author: "Kavita Rao",
      location: "Jubilee Hills, Hyderabad",
      projectScope: "Modern Composite Horizontal Privacy · 160 Rft",
      rating: 5,
      date: "February 2025",
      reviewText:
        "Contemporary architectural finish that transformed our outdoor patio space. The dark walnut composite panels match our villa aesthetics beautifully, and knowing it won't attract termites or warp during monsoons gives us total peace of mind.",
      source: "Verified Client",
      isVerified: true,
      avatarInitials: "KR",
    },
    {
      id: "review-6",
      author: "Rohan & Sneha Mukherjee",
      location: "Alibaug Estate, Maharashtra",
      projectScope: "3-Rail Post-and-Board with Wire Mesh · 280 Rft",
      rating: 5,
      date: "March 2025",
      reviewText:
        "Blends seamlessly with our countryside farmhouse while keeping our dogs safely inside. The wire backing is virtually invisible from twenty feet away, and the heavy-duty posts are firmly anchored with concrete footings. First-class craftsmanship.",
      source: "Verified Client",
      isVerified: true,
      avatarInitials: "RM",
    },
  ],
};
