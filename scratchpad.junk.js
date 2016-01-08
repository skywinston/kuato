// Query for decks with card ratings
// select * from decks INNER JOIN cards on (decks.id = deck_id) where owner = 1;

// Query for decks with no foreign key references in the cards
//select * from decks left outer join cards on (decks.id = deck_id) where (deck_id IS NULL AND decks.owner = 1);

// COMBINED
// select * from decks INNER JOIN cards on (decks.id = deck_id) where owner = 1 UNION select * from decks left outer join cards on (decks.id = deck_id) where (deck_id IS NULL AND decks.owner = 1);