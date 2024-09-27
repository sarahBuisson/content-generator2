import React, { useState } from 'react';

interface TogglableWrapperProperties {
    children: React.ReactNode;
    title: string;
    initialState: boolean;
}

export default function TogglableWrapper({title, children, initialState}: TogglableWrapperProperties): JSX.Element {
    const [isVisible, setIsVisible] = useState(initialState);

    const onToggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <button onClick={onToggleVisibility}>
                {title} {isVisible ? 'Hide' : 'Show'}
            </button>
            {isVisible && <div>{children}</div>}
        </div>
    );
};

