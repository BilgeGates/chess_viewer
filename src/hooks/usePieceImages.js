import { useEffect, useState } from "react";
import { PIECE_MAP } from "../constants/chessConstants";

/**
 * Load piece images for selected style
 */
export const usePieceImages = (pieceStyle) => {
  const [pieceImages, setPieceImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const images = {};
    let loaded = 0;
    const total = Object.keys(PIECE_MAP).length;

    Object.entries(PIECE_MAP).forEach(([key, value]) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const onComplete = () => {
        loaded++;
        if (loaded === total) {
          setPieceImages({ ...images });
          setIsLoading(false);
        }
      };

      img.onload = onComplete;
      img.onerror = onComplete;
      img.src = `https://lichess1.org/assets/piece/${pieceStyle}/${value}.svg`;
      images[key] = img;
    });
  }, [pieceStyle]);

  return { pieceImages, isLoading };
};
