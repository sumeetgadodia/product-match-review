export type MappingType = "colour_mapping" | "variant" | "mini_me" | "twinning";
export type MatchStatus = "pending" | "accepted" | "rejected";

export interface MainProduct {
  product_id: string;
  title: string;
  image_url: string;
  designer_name?: string;
  base_color?: string;
  mapping_type: MappingType;
}

export interface MatchProduct {
  product_id: string;
  title: string;
  image_url: string;
  designer_name?: string;
  base_color?: string;
  similarity_score?: number;
  mapping_type: MappingType;
  status: MatchStatus;
}

export interface MappingGroup {
  mainProduct: MainProduct;
  matches: MatchProduct[];
}

export const MAPPING_TYPE_LABEL: Record<MappingType, string> = {
  colour_mapping: "Colour Mapping",
  variant: "Variant",
  mini_me: "Mini Me",
  twinning: "Twinning",
};

export const MAPPING_TYPE_INSTRUCTION: Record<MappingType, string> = {
  colour_mapping:
    "Check if these products are the same/similar design in different colours.",
  variant: "Check if these products are valid variants of the same product.",
  mini_me: "Check if these products are matching adult and kids versions.",
  twinning: "Check if these products are suitable twinning matches.",
};

const ph = (seed: string, color = "e5e7eb") =>
  `https://placehold.co/600x800/${color}/1f2937?text=${encodeURIComponent(seed)}`;

export const MOCK_GROUPS: MappingGroup[] = [
  {
    mainProduct: {
      product_id: "1001",
      title: "Red Embroidered Lehenga Set",
      image_url: ph("Red Lehenga", "fecaca"),
      designer_name: "Example Designer",
      base_color: "Red",
      mapping_type: "colour_mapping",
    },
    matches: [
      {
        product_id: "1002",
        title: "Blue Embroidered Lehenga Set",
        image_url: ph("Blue Lehenga", "bfdbfe"),
        designer_name: "Example Designer",
        base_color: "Blue",
        similarity_score: 92,
        mapping_type: "colour_mapping",
        status: "pending",
      },
      {
        product_id: "1003",
        title: "Green Embroidered Lehenga Set",
        image_url: ph("Green Lehenga", "bbf7d0"),
        designer_name: "Example Designer",
        base_color: "Green",
        similarity_score: 89,
        mapping_type: "colour_mapping",
        status: "pending",
      },
    ],
  },
  {
    mainProduct: {
      product_id: "2001",
      title: "Ivory Printed Kurta Set - Size Variant",
      image_url: ph("Ivory Kurta", "fef3c7"),
      designer_name: "Example Designer",
      base_color: "Ivory",
      mapping_type: "variant",
    },
    matches: [
      {
        product_id: "2002",
        title: "Ivory Printed Kurta Set - Plus Size",
        image_url: ph("Ivory Plus", "fef3c7"),
        designer_name: "Example Designer",
        base_color: "Ivory",
        similarity_score: 95,
        mapping_type: "variant",
        status: "pending",
      },
    ],
  },
  {
    mainProduct: {
      product_id: "3001",
      title: "Women's Pink Anarkali Set",
      image_url: ph("Pink Anarkali", "fbcfe8"),
      designer_name: "Example Designer",
      base_color: "Pink",
      mapping_type: "mini_me",
    },
    matches: [
      {
        product_id: "3002",
        title: "Girls Pink Anarkali Set",
        image_url: ph("Girls Pink", "fbcfe8"),
        designer_name: "Example Designer",
        base_color: "Pink",
        similarity_score: 91,
        mapping_type: "mini_me",
        status: "pending",
      },
    ],
  },
  {
    mainProduct: {
      product_id: "4001",
      title: "Men's Beige Kurta Set",
      image_url: ph("Beige Kurta", "f5e6d3"),
      designer_name: "Example Designer",
      base_color: "Beige",
      mapping_type: "twinning",
    },
    matches: [
      {
        product_id: "4002",
        title: "Women's Beige Saree",
        image_url: ph("Beige Saree", "f5e6d3"),
        designer_name: "Example Designer",
        base_color: "Beige",
        similarity_score: 84,
        mapping_type: "twinning",
        status: "pending",
      },
      {
        product_id: "4003",
        title: "Boys Beige Kurta Set",
        image_url: ph("Boys Beige", "f5e6d3"),
        designer_name: "Example Designer",
        base_color: "Beige",
        similarity_score: 88,
        mapping_type: "twinning",
        status: "pending",
      },
    ],
  },
];