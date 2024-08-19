import React, {useState} from 'react';

function Card({ cardId }) {
  const [isFaceUp, setIsFaceUp] = useState(true);

  function handleClick() {
    setIsFaceUp(!isFaceUp);
  }

  return (
    <div className="Card" onClick={handleClick}>
      {isFaceUp ? (
        <img src={"cards/" + cardId + ".jpg"} className="card-img" height="136" width="96" alt={cardId} />
      ) : (
        <img src={"cards/back.jpg"} className="card-img" alt="card-back"/>
      )}
    </div>
  );
}

export default Card;
