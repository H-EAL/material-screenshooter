export interface MaterialPreset {
    name: string;
    description: string;
    category: string;
    properties: {
        albedo: [number, number, number];
        roughness: number;
        metallic: number;
        emission?: [number, number, number];
        emissionIntensity?: number;
        opacity?: number;
    };
}

export const materialPresets: MaterialPreset[] = [
    // Metals
    {
        name: "Chrome",
        description: "Polished chrome metal",
        category: "Metals",
        properties: {
            albedo: [0.8, 0.8, 0.8],
            roughness: 0.05,
            metallic: 1,
        },
    },
    {
        name: "Gold",
        description: "Pure gold metal",
        category: "Metals",
        properties: {
            albedo: [1, 0.85, 0.57],
            roughness: 0.2,
            metallic: 1,
        },
    },
    {
        name: "Copper",
        description: "Pure copper metal",
        category: "Metals",
        properties: {
            albedo: [0.95, 0.64, 0.54],
            roughness: 0.15,
            metallic: 1,
        },
    },
    {
        name: "Bronze",
        description: "Bronze alloy",
        category: "Metals",
        properties: {
            albedo: [0.8, 0.5, 0.3],
            roughness: 0.3,
            metallic: 1,
        },
    },
    {
        name: "Silver",
        description: "Polished silver",
        category: "Metals",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.1,
            metallic: 1,
        },
    },
    {
        name: "Iron",
        description: "Raw iron metal",
        category: "Metals",
        properties: {
            albedo: [0.56, 0.57, 0.58],
            roughness: 0.4,
            metallic: 1,
        },
    },
    {
        name: "Aluminum",
        description: "Brushed aluminum",
        category: "Metals",
        properties: {
            albedo: [0.91, 0.92, 0.92],
            roughness: 0.25,
            metallic: 1,
        },
    },
    {
        name: "Brass",
        description: "Polished brass",
        category: "Metals",
        properties: {
            albedo: [0.87, 0.78, 0.5],
            roughness: 0.2,
            metallic: 1,
        },
    },

    // Plastics
    {
        name: "Plastic White",
        description: "Smooth white plastic",
        category: "Plastics",
        properties: {
            albedo: [0.9, 0.9, 0.9],
            roughness: 0.3,
            metallic: 0,
        },
    },
    {
        name: "Plastic Black",
        description: "Smooth black plastic",
        category: "Plastics",
        properties: {
            albedo: [0.1, 0.1, 0.1],
            roughness: 0.4,
            metallic: 0,
        },
    },
    {
        name: "Plastic Red",
        description: "Glossy red plastic",
        category: "Plastics",
        properties: {
            albedo: [0.8, 0.1, 0.1],
            roughness: 0.2,
            metallic: 0,
        },
    },
    {
        name: "Plastic Blue",
        description: "Glossy blue plastic",
        category: "Plastics",
        properties: {
            albedo: [0.1, 0.3, 0.8],
            roughness: 0.2,
            metallic: 0,
        },
    },
    {
        name: "Rubber",
        description: "Black rubber material",
        category: "Plastics",
        properties: {
            albedo: [0.2, 0.2, 0.2],
            roughness: 0.8,
            metallic: 0,
        },
    },

    // Natural Materials
    {
        name: "Wood Oak",
        description: "Light oak wood",
        category: "Natural",
        properties: {
            albedo: [0.55, 0.4, 0.25],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Wood Walnut",
        description: "Dark walnut wood",
        category: "Natural",
        properties: {
            albedo: [0.35, 0.22, 0.15],
            roughness: 0.9,
            metallic: 0,
        },
    },
    {
        name: "Wood Pine",
        description: "Pine wood",
        category: "Natural",
        properties: {
            albedo: [0.7, 0.55, 0.35],
            roughness: 0.8,
            metallic: 0,
        },
    },
    {
        name: "Leather",
        description: "Brown leather",
        category: "Natural",
        properties: {
            albedo: [0.4, 0.25, 0.15],
            roughness: 0.6,
            metallic: 0,
        },
    },
    {
        name: "Fabric Cotton",
        description: "White cotton fabric",
        category: "Natural",
        properties: {
            albedo: [0.85, 0.85, 0.85],
            roughness: 0.95,
            metallic: 0,
        },
    },
    {
        name: "Fabric Denim",
        description: "Blue denim fabric",
        category: "Natural",
        properties: {
            albedo: [0.2, 0.3, 0.5],
            roughness: 0.9,
            metallic: 0,
        },
    },

    // Stone & Ceramics
    {
        name: "Marble White",
        description: "Polished white marble",
        category: "Stone",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.15,
            metallic: 0,
        },
    },
    {
        name: "Marble Black",
        description: "Polished black marble",
        category: "Stone",
        properties: {
            albedo: [0.15, 0.15, 0.15],
            roughness: 0.1,
            metallic: 0,
        },
    },
    {
        name: "Granite",
        description: "Rough granite stone",
        category: "Stone",
        properties: {
            albedo: [0.5, 0.5, 0.5],
            roughness: 0.7,
            metallic: 0,
        },
    },
    {
        name: "Concrete",
        description: "Smooth concrete",
        category: "Stone",
        properties: {
            albedo: [0.6, 0.6, 0.6],
            roughness: 0.6,
            metallic: 0,
        },
    },
    {
        name: "Brick",
        description: "Red clay brick",
        category: "Stone",
        properties: {
            albedo: [0.6, 0.3, 0.2],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Ceramic White",
        description: "Glossy white ceramic",
        category: "Stone",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.05,
            metallic: 0,
        },
    },
    {
        name: "Ceramic Glazed",
        description: "Glossy glazed ceramic",
        category: "Stone",
        properties: {
            albedo: [0.8, 0.8, 0.9],
            roughness: 0.02,
            metallic: 0,
        },
    },

    // Glass & Transparent
    {
        name: "Glass",
        description: "Clear glass (requires transparency)",
        category: "Glass",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.0,
            metallic: 0,
            opacity: 0.1,
        },
    },
    {
        name: "Frosted Glass",
        description: "Frosted glass",
        category: "Glass",
        properties: {
            albedo: [0.9, 0.9, 0.9],
            roughness: 0.3,
            metallic: 0,
            opacity: 0.3,
        },
    },
    {
        name: "Tinted Glass Blue",
        description: "Blue tinted glass",
        category: "Glass",
        properties: {
            albedo: [0.7, 0.8, 0.95],
            roughness: 0.05,
            metallic: 0,
            opacity: 0.2,
        },
    },
    {
        name: "Tinted Glass Green",
        description: "Green tinted glass",
        category: "Glass",
        properties: {
            albedo: [0.7, 0.95, 0.8],
            roughness: 0.05,
            metallic: 0,
            opacity: 0.2,
        },
    },
    {
        name: "Stained Glass Red",
        description: "Red stained glass",
        category: "Glass",
        properties: {
            albedo: [0.95, 0.3, 0.3],
            roughness: 0.1,
            metallic: 0,
            opacity: 0.4,
        },
    },
    {
        name: "Ice",
        description: "Frozen ice surface",
        category: "Glass",
        properties: {
            albedo: [0.85, 0.92, 0.98],
            roughness: 0.15,
            metallic: 0,
            opacity: 0.5,
        },
    },
    {
        name: "Water",
        description: "Clear water",
        category: "Glass",
        properties: {
            albedo: [0.7, 0.8, 0.9],
            roughness: 0.0,
            metallic: 0,
            opacity: 0.3,
        },
    },
    {
        name: "Plastic Transparent",
        description: "Clear transparent plastic",
        category: "Glass",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.1,
            metallic: 0,
            opacity: 0.2,
        },
    },

    // Paint
    {
        name: "Paint Glossy White",
        description: "High gloss white paint",
        category: "Paint",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.1,
            metallic: 0,
        },
    },
    {
        name: "Paint Matte White",
        description: "Matte white paint",
        category: "Paint",
        properties: {
            albedo: [0.9, 0.9, 0.9],
            roughness: 0.8,
            metallic: 0,
        },
    },
    {
        name: "Paint Glossy Black",
        description: "High gloss black paint",
        category: "Paint",
        properties: {
            albedo: [0.05, 0.05, 0.05],
            roughness: 0.1,
            metallic: 0,
        },
    },
    {
        name: "Paint Matte Black",
        description: "Matte black paint",
        category: "Paint",
        properties: {
            albedo: [0.1, 0.1, 0.1],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Car Paint Red",
        description: "Metallic car paint",
        category: "Paint",
        properties: {
            albedo: [0.8, 0.1, 0.1],
            roughness: 0.15,
            metallic: 0.3,
        },
    },

    // Emissive Materials
    {
        name: "Neon Red",
        description: "Red neon light",
        category: "Emissive",
        properties: {
            albedo: [0.1, 0.1, 0.1],
            roughness: 0.5,
            metallic: 0,
            emission: [1, 0, 0],
            emissionIntensity: 5,
        },
    },
    {
        name: "Neon Blue",
        description: "Blue neon light",
        category: "Emissive",
        properties: {
            albedo: [0.1, 0.1, 0.1],
            roughness: 0.5,
            metallic: 0,
            emission: [0, 0.3, 1],
            emissionIntensity: 5,
        },
    },
    {
        name: "Neon Green",
        description: "Green neon light",
        category: "Emissive",
        properties: {
            albedo: [0.1, 0.1, 0.1],
            roughness: 0.5,
            metallic: 0,
            emission: [0, 1, 0],
            emissionIntensity: 5,
        },
    },
    {
        name: "LED White",
        description: "White LED light",
        category: "Emissive",
        properties: {
            albedo: [0.9, 0.9, 0.9],
            roughness: 0.3,
            metallic: 0,
            emission: [1, 1, 1],
            emissionIntensity: 3,
        },
    },
    {
        name: "Glow Orange",
        description: "Warm orange glow",
        category: "Emissive",
        properties: {
            albedo: [0.2, 0.1, 0.05],
            roughness: 0.5,
            metallic: 0,
            emission: [1, 0.5, 0],
            emissionIntensity: 2,
        },
    },
];

export const getPresetsByCategory = (category: string): MaterialPreset[] => {
    return materialPresets.filter((preset) => preset.category === category);
};

export const getAllCategories = (): string[] => {
    return Array.from(new Set(materialPresets.map((preset) => preset.category)));
};

export const getPresetByName = (name: string): MaterialPreset | undefined => {
    return materialPresets.find((preset) => preset.name === name);
};
