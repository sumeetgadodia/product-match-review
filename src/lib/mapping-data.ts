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
      ...([
        ["Blue", "bfdbfe", 92, "pending"],
        ["Green", "bbf7d0", 89, "pending"],
        ["Yellow", "fef08a", 87, "pending"],
        ["Pink", "fbcfe8", 90, "pending"],
        ["Purple", "e9d5ff", 85, "pending"],
        ["Orange", "fed7aa", 83, "pending"],
        ["Teal", "99f6e4", 81, "pending"],
        ["Mint", "a7f3d0", 79, "pending"],
        ["Lilac", "ddd6fe", 78, "pending"],
        ["Mustard", "fde68a", 86, "pending"],
        ["Coral", "fecdd3", 88, "pending"],
        ["Navy", "c7d2fe", 84, "pending"],
        ["Maroon", "fca5a5", 91, "accepted"],
        ["Olive", "d9f99d", 80, "accepted"],
        ["Black", "d1d5db", 76, "accepted"],
        ["White", "f3f4f6", 82, "accepted"],
        ["Grey", "e5e7eb", 70, "rejected"],
        ["Brown", "fcd5b5", 68, "rejected"],
      ] as const).map(([color, hex, score, status], i) => ({
        product_id: `1${100 + i}`,
        title: `${color} Embroidered Lehenga Set`,
        image_url: ph(`${color} Lehenga`, hex),
        designer_name: "Example Designer",
        base_color: color,
        similarity_score: score,
        mapping_type: "colour_mapping" as MappingType,
        status: status as MatchStatus,
      })),
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