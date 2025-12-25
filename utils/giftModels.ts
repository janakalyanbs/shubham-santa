/**
 * Utility to map gift names to public GLB/GLTF 3D model URLs.
 * Uses high-quality sample models from Khronos Group and ModelViewer.dev
 */
export const getGiftModel = (name: string = ""): string | null => {
  const lowerName = name.toLowerCase();

  const modelMap: Record<string, string> = {
    // Phones & High Tech
    // Using the Astronaut model to represent "Future", "Space Grade Titanium", and "Exploration" 
    // since a specific iPhone 17 GLB is not available in standard public libraries.
    "iphone": "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    "phone": "https://modelviewer.dev/shared-assets/models/Astronaut.glb", 
    "mobile": "https://modelviewer.dev/shared-assets/models/Astronaut.glb",

    // Vehicles
    "car": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb",
    "vehicle": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb",
    "buggy": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb",
    "truck": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb",
    
    // Fashion / Wearables
    "shoe": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    "sneaker": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    "nike": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    "helmet": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    "bike": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    "corset": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Corset/glTF-Binary/Corset.glb",
    
    // Tech & Space
    "space": "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    "astronaut": "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    "robot": "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    "cyborg": "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    
    // Home / Objects
    "camera": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb",
    "photo": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb",
    "chair": "https://modelviewer.dev/shared-assets/models/chair.glb",
    "furniture": "https://modelviewer.dev/shared-assets/models/chair.glb",
    "food": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    "burger": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    "avocado": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    "mixer": "https://modelviewer.dev/shared-assets/models/mixer.glb",
    "lantern": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    "light": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    "lamp": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    "duck": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    
    // Audio / Radio
    "radio": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    "music": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    "speaker": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    "audio": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
  };

  for (const key in modelMap) {
    if (lowerName.includes(key)) {
      return modelMap[key];
    }
  }

  // Graceful fallback: If no model is found (e.g. mobile, laptop), return null
  // The UI will then try to show an image.
  return null;
};