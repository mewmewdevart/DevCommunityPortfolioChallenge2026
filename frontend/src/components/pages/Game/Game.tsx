import React from 'react';
import { GameCanvas } from '@organisms/GameCanvas/GameCanvas';
import './Game.css';

interface GameProps {
    onLoginRequest: () => void;
    onVideoGameRequest: () => void;
}

export const Game: React.FC<GameProps> = ({ onLoginRequest, onVideoGameRequest }) => {
    return (
        <div className="game">
            <GameCanvas onLoginRequest={onLoginRequest} onVideoGameRequest={onVideoGameRequest} />
        </div>
    );
};

export default Game;
