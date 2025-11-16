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
        indexOfRefraction?: number;
        // Clear Coat properties
        clearCoatRoughness?: number;
        clearCoatStrength?: number;
        // Sheen properties
        sheenColor?: [number, number, number];
        sheenColorIntensity?: number;
        sheenRoughness?: number;
        // Anisotropy properties
        anisotropyStrength?: number;
        anisotropyRotation?: number;
        // Other properties
        [key: string]: number | [number, number, number] | [number, number] | undefined;
    };
    constants?: {
        MATERIAL_TRANSPARENT?: boolean;
        MATERIAL_CLEAR_COAT?: boolean;
        MATERIAL_SHEEN?: boolean;
        MATERIAL_ANISOTROPY?: boolean;
        VERTEX_SKINNED?: boolean;
        MATERIAL_TRIPLANAR?: boolean;
        MATERIAL_UNTEXTURED?: boolean;
        MATERIAL_NO_DECALS?: boolean;
        MATERIAL_PARALLAX?: boolean;
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
            anisotropyStrength: 0.7,
            anisotropyRotation: 0,
        },
        constants: {
            MATERIAL_ANISOTROPY: true,
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
            indexOfRefraction: 1.5,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.5,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.52,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.52,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.54,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.31,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.33,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
            indexOfRefraction: 1.46,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },

    // Paint
    {
        name: "Paint Glossy White",
        description: "High gloss white paint with clear coat",
        category: "Paint",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.1,
            metallic: 0,
            clearCoatStrength: 1.0,
            clearCoatRoughness: 0.05,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
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
        description: "High gloss black paint with clear coat",
        category: "Paint",
        properties: {
            albedo: [0.05, 0.05, 0.05],
            roughness: 0.1,
            metallic: 0,
            clearCoatStrength: 1.0,
            clearCoatRoughness: 0.05,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
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
        description: "Metallic car paint with clear coat",
        category: "Paint",
        properties: {
            albedo: [0.8, 0.1, 0.1],
            roughness: 0.15,
            metallic: 0.3,
            clearCoatStrength: 1.0,
            clearCoatRoughness: 0.03,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
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

    // Fabric & Sheen Materials
    {
        name: "Velvet Red",
        description: "Soft red velvet fabric",
        category: "Natural",
        properties: {
            albedo: [0.6, 0.1, 0.1],
            roughness: 0.9,
            metallic: 0,
            sheenColor: [1, 0.3, 0.3],
            sheenColorIntensity: 0.8,
            sheenRoughness: 0.4,
        },
        constants: {
            MATERIAL_SHEEN: true,
        },
    },
    {
        name: "Velvet Blue",
        description: "Soft blue velvet fabric",
        category: "Natural",
        properties: {
            albedo: [0.1, 0.2, 0.5],
            roughness: 0.9,
            metallic: 0,
            sheenColor: [0.3, 0.4, 1],
            sheenColorIntensity: 0.8,
            sheenRoughness: 0.4,
        },
        constants: {
            MATERIAL_SHEEN: true,
        },
    },
    {
        name: "Satin White",
        description: "Glossy white satin fabric",
        category: "Natural",
        properties: {
            albedo: [0.9, 0.9, 0.9],
            roughness: 0.4,
            metallic: 0,
            sheenColor: [1, 1, 1],
            sheenColorIntensity: 0.6,
            sheenRoughness: 0.2,
        },
        constants: {
            MATERIAL_SHEEN: true,
        },
    },
    {
        name: "Brushed Steel",
        description: "Directionally brushed steel",
        category: "Metals",
        properties: {
            albedo: [0.7, 0.7, 0.7],
            roughness: 0.35,
            metallic: 1,
            anisotropyStrength: 0.8,
            anisotropyRotation: 0,
        },
        constants: {
            MATERIAL_ANISOTROPY: true,
        },
    },
    // Additional Metals
    {
        name: "Titanium",
        description: "Lightweight titanium metal",
        category: "Metals",
        properties: {
            albedo: [0.65, 0.62, 0.59],
            roughness: 0.25,
            metallic: 1,
        },
    },
    {
        name: "Pewter",
        description: "Matte pewter metal",
        category: "Metals",
        properties: {
            albedo: [0.55, 0.55, 0.58],
            roughness: 0.5,
            metallic: 1,
        },
    },
    {
        name: "Gunmetal",
        description: "Dark gunmetal finish",
        category: "Metals",
        properties: {
            albedo: [0.3, 0.3, 0.35],
            roughness: 0.4,
            metallic: 1,
        },
    },
    {
        name: "Rose Gold",
        description: "Trendy rose gold alloy",
        category: "Metals",
        properties: {
            albedo: [0.95, 0.7, 0.65],
            roughness: 0.15,
            metallic: 1,
        },
    },
    // Additional Plastics
    {
        name: "Plastic Glossy Black",
        description: "Shiny black plastic",
        category: "Plastics",
        properties: {
            albedo: [0.05, 0.05, 0.05],
            roughness: 0.1,
            metallic: 0,
        },
    },
    {
        name: "Plastic Glossy White",
        description: "Shiny white plastic",
        category: "Plastics",
        properties: {
            albedo: [0.95, 0.95, 0.95],
            roughness: 0.15,
            metallic: 0,
        },
    },
    {
        name: "Plastic Orange",
        description: "Bright orange plastic",
        category: "Plastics",
        properties: {
            albedo: [1, 0.5, 0.1],
            roughness: 0.35,
            metallic: 0,
        },
    },
    {
        name: "Plastic Yellow",
        description: "Bright yellow plastic",
        category: "Plastics",
        properties: {
            albedo: [1, 0.9, 0.1],
            roughness: 0.35,
            metallic: 0,
        },
    },
    {
        name: "Plastic Purple",
        description: "Vibrant purple plastic",
        category: "Plastics",
        properties: {
            albedo: [0.6, 0.2, 0.8],
            roughness: 0.35,
            metallic: 0,
        },
    },
    // Additional Natural Materials
    {
        name: "Cork",
        description: "Natural cork material",
        category: "Natural",
        properties: {
            albedo: [0.7, 0.55, 0.35],
            roughness: 0.9,
            metallic: 0,
        },
    },
    {
        name: "Bamboo",
        description: "Light bamboo wood",
        category: "Natural",
        properties: {
            albedo: [0.8, 0.7, 0.45],
            roughness: 0.6,
            metallic: 0,
        },
    },
    {
        name: "Charcoal",
        description: "Dark charcoal",
        category: "Natural",
        properties: {
            albedo: [0.15, 0.15, 0.15],
            roughness: 0.95,
            metallic: 0,
        },
    },
    {
        name: "Terracotta",
        description: "Clay terracotta",
        category: "Natural",
        properties: {
            albedo: [0.8, 0.4, 0.25],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Wax",
        description: "Soft wax material",
        category: "Natural",
        properties: {
            albedo: [0.95, 0.9, 0.7],
            roughness: 0.3,
            metallic: 0,
        },
    },
    {
        name: "Linen",
        description: "Natural linen fabric",
        category: "Natural",
        properties: {
            albedo: [0.85, 0.8, 0.7],
            roughness: 0.85,
            metallic: 0,
            sheenColor: [0.9, 0.85, 0.75],
            sheenColorIntensity: 0.3,
            sheenRoughness: 0.6,
        },
        constants: {
            MATERIAL_SHEEN: true,
        },
    },
    {
        name: "Denim",
        description: "Blue denim fabric",
        category: "Natural",
        properties: {
            albedo: [0.2, 0.3, 0.5],
            roughness: 0.8,
            metallic: 0,
            sheenColor: [0.3, 0.4, 0.6],
            sheenColorIntensity: 0.4,
            sheenRoughness: 0.5,
        },
        constants: {
            MATERIAL_SHEEN: true,
        },
    },
    // Additional Stone Materials
    {
        name: "Obsidian",
        description: "Volcanic glass obsidian",
        category: "Stone",
        properties: {
            albedo: [0.05, 0.05, 0.05],
            roughness: 0.15,
            metallic: 0,
        },
    },
    {
        name: "Sandstone",
        description: "Light sandstone",
        category: "Stone",
        properties: {
            albedo: [0.85, 0.75, 0.6],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Limestone",
        description: "Beige limestone",
        category: "Stone",
        properties: {
            albedo: [0.8, 0.75, 0.65],
            roughness: 0.8,
            metallic: 0,
        },
    },
    {
        name: "Slate",
        description: "Dark slate stone",
        category: "Stone",
        properties: {
            albedo: [0.35, 0.35, 0.4],
            roughness: 0.7,
            metallic: 0,
        },
    },
    {
        name: "Quartz",
        description: "White quartz crystal",
        category: "Stone",
        properties: {
            albedo: [0.95, 0.95, 0.98],
            roughness: 0.25,
            metallic: 0,
        },
    },
    // Additional Glass/Transparent
    {
        name: "Amber",
        description: "Fossilized amber resin",
        category: "Glass",
        properties: {
            albedo: [1, 0.6, 0.1],
            roughness: 0.05,
            metallic: 0,
            opacity: 0.3,
            indexOfRefraction: 1.54,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Emerald Glass",
        description: "Green emerald tinted glass",
        category: "Glass",
        properties: {
            albedo: [0.1, 0.8, 0.3],
            roughness: 0.05,
            metallic: 0,
            opacity: 0.2,
            indexOfRefraction: 1.58,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Ruby Glass",
        description: "Deep red ruby glass",
        category: "Glass",
        properties: {
            albedo: [0.9, 0.1, 0.15],
            roughness: 0.05,
            metallic: 0,
            opacity: 0.25,
            indexOfRefraction: 1.76,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Smoke Glass",
        description: "Gray smoky glass",
        category: "Glass",
        properties: {
            albedo: [0.4, 0.4, 0.4],
            roughness: 0.1,
            metallic: 0,
            opacity: 0.35,
            indexOfRefraction: 1.5,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    // Additional Paint Materials
    {
        name: "Car Paint Blue Metallic",
        description: "Metallic blue car paint",
        category: "Paint",
        properties: {
            albedo: [0.1, 0.3, 0.8],
            roughness: 0.15,
            metallic: 0.6,
            clearCoatStrength: 1.0,
            clearCoatRoughness: 0.03,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
        },
    },
    {
        name: "Car Paint Silver",
        description: "Metallic silver car paint",
        category: "Paint",
        properties: {
            albedo: [0.75, 0.75, 0.75],
            roughness: 0.2,
            metallic: 0.8,
            clearCoatStrength: 1.0,
            clearCoatRoughness: 0.03,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
        },
    },
    {
        name: "Paint Matte Green",
        description: "Flat matte green paint",
        category: "Paint",
        properties: {
            albedo: [0.2, 0.6, 0.3],
            roughness: 0.85,
            metallic: 0,
        },
    },
    {
        name: "Paint Glossy Yellow",
        description: "High gloss yellow paint",
        category: "Paint",
        properties: {
            albedo: [1, 0.9, 0.1],
            roughness: 0.1,
            metallic: 0,
            clearCoatStrength: 0.8,
            clearCoatRoughness: 0.05,
        },
        constants: {
            MATERIAL_CLEAR_COAT: true,
        },
    },
    // Additional Emissive Materials
    {
        name: "Neon Blue",
        description: "Bright neon blue glow",
        category: "Emissive",
        properties: {
            albedo: [0.1, 0.3, 1],
            roughness: 0.5,
            metallic: 0,
            emission: [0.2, 0.5, 1],
            emissionIntensity: 8,
        },
    },
    {
        name: "Neon Pink",
        description: "Vibrant neon pink glow",
        category: "Emissive",
        properties: {
            albedo: [1, 0.1, 0.5],
            roughness: 0.5,
            metallic: 0,
            emission: [1, 0.2, 0.6],
            emissionIntensity: 8,
        },
    },
    {
        name: "Neon Yellow",
        description: "Bright neon yellow glow",
        category: "Emissive",
        properties: {
            albedo: [1, 1, 0.1],
            roughness: 0.5,
            metallic: 0,
            emission: [1, 1, 0.2],
            emissionIntensity: 7,
        },
    },
    {
        name: "Lava",
        description: "Molten lava material",
        category: "Emissive",
        properties: {
            albedo: [0.2, 0.05, 0.01],
            roughness: 0.7,
            metallic: 0,
            emission: [1, 0.3, 0],
            emissionIntensity: 10,
        },
    },
    {
        name: "Hologram",
        description: "Iridescent holographic effect",
        category: "Emissive",
        properties: {
            albedo: [0.5, 0.7, 1],
            roughness: 0.1,
            metallic: 0.3,
            emission: [0.4, 0.6, 1],
            emissionIntensity: 3,
        },
    },
    // Ceramic Materials (New Category)
    {
        name: "Porcelain White",
        description: "Glossy white porcelain",
        category: "Ceramic",
        properties: {
            albedo: [0.98, 0.98, 0.98],
            roughness: 0.15,
            metallic: 0,
        },
    },
    {
        name: "Ceramic Matte",
        description: "Unglazed ceramic",
        category: "Ceramic",
        properties: {
            albedo: [0.8, 0.75, 0.7],
            roughness: 0.9,
            metallic: 0,
        },
    },
    {
        name: "Ceramic Glazed Blue",
        description: "Glossy blue glazed ceramic",
        category: "Ceramic",
        properties: {
            albedo: [0.2, 0.4, 0.8],
            roughness: 0.12,
            metallic: 0,
        },
    },
    {
        name: "Ceramic Terracotta Glazed",
        description: "Glazed terracotta ceramic",
        category: "Ceramic",
        properties: {
            albedo: [0.85, 0.45, 0.3],
            roughness: 0.2,
            metallic: 0,
        },
    },
    // Gem Materials (New Category)
    {
        name: "Diamond",
        description: "Clear diamond crystal",
        category: "Gems",
        properties: {
            albedo: [1, 1, 1],
            roughness: 0.01,
            metallic: 0,
            opacity: 0.05,
            indexOfRefraction: 2.42,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Ruby",
        description: "Red ruby gemstone",
        category: "Gems",
        properties: {
            albedo: [0.9, 0.05, 0.1],
            roughness: 0.03,
            metallic: 0,
            opacity: 0.2,
            indexOfRefraction: 1.77,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Emerald",
        description: "Green emerald gemstone",
        category: "Gems",
        properties: {
            albedo: [0.1, 0.9, 0.3],
            roughness: 0.03,
            metallic: 0,
            opacity: 0.15,
            indexOfRefraction: 1.58,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Sapphire",
        description: "Blue sapphire gemstone",
        category: "Gems",
        properties: {
            albedo: [0.1, 0.2, 0.9],
            roughness: 0.02,
            metallic: 0,
            opacity: 0.18,
            indexOfRefraction: 1.77,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
        },
    },
    {
        name: "Amethyst",
        description: "Purple amethyst crystal",
        category: "Gems",
        properties: {
            albedo: [0.6, 0.2, 0.8],
            roughness: 0.04,
            metallic: 0,
            opacity: 0.25,
            indexOfRefraction: 1.54,
        },
        constants: {
            MATERIAL_TRANSPARENT: true,
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
