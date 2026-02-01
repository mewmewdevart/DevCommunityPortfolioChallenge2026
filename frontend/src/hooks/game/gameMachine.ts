import { setup, assign } from 'xstate';
import { type Player, type Vector2 } from '@interfaces/types';
import { INITIAL_PLAYER_POS, PLAYER_SIZE } from '@interfaces/constants';

export type GameEvent =
    | { type: 'START_GAME' }
    | { type: 'RETURN_MENU' }
    | { type: 'MOVE_TO'; path: Vector2[] }
    | { type: 'MOVE_STEP'; dx: number; dy: number }
    | { type: 'STEP_COMPLETE' }
    | { type: 'PLAYER_UPDATE'; position: Vector2; facing: 'up' | 'down' | 'left' | 'right' }
    | { type: 'INTERACTION_FOUND'; id: string }
    | { type: 'DISMISS_DIALOG' };

export interface GameContext {
    player: Player;
    facing: 'up' | 'down' | 'left' | 'right';
    moveQueue: Vector2[];
    activeDialogId: string | null;
}

export const gameMachine = setup({
    types: {
        context: {} as GameContext,
        events: {} as GameEvent,
    },
    actions: {
        resetGame: assign({
            player: {
                position: INITIAL_PLAYER_POS,
                size: PLAYER_SIZE,
            },
            facing: 'down',
            moveQueue: [],
            activeDialogId: null,
        }),
        setMoveQueue: assign({
            moveQueue: ({ event }) => (event.type === 'MOVE_TO' ? event.path : []),
        }),
        updatePlayerPosition: assign({
            player: ({ context, event }) => {
                if (event.type === 'PLAYER_UPDATE') {
                    return { ...context.player, position: event.position };
                }
                return context.player;
            },
            facing: ({ context, event }) => {
                if (event.type === 'PLAYER_UPDATE') {
                    return event.facing;
                }
                return context.facing;
            },
        }),
        processStep: assign({
            moveQueue: ({ context }) => context.moveQueue.slice(1),
        }),
        openDialog: assign({
            activeDialogId: ({ event }) => (event.type === 'INTERACTION_FOUND' ? event.id : null),
        }),
        closeDialog: assign({
            activeDialogId: null,
        }),
    },
}).createMachine({
    id: 'game',
    initial: 'start',
    context: {
        player: {
            position: INITIAL_PLAYER_POS,
            size: PLAYER_SIZE,
        },
        facing: 'down',
        moveQueue: [],
        activeDialogId: null,
    },
    states: {
        start: {
            on: {
                START_GAME: {
                    target: 'playing',
                    actions: 'resetGame',
                },
            },
        },
        playing: {
            initial: 'idle',
            on: {
                RETURN_MENU: 'start',
                INTERACTION_FOUND: {
                    target: 'dialog',
                    actions: 'openDialog'
                }
            },
            states: {
                idle: {
                    on: {
                        MOVE_TO: {
                            target: 'walking',
                            actions: 'setMoveQueue',
                        },
                        MOVE_STEP: {
                            // Determine step manually, similar to before, but we might just queue a single step
                            // For simplified refactor, we can let the hook calculate the target and send MOVE_TO with 1 step
                            target: 'walking',
                        }
                    },
                },
                walking: {
                    after: {
                        120: [
                            {
                                guard: ({ context }) => context.moveQueue.length > 0,
                                actions: 'processStep',
                                // We need a way to enable the hook to perform layout effects (collision check) 
                                // Actually, moving logic purely to machine is hard without passing the collision map.
                                // Hybrid approach: Machine handles STATE (Walking vs Idle), Hook handles PHYSICS and sends 'PLAYER_UPDATE'.
                                target: 'walking'
                            },
                            { target: 'idle' }
                        ]
                    },
                    on: {
                        PLAYER_UPDATE: {
                            actions: 'updatePlayerPosition'
                        },
                        MOVE_TO: {
                            actions: 'setMoveQueue',
                            target: 'walking', // Re-enter to reset timer?
                        }
                    },
                    always: {
                        guard: ({ context }) => context.moveQueue.length === 0,
                        target: 'idle'
                    }
                },
            },
        },
        dialog: {
            on: {
                DISMISS_DIALOG: {
                    target: 'playing.idle',
                    actions: 'closeDialog',
                },
            },
        },
    },
});
