import { renderHook } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';
import { describe, it, expect } from 'vitest';

describe('useFocusTrap', () => {
    it('should return containerRef and handleKeyDown', () => {
        const { result } = renderHook(() => useFocusTrap(true));

        expect(result.current.containerRef).toBeDefined();
        expect(result.current.handleKeyDown).toBeDefined();
    });
});
