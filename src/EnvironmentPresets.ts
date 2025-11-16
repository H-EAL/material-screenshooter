export interface EnvironmentPreset {
    name: string;
    description: string;
    skyboxUUID: string;
    radianceUUID: string;
    irradianceUUID: string;
}

// NOTE: Replace these placeholder UUIDs with actual UUIDs from your 3dverse environment
// You can find these by inspecting the environment entity in your scene
export const environmentPresets: EnvironmentPreset[] = [
    /*
    {
        name: "Photo Studio 01",
        description: "Professional photography setup",
        skyboxUUID: "b6e1e1bc-9d2a-5b23-bf82-5d3a961b7gc4",
        radianceUUID: "h8f0e0g3-6d5c-6e4g-0h1c-3c4d5e6f7g8h",
        irradianceUUID: "i9g1f1h4-7e6d-7f5h-1i2d-4d5e6f7g8h9i",
    },
    {
        name: "Moonless Golf",
        description: "Very neutral, soft outdoor lighting",
        skyboxUUID: "c7f2f2cd-0e3b-6c34-cg93-6e4b072c8hd5",
        radianceUUID: "j0h2g2i5-8f7e-8g6i-2j3e-5e6f7g8h9i0j",
        irradianceUUID: "k1i3h3j6-9g8f-9h7j-3k4f-6f7g8h9i0j1k",
    },
    {
        name: "Quattro Canti",
        description: "Balanced outdoor light, minimal color cast",
        skyboxUUID: "d8g3g3de-1f4c-7d45-dh04-7f5c183d9ie6",
        radianceUUID: "l2j4i4k7-0h9g-0i8k-4l5g-7g8h9i0j1k2l",
        irradianceUUID: "m3k5j5l8-1i0h-1j9l-5m6h-8h9i0j1k2l3m",
    },
    */
    {
        name: "Autumn Forest",
        description: "Warm outdoor lighting with natural forest ambiance",
        skyboxUUID: "a26e639d-c45b-41c6-bd76-29a15d10ee74",
        radianceUUID: "b807c4b8-0632-4f8f-857b-49c355dd273d",
        irradianceUUID: "49d35aef-78b9-4d95-898c-f55343af8334",
    },
    {
        name: "Puresky",
        description: "Completely neutral gray sky, no environment detail",
        skyboxUUID: "eb6b6cfc-a25f-4f9b-9cbf-287488a5f902",
        radianceUUID: "2abf3b02-7ce9-437c-a85f-5f2f54ecc67b",
        irradianceUUID: "ff345697-eca6-4970-bec7-7e6b1d52c715",
    },
    {
        name: "Studio Small 03",
        description: "Clean studio with soft omnidirectional lighting",
        skyboxUUID: "f254aee8-a5fc-466e-b327-9595fb228816",
        radianceUUID: "16b1e647-87d3-4217-b5bb-cca2de9b1251",
        irradianceUUID: "3063eae6-b512-464f-aa07-14fc844ad44a",
    },
    /*
    {
        name: "Industrial Sunset",
        description: "Balanced between natural and interesting",
        skyboxUUID: "f0i5i5fg-3h6e-9f67-fj26-9h7e305f1kg8",
        radianceUUID: "p6n8m8o1-4l3k-4m2o-8p9k-1k2l3m4n5o6p",
        irradianceUUID: "q7o9n9p2-5m4l-5n3p-9q0l-2l3m4n5o6p7q",
    },
    */
];

export const getEnvironmentByName = (name: string): EnvironmentPreset | undefined => {
    return environmentPresets.find((preset) => preset.name === name);
};
