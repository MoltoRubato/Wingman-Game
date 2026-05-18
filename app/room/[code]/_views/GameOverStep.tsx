"use client";

import { GameOverView } from "@/app/play/_views/GameOverView";

type Props = {
  won: boolean;
  hearts: number;
  rumours: number;
  onPlayAgain: () => void;
};

export const GameOverStep = ({ won, hearts, rumours, onPlayAgain }: Props) => (
  <GameOverView
    won={won}
    hearts={hearts}
    rumours={rumours}
    onPlayAgain={onPlayAgain}
    onExit={() => location.assign("/")}
  />
);
