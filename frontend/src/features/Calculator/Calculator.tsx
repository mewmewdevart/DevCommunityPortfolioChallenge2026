import React, { useState, useEffect, useCallback } from 'react';
import { WinButton } from '@atoms/WinButton/WinButton';
import { useOS } from '@context/OSContext';
import { useTranslation } from '@context/LanguageContext';

import "./Calculator.css"

const Btn = ({
  l,
  onClick,
  red,
  className = '',
  bold = false
}: {
  l: string,
  onClick: () => void,
  red?: boolean,
  className?: string,
  bold?: boolean
}) => (
  <WinButton
    className={`calc-btn ${bold ? 'calc-btn-bold' : ''} ${red ? 'calc-btn-red' : 'calc-btn-blue'} ${className}`}
    onClick={onClick}
    onMouseDown={(e) => e.stopPropagation()}
  >
    {l}
  </WinButton>
);

export const CalculatorApp = () => {
  const { activeWindowId } = useOS();
  const { t } = useTranslation();
  const [display, setDisplay] = useState('0');
  const [firstOp, setFirstOp] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState(true);

  const handleNum = useCallback((n: string) => {
    setDisplay(prev => {
      if (newEntry) return n;
      return prev === '0' ? n : prev + n;
    });
    setNewEntry(false);
  }, [newEntry]);

  const handleOp = useCallback((operation: string) => {
    setFirstOp(display);
    setOp(operation);
    setNewEntry(true);
  }, [display]);

  const calculate = useCallback(() => {
    if (firstOp && op) {
      const a = parseFloat(firstOp);
      const b = parseFloat(display);
      let res = 0;
      if (op === '+') res = a + b;
      if (op === '-') res = a - b;
      if (op === '*') res = a * b;
      if (op === '/') {
        if (b === 0) {
          setDisplay("Error");
          setFirstOp(null);
          setOp(null);
          setNewEntry(true);
          return;
        }
        res = a / b;
      }

      const resStr = String(Math.round(res * 100000000) / 100000000);

      setDisplay(resStr);
      setFirstOp(null);
      setOp(null);
      setNewEntry(true);
    }
  }, [firstOp, op, display]);

  const clear = useCallback(() => {
    setDisplay('0');
    setFirstOp(null);
    setOp(null);
    setNewEntry(true);
  }, []);

  const backspace = useCallback(() => {
    setDisplay(prev => {
      if (newEntry || prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  }, [newEntry]);

  useEffect(() => {
    if (activeWindowId !== 'calculator') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      e.preventDefault();
      if (/[0-9]/.test(key)) handleNum(key);
      if (key === '.') handleNum('.');
      if (key === '+') handleOp('+');
      if (key === '-') handleOp('-');
      if (key === '*') handleOp('*');
      if (key === '/') handleOp('/');
      if (key === 'Enter' || key === '=') calculate();
      if (key === 'Escape') clear();
      if (key === 'Backspace') backspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, handleNum, handleOp, calculate, clear, backspace]);

  return (
    <div className="calculator-container">
      {/* Display */}
      <div className="calculator-display">
        {display}
      </div>

      <div className="calculator-main">

        <div className="calculator-memory">
          <div className="calculator-memory-spacer" />
          <Btn l="MC" onClick={() => { }} red />
          <Btn l="MR" onClick={() => { }} red />
          <Btn l="MS" onClick={() => { }} red />
          <Btn l="M+" onClick={() => { }} red />
        </div>

        <div className="calculator-grid">

          <Btn l={t('calc_back')} onClick={backspace} red className="calc-btn-span-2" />
          <Btn l="CE" onClick={clear} red />
          <Btn l="C" onClick={clear} red />

          <Btn l="7" onClick={() => handleNum('7')} bold />
          <Btn l="8" onClick={() => handleNum('8')} bold />
          <Btn l="9" onClick={() => handleNum('9')} bold />
          <Btn l="/" onClick={() => handleOp('/')} red bold />

          <Btn l="4" onClick={() => handleNum('4')} bold />
          <Btn l="5" onClick={() => handleNum('5')} bold />
          <Btn l="6" onClick={() => handleNum('6')} bold />
          <Btn l="*" onClick={() => handleOp('*')} red bold />

          <Btn l="1" onClick={() => handleNum('1')} bold />
          <Btn l="2" onClick={() => handleNum('2')} bold />
          <Btn l="3" onClick={() => handleNum('3')} bold />
          <Btn l="-" onClick={() => handleOp('-')} red bold />

          <Btn l="0" onClick={() => handleNum('0')} bold />
          <Btn l="+/-" onClick={() => { }} />
          <Btn l="." onClick={() => handleNum('.')} bold />
          <Btn l="+" onClick={() => handleOp('+')} red bold />

          <Btn l="=" onClick={calculate} red bold className="calc-btn-span-4" />
        </div>

      </div>
    </div>
  );
};