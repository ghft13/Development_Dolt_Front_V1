
export interface Service {
  id: string
  title: string
  description: string
  base_price: number
  currency: string
  category: string
  features: string[]
   icon: string,
}

export const SERVICES: Service[] = [
  {
    id: "plumbing",
    title: "Plumbing Service",
    description: "Professional plumbing repairs, leak fixing, pipe installations, and drainage solutions.",
    base_price: 20,
    currency: "USD",
    category: "home",
    features: ["Leak Detection", "Pipe Repair", "Drain Cleaning"],
    icon: "wrench",
  
  },
  {
    id: "electrical",
    title: "Electrical Service",
    description: "Expert electrical repairs, wiring, fixture installations, and safety inspections.",
    base_price: 25,
    currency: "USD",
    category: "home",
    features: ["Wiring & Rewiring", "Fixture Installation", "Safety Checks"],
    icon: "bolt",
  },
  {
    id: "carpentry",
    title: "Carpentry Service",
    description: "Custom woodwork, furniture repair, cabinet installation, and general carpentry.",
    base_price: 30,
    currency: "USD",
    category: "home",
    features: ["Woodwork", "Furniture Repair", "Cabinet Installation"],
    icon: "hammer",
  },
  {
    id: "appliance-repair",
    title: "Home Appliance Repair",
    description: "Repair and maintenance of refrigerators, washing machines, and other appliances.",
    base_price: 35,
    currency: "USD",
    category: "home",
    features: ["Refrigerator Repair", "Washing Machine Service", "Dishwasher Fixing"],
    icon: "toolbox",
  },
  {
    id: "painting",
    title: "Painting Services",
    description: "Interior and exterior painting, wall preparation, and decorative finishes.",
    base_price: 50,
    currency: "USD",
    category: "home",
    features: ["Interior Painting", "Exterior Painting", "Texture Work"],
    icon: "paint-roller",
  },
  {
    id: "pest-control",
    title: "Pest Control Services",
    description: "Comprehensive pest management, termite treatment, and rodent control.",
    base_price: 40,
    currency: "USD",
    category: "home",
    features: ["Termite Treatment", "Rodent Control", "Preventive Solutions"],
    icon: "bug",
  },
  {
    id: "gardening",
    title: "Gardening & Landscaping",
    description: "Lawn care, garden design, plant maintenance, and tree trimming.",
    base_price: 45,
    currency: "USD",
    category: "home",
    features: ["Lawn Care", "Garden Design", "Tree Trimming"],
    icon: "leaf",
  },
  {
    id: "renovation",
    title: "Home Renovation",
    description: "Complete home remodeling, kitchen and bathroom renovations.",
    base_price: 150,
    currency: "USD",
    category: "home",
    features: ["Kitchen Remodeling", "Bathroom Renovation", "Structural Work"],
    icon: "building",
  },
  {
    id: "hvac",
    title: "AC & HVAC Services",
    description: "Air conditioning repair, HVAC maintenance, and duct cleaning.",
    base_price: 60,
    currency: "USD",
    category: "home",
    features: ["Preventive Maintenance", "Emergency Repairs", "Duct Cleaning"],
    icon: "snowflake",
  },
  {
    id: "security",
    title: "Home Security",
    description: "CCTV setup, alarm systems, and smart lock installations.",
    base_price: 80,
    currency: "USD",
    category: "home",
    features: ["CCTV Installation", "Alarm Systems", "Smart Locks"],
    icon: "shield",
  },
  // Add the remaining services similarly...
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter((s) => s.category === category)
}
