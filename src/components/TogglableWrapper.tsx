import React, { useState } from 'react';

interface TogglableWrapperProperties {
    children: React.ReactNode;
    title: string;
    initialState: boolean;
}

export default function TogglableWrapper({title, children, initialState}: TogglableWrapperProperties): JSX.Element {
    const [isOpen, setIsOpen] = useState(initialState);

    const onToggleVisibility = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={onToggleVisibility}>
                {title} {isOpen ? 'Hide' : 'Show'}
            </button>
            {isOpen && <div>{children}</div>}
        </div>
    );
};

TogglableWrapper.defaultProps = { initialState: false };
