import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';

// Desktop Sounds
import soundStartup from '@/assets/sounds/desktop/The Microsoft Sound.wav';
import soundChord from '@/assets/sounds/desktop/CHORD.WAV';
import soundDing from '@/assets/sounds/desktop/DING.WAV';
import soundTada from '@/assets/sounds/desktop/TADA.WAV';
import soundChimes from '@/assets/sounds/desktop/CHIMES.WAV';

// Game Sounds
import gameBgmCozy from '@/assets/sounds/game/bs-cozy-welcome-menu.mp3';
import gameSfxCancel from '@/assets/sounds/game/Cancel.wav';
import gameSfxClick from '@/assets/sounds/game/Click.wav';
import gameSfxConfirm from '@/assets/sounds/game/Confirm.wav';
import gameSfxMenuIn from '@/assets/sounds/game/Menu_In.wav';
import gameSfxMenuOut from '@/assets/sounds/game/Menu_Out.wav';
import gameSfxPause from '@/assets/sounds/game/Pause.wav';
import gameSfxSteps from '@/assets/sounds/game/Steps.wav';
import gameSfxCat from '@/assets/sounds/game/Cat_Meow.wav';
import gameSfxPs2Startup from '@/assets/sounds/game/Play2Startup.wav';
import gameSfxPs2Title from '@/assets/sounds/game/Play2Title.wav';

export type SfxType =
    // Desktop
    | 'startup'
    | 'click'
    | 'error'
    | 'hover'
    | 'success'
    | 'recycle'
    // Game
    | 'game_cancel'
    | 'game_click'
    | 'game_confirm'
    | 'game_menu_in'
    | 'game_menu_out'
    | 'game_pause'
    | 'game_step'
    | 'game_cat'
    | 'game_ps2_startup'
    | 'game_ps2_title';

export type MusicType =
    | 'game_bgm_cozy';

// Volume configuration (0.0 to 1.0)
const SFX_VOLUMES: Record<SfxType, number> = {
    // Desktop
    startup: 0.8,
    click: 0.6,
    error: 0.7,
    hover: 0.35, // still subtle, but audible
    success: 0.75,
    recycle: 0.7,

    // Game
    game_cancel: 0.8,
    game_click: 0.85,
    game_confirm: 0.9,
    game_menu_in: 0.75,
    game_menu_out: 0.75,
    game_pause: 0.8,
    game_step: 0.25,
    game_cat: 0.95,
    game_ps2_startup: 0.8,
    game_ps2_title: 0.8,
};

interface SoundContextType {
    playSfx: (type: SfxType) => void;
    playMusic: (type: MusicType) => void;
    stopMusic: () => void;
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    setVolume: (vol: number) => void;
    audioUnlocked: boolean;
    // Legacy support (deprecated)
    playSound: (type: SfxType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    // Refs for active audio elements
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const pendingMusicRef = useRef<MusicType | null>(null);

    // 1. Unlock Audio Listener
    useEffect(() => {
        const unlock = () => {
            setAudioUnlocked(true);

            // If there's pending music and we aren't muted, play it now
            if (pendingMusicRef.current) {
                const musicType = pendingMusicRef.current;
                pendingMusicRef.current = null;
                playMusic(musicType, true); // true = force/bypass lock check
            }

            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);

        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, []);

    const setVolume = (vol: number) => {
        const newVol = Math.max(0, Math.min(1, vol));
        setVolumeState(newVol);
        if (newVol === 0) setIsMuted(true);
        else if (isMuted && newVol > 0) setIsMuted(false);

        // Update active music volume immediately
        if (musicRef.current) {
            musicRef.current.volume = newVol;
        }
    };

    const sfxMap = React.useMemo<Record<SfxType, string>>(() => ({
        // Desktop
        startup: soundStartup,
        click: soundDing,
        error: soundChord,
        hover: soundChimes,
        success: soundTada,
        recycle: soundChimes, // Using chimes for now

        // Game
        game_cancel: gameSfxCancel,
        game_click: gameSfxClick,
        game_confirm: gameSfxConfirm,
        game_menu_in: gameSfxMenuIn,
        game_menu_out: gameSfxMenuOut,
        game_pause: gameSfxPause,
        game_step: gameSfxSteps,
        game_cat: gameSfxCat,
        game_ps2_startup: gameSfxPs2Startup,
        game_ps2_title: gameSfxPs2Title,
    }), []);

    const musicMap = React.useMemo<Record<MusicType, string>>(() => ({
        game_bgm_cozy: gameBgmCozy,
    }), []);

    const playSfx = useCallback((type: SfxType) => {
        if (isMuted) return;
        if (type === 'hover') return; // Debounce/limit hover sounds if needed

        try {
            const src = sfxMap[type];
            if (src) {
                const audio = new Audio(src);
                // Apply specific volume adjustment
                const sfxVolume = SFX_VOLUMES[type] ?? 1.0;
                audio.volume = volume * sfxVolume;

                audio.play().catch(e => console.warn("SFX play failed", e));
            }
        } catch (e) {
            console.warn("Audio error", e);
        }
    }, [isMuted, volume, sfxMap]);

    const playMusic = useCallback((type: MusicType, forceUnlock = false) => {
        if (isMuted) {
            pendingMusicRef.current = type;
            return;
        }

        // If audio is locked and we aren't forcing, just queue it
        if (!audioUnlocked && !forceUnlock) {
            pendingMusicRef.current = type;
            return;
        }

        // Stop current music if any
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current = null;
        }

        try {
            const src = musicMap[type];
            if (src) {
                const audio = new Audio(src);
                audio.volume = volume;
                audio.loop = true; // Music loops by default
                musicRef.current = audio;

                audio.play().catch(e => console.warn("Music play failed", e));
            }
        } catch (e) {
            console.warn("Music error", e);
        }
    }, [isMuted, volume, musicMap, audioUnlocked]);

    const stopMusic = useCallback(() => {
        pendingMusicRef.current = null;
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current = null;
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newState = !prev;
            if (newState && musicRef.current) {
                musicRef.current.pause();
            } else if (!newState && musicRef.current) {
                musicRef.current.play().catch(console.warn);
            }
            return newState;
        });
    }, []);

    // Update volume of playing music when volume/mute state changes
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = isMuted ? 0 : volume;
        }
    }, [isMuted, volume]);

    return (
        <SoundContext.Provider value={{
            playSfx,
            playMusic,
            stopMusic,
            playSound: playSfx, // Legacy alias
            isMuted,
            toggleMute,
            volume,
            setVolume,
            audioUnlocked
        }}>
            {children}
        </SoundContext.Provider>
    );
};
