import React, {useRef, useState} from 'react';
import {Button, TextInput} from '@gravity-ui/uikit';
import {Copy} from '@gravity-ui/icons';

interface CopyInputProps {
    label?: string;
    value: string | null;
    size?: 's' | 'm' | 'l' | 'xl';
}

export const CopyInput: React.FC<CopyInputProps> = ({label, value, size}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <TextInput
            label={label}
            size={size ?? 's'}
            controlRef={inputRef}
            value={value ?? ''}
            readOnly
            endContent={
                <Button view="flat" size="s" onClick={handleCopyClick} title="Копировать DSN">
                    <Button.Icon>
                        <Copy />
                    </Button.Icon>
                    {isCopied ? 'Скопировано!' : ''}
                </Button>
            }
        />
    );
};
