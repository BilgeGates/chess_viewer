import { useState, useEffect } from "react";
import { PIECE_MAP } from "../constants/chessConstants";
import { getCustomPieceUrl } from "../utils/customPieces";

export const usePieceImages = (pieceStyle) => {
  const [pieceImages, setPieceImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const loadPieces = () => {
      const images = {};
      let loaded = 0;
      const total = Object.keys(PIECE_MAP).length;

      Object.keys(PIECE_MAP).forEach((key) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          loaded++;
          if (loaded === total) {
            setPieceImages({ ...images });
            setIsLoading(false);
          }
        };

        img.onerror = () => {
          loaded++;
          if (loaded === total) {
            setPieceImages({ ...images });
            setIsLoading(false);
          }
        };

        img.src = getCustomPieceUrl(key, pieceStyle);
        images[key] = img;
      });
    };

    loadPieces();
  }, [pieceStyle]);

  return { pieceImages, isLoading };
};
