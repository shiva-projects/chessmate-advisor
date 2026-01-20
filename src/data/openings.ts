// ECO Opening Database - Maps move sequences to opening names and descriptions
export interface Opening {
  name: string;
  eco: string;
  description: string;
}

// Move sequences in SAN format, space-separated
export const openingsDatabase: Record<string, Opening> = {
  // King's Pawn Openings (E4)
  "e4": {
    name: "King's Pawn Opening",
    eco: "B00",
    description: "The most popular opening move, controlling the center and freeing the queen and bishop."
  },
  "e4 e5": {
    name: "Open Game",
    eco: "C20",
    description: "Both sides contest the center directly."
  },
  "e4 e5 Nf3": {
    name: "King's Knight Opening",
    eco: "C40",
    description: "Developing the knight while attacking the e5 pawn."
  },
  "e4 e5 Nf3 Nc6": {
    name: "King's Knight Opening: Normal Variation",
    eco: "C44",
    description: "Black defends the e5 pawn with the knight."
  },
  "e4 e5 Nf3 Nc6 Bb5": {
    name: "Ruy Lopez",
    eco: "C60",
    description: "One of the oldest and most respected openings, putting pressure on Black's center."
  },
  "e4 e5 Nf3 Nc6 Bb5 a6": {
    name: "Ruy Lopez: Morphy Defense",
    eco: "C78",
    description: "The main line, asking the bishop to declare its intentions."
  },
  "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": {
    name: "Ruy Lopez: Morphy Defense, Columbus Variation",
    eco: "C78",
    description: "White retreats the bishop while maintaining pressure."
  },
  "e4 e5 Nf3 Nc6 Bb5 Nf6": {
    name: "Ruy Lopez: Berlin Defense",
    eco: "C65",
    description: "A solid defense popular at the highest levels."
  },
  "e4 e5 Nf3 Nc6 Bc4": {
    name: "Italian Game",
    eco: "C50",
    description: "The bishop targets the vulnerable f7 square."
  },
  "e4 e5 Nf3 Nc6 Bc4 Bc5": {
    name: "Italian Game: Giuoco Piano",
    eco: "C53",
    description: "A quiet but effective development pattern."
  },
  "e4 e5 Nf3 Nc6 Bc4 Nf6": {
    name: "Italian Game: Two Knights Defense",
    eco: "C55",
    description: "An aggressive response from Black."
  },
  "e4 e5 Nf3 Nc6 d4": {
    name: "Scotch Game",
    eco: "C45",
    description: "An immediate central confrontation."
  },
  "e4 e5 Nf3 Nf6": {
    name: "Petrov's Defense",
    eco: "C42",
    description: "A solid, symmetrical response."
  },
  "e4 e5 Nc3": {
    name: "Vienna Game",
    eco: "C25",
    description: "Preparing f2-f4 with extra support."
  },
  "e4 e5 f4": {
    name: "King's Gambit",
    eco: "C30",
    description: "A romantic sacrifice for rapid development and attack."
  },
  "e4 e5 d4": {
    name: "Center Game",
    eco: "C21",
    description: "Immediately challenging the center."
  },
  
  // Sicilian Defense
  "e4 c5": {
    name: "Sicilian Defense",
    eco: "B20",
    description: "The most popular response to e4, creating an asymmetrical pawn structure."
  },
  "e4 c5 Nf3": {
    name: "Sicilian Defense: Open",
    eco: "B30",
    description: "The main line Sicilian."
  },
  "e4 c5 Nf3 d6": {
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B90",
    description: "Bobby Fischer's favorite, very sharp and complex."
  },
  "e4 c5 Nf3 Nc6": {
    name: "Sicilian Defense: Classical Variation",
    eco: "B30",
    description: "Developing the knight before committing the d-pawn."
  },
  "e4 c5 Nf3 e6": {
    name: "Sicilian Defense: French Variation",
    eco: "B40",
    description: "A flexible setup allowing Sicilian Kan or Taimanov."
  },
  "e4 c5 Nc3": {
    name: "Sicilian Defense: Closed",
    eco: "B23",
    description: "Avoiding the main lines for a quieter game."
  },
  "e4 c5 c3": {
    name: "Sicilian Defense: Alapin Variation",
    eco: "B22",
    description: "Preparing d4 with pawn support."
  },
  "e4 c5 d4": {
    name: "Sicilian Defense: Smith-Morra Gambit",
    eco: "B21",
    description: "A gambit offering a pawn for rapid development."
  },
  
  // French Defense
  "e4 e6": {
    name: "French Defense",
    eco: "C00",
    description: "A solid, strategic defense building a strong pawn chain."
  },
  "e4 e6 d4": {
    name: "French Defense",
    eco: "C00",
    description: "White occupies the center."
  },
  "e4 e6 d4 d5": {
    name: "French Defense: Normal Variation",
    eco: "C10",
    description: "The main French structure."
  },
  "e4 e6 d4 d5 Nc3": {
    name: "French Defense: Paulsen Variation",
    eco: "C10",
    description: "Defending the e4 pawn with the knight."
  },
  "e4 e6 d4 d5 Nd2": {
    name: "French Defense: Tarrasch Variation",
    eco: "C03",
    description: "Avoiding doubled pawns after potential ...dxe4."
  },
  "e4 e6 d4 d5 e5": {
    name: "French Defense: Advance Variation",
    eco: "C02",
    description: "White advances to create a spatial advantage."
  },
  "e4 e6 d4 d5 exd5": {
    name: "French Defense: Exchange Variation",
    eco: "C01",
    description: "A symmetrical structure leading to simpler positions."
  },
  
  // Caro-Kann Defense
  "e4 c6": {
    name: "Caro-Kann Defense",
    eco: "B10",
    description: "A solid defense preparing ...d5 with support."
  },
  "e4 c6 d4": {
    name: "Caro-Kann Defense",
    eco: "B12",
    description: "White takes the center."
  },
  "e4 c6 d4 d5": {
    name: "Caro-Kann Defense: Main Line",
    eco: "B12",
    description: "The typical Caro-Kann structure."
  },
  "e4 c6 d4 d5 Nc3": {
    name: "Caro-Kann Defense: Classical Variation",
    eco: "B18",
    description: "The main line."
  },
  "e4 c6 d4 d5 e5": {
    name: "Caro-Kann Defense: Advance Variation",
    eco: "B12",
    description: "Gaining space but allowing Black counterplay."
  },
  
  // Pirc/Modern
  "e4 d6": {
    name: "Pirc Defense",
    eco: "B07",
    description: "A flexible hypermodern approach."
  },
  "e4 g6": {
    name: "Modern Defense",
    eco: "B06",
    description: "Delaying central occupation."
  },
  
  // Scandinavian
  "e4 d5": {
    name: "Scandinavian Defense",
    eco: "B01",
    description: "Immediately challenging White's center."
  },
  "e4 d5 exd5": {
    name: "Scandinavian Defense",
    eco: "B01",
    description: "White captures the pawn."
  },
  "e4 d5 exd5 Qxd5": {
    name: "Scandinavian Defense: Mieses-Kotrč Variation",
    eco: "B01",
    description: "The classical recapture with the queen."
  },
  "e4 d5 exd5 Nf6": {
    name: "Scandinavian Defense: Modern Variation",
    eco: "B01",
    description: "Black develops the knight instead of recapturing."
  },
  
  // Alekhine's Defense
  "e4 Nf6": {
    name: "Alekhine's Defense",
    eco: "B02",
    description: "Provoking White's pawns to advance."
  },
  
  // Queen's Pawn Openings (D4)
  "d4": {
    name: "Queen's Pawn Opening",
    eco: "A40",
    description: "A solid center pawn, already protected by the queen."
  },
  "d4 d5": {
    name: "Queen's Pawn Game",
    eco: "D00",
    description: "Symmetrical center control."
  },
  "d4 d5 c4": {
    name: "Queen's Gambit",
    eco: "D06",
    description: "The classic opening, offering a pawn for central control."
  },
  "d4 d5 c4 e6": {
    name: "Queen's Gambit Declined",
    eco: "D30",
    description: "Black declines the gambit and solidifies the center."
  },
  "d4 d5 c4 dxc4": {
    name: "Queen's Gambit Accepted",
    eco: "D20",
    description: "Black accepts the pawn, planning ...b5 or giving it back."
  },
  "d4 d5 c4 c6": {
    name: "Slav Defense",
    eco: "D10",
    description: "A solid defense supporting d5 with a pawn."
  },
  
  // Indian Defenses
  "d4 Nf6": {
    name: "Indian Defense",
    eco: "A45",
    description: "A flexible response, not yet committing to a pawn structure."
  },
  "d4 Nf6 c4": {
    name: "Indian Defense",
    eco: "A50",
    description: "White expands in the center."
  },
  "d4 Nf6 c4 e6": {
    name: "Indian Defense",
    eco: "E00",
    description: "Preparing either ...Bb4 (Nimzo) or ...d5 (QGD)."
  },
  "d4 Nf6 c4 e6 Nc3": {
    name: "Indian Defense: Nimzo-Indian or Queen's Indian",
    eco: "E20",
    description: "Black can now choose between setups."
  },
  "d4 Nf6 c4 e6 Nc3 Bb4": {
    name: "Nimzo-Indian Defense",
    eco: "E20",
    description: "One of the most respected defenses against 1.d4."
  },
  "d4 Nf6 c4 e6 Nf3": {
    name: "Queen's Indian Defense",
    eco: "E12",
    description: "White avoids the pin of Nc3."
  },
  "d4 Nf6 c4 e6 Nf3 b6": {
    name: "Queen's Indian Defense",
    eco: "E12",
    description: "Fianchettoing the bishop."
  },
  "d4 Nf6 c4 g6": {
    name: "King's Indian Defense",
    eco: "E60",
    description: "A hypermodern approach allowing White center control."
  },
  "d4 Nf6 c4 g6 Nc3 Bg7": {
    name: "King's Indian Defense",
    eco: "E61",
    description: "Completing the fianchetto."
  },
  "d4 Nf6 c4 g6 Nc3 d5": {
    name: "Grünfeld Defense",
    eco: "D80",
    description: "Striking the center immediately."
  },
  "d4 Nf6 c4 c5": {
    name: "Benoni Defense",
    eco: "A56",
    description: "An aggressive counter to d4."
  },
  
  // Dutch Defense
  "d4 f5": {
    name: "Dutch Defense",
    eco: "A80",
    description: "An aggressive response, fighting for e4 control."
  },
  
  // English Opening
  "c4": {
    name: "English Opening",
    eco: "A10",
    description: "A flexible opening controlling d5."
  },
  "c4 e5": {
    name: "English Opening: Reversed Sicilian",
    eco: "A20",
    description: "Playing a Sicilian with an extra tempo."
  },
  "c4 c5": {
    name: "English Opening: Symmetrical Variation",
    eco: "A30",
    description: "Both sides control the center diagonally."
  },
  "c4 Nf6": {
    name: "English Opening: Anglo-Indian Defense",
    eco: "A15",
    description: "A flexible response."
  },
  
  // Réti Opening
  "Nf3": {
    name: "Réti Opening",
    eco: "A04",
    description: "A hypermodern approach, controlling the center from the flank."
  },
  "Nf3 d5": {
    name: "Réti Opening",
    eco: "A05",
    description: "Black occupies the center."
  },
  "Nf3 d5 c4": {
    name: "Réti Opening: King's Indian Attack",
    eco: "A05",
    description: "Challenging the d5 pawn."
  },
  
  // Catalan
  "d4 Nf6 c4 e6 g3": {
    name: "Catalan Opening",
    eco: "E00",
    description: "A sophisticated system fianchettoing the light-squared bishop."
  },
  
  // London System
  "d4 d5 Bf4": {
    name: "London System",
    eco: "D00",
    description: "A solid, flexible system for White."
  },
  "d4 Nf6 Bf4": {
    name: "London System",
    eco: "A45",
    description: "The London setup against Indian defenses."
  },
  
  // Bird's Opening
  "f4": {
    name: "Bird's Opening",
    eco: "A02",
    description: "An unusual but playable flank opening."
  },
  
  // King's Indian Attack
  "Nf3 d5 g3": {
    name: "King's Indian Attack",
    eco: "A07",
    description: "A universal system for White."
  },
};

export function findOpening(moveHistory: string[]): Opening | null {
  // Try to find the longest matching sequence
  for (let i = moveHistory.length; i > 0; i--) {
    const sequence = moveHistory.slice(0, i).join(" ");
    if (openingsDatabase[sequence]) {
      return openingsDatabase[sequence];
    }
  }
  return null;
}

export function getOpeningForMoves(moves: string[]): Opening {
  const found = findOpening(moves);
  return found || {
    name: "Unknown Position",
    eco: "—",
    description: "This position is not in the opening database."
  };
}