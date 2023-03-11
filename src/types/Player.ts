export default interface Player {
  arrPos: number,
  id: number,
  isTurn: boolean,
  hasTurnedFirstTile: boolean,
  hasTurnedSecondTile: boolean,
  name: string,
  pairsCount: number,
  score: number,
  streak: number
};