import { SearchableSelect } from "../UI";
import { PIECE_SETS } from "../../constants/chessConstants";

const PieceSelector = ({ pieceStyle, setPieceStyle }) => {
  return (
    <SearchableSelect
      options={PIECE_SETS}
      value={pieceStyle}
      onChange={setPieceStyle}
      label="Piece Style"
      placeholder="Search piece style..."
      emptyMessage="No matching piece styles"
    />
  );
};

export default PieceSelector;
