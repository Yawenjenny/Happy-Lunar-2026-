import { COLORS } from './constants';

// We create a Data URI for the horse image to ensure it works immediately without external dependencies.
// Updated to match the requested "Tan/White Toy Horse" image.
const createHorseSvg = () => {
   const svg = `
   <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
     <g transform="translate(5,5) scale(0.9)">
        <!-- Tail (Puffy Cloud Shape) -->
        <path d="M15,55 Q10,55 10,65 Q10,75 20,75 Q30,75 30,65 Q30,55 20,55" fill="#FFFFFF" />
        <circle cx="15" cy="60" r="8" fill="#FFFFFF"/>
        <circle cx="22" cy="58" r="9" fill="#FFFFFF"/>
        <circle cx="20" cy="68" r="8" fill="#FFFFFF"/>

        <!-- Mane (White bubbles on back of neck) -->
        <path d="M52,15 Q45,15 45,35 L50,45 L55,40 L55,15 Z" fill="#FFFFFF" />
        <circle cx="50" cy="18" r="9" fill="#FFFFFF" />
        <circle cx="49" cy="28" r="8" fill="#FFFFFF" />
        <circle cx="51" cy="38" r="7" fill="#FFFFFF" />

        <!-- Body (Tan/Brown) -->
        <!-- Adjusted shape to match the 'H' style wide legs of the reference -->
        <path d="M25,92 
                 L30,48 
                 Q32,40 50,40 
                 L55,40 
                 L55,20 
                 Q55,5 78,12 
                 Q92,18 88,40 
                 Q85,48 75,45
                 L72,48
                 L80,92 
                 L58,92
                 Q58,60 52,60
                 Q45,60 45,92
                 Z" 
              fill="#C19A6B" />

        <!-- White Soles/Hooves (Bottom of legs) -->
        <path d="M25,92 L45,92 L45,96 Q35,97 25,96 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M58,92 L80,92 L80,96 Q69,97 58,96 Z" fill="#FFFFFF" opacity="0.9" />

        <!-- Face Details -->
        <!-- Eye -->
        <circle cx="80" cy="28" r="3.5" fill="#1F2937" />
        
        <!-- Bridle Lines -->
        <path d="M72,16 L76,45" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M88,35 Q78,38 74,44" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round" />
        
        <!-- Ear -->
        <ellipse cx="68" cy="12" rx="5" ry="9" transform="rotate(-15 68 12)" fill="#FFFFFF" />
        <ellipse cx="68" cy="12" rx="3" ry="7" transform="rotate(-15 68 12)" fill="#C19A6B" />

     </g>
   </svg>`;
   return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const ASSETS = {
  // Replace this with a URL to your actual image file if you want to use a hosted file
  // e.g., HORSE: "/path/to/horse.png",
  HORSE: createHorseSvg(),
};

export type GameImages = {
  horse: HTMLImageElement;
};

export const loadGameAssets = async (): Promise<GameImages> => {
  const load = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error("Failed to load image:", src, e);
        reject(e);
      };
    });
  };

  try {
    const [horse] = await Promise.all([
      load(ASSETS.HORSE),
    ]);
    return { horse };
  } catch (error) {
    console.error("Error loading game assets", error);
    throw error;
  }
};
