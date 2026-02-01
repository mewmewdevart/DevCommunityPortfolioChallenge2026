import { useState } from 'react';
import { useTranslation } from '@context/LanguageContext';
import './Notepad.css';

export const Notepad = () => {
  const { t } = useTranslation();
  const [text, setText] = useState(
    t('notepad_default_text')
  );

  return (
    <div className="notepad-root">
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        maxLength={10000}
      />
    </div>
  );
};
