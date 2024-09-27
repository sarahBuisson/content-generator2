import { useState } from 'react';

interface NumberInputSliderProperties {
    name: string;
    defaultValue: number
    min?: number;
    max: number;
    onChangeValue: (name: string, value: number) => void;
}

export default function NumberInputSlider({
                                              name,
                                              defaultValue,
                                              min,
                                              max,
                                              onChangeValue
                                          }: NumberInputSliderProperties): JSX.Element {
    const [value, setValue] = useState<number>(defaultValue);

    const onHandleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const nValue = Math.max(min ?? 0, Math.min(max, Number(event.target.value)));
        setValue(nValue);
        onChangeValue(name, nValue);

    };

    const onHandleSliderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(Number(event.target.value));
    };

    return (
        <div>{name} :
            <input
                type="number"
                min="1"
                max={max}
                value={value}
                onChange={onHandleInputChange}
                style={{marginBottom: '10px', width: '100%'}}
            />
            <input
                type="range"
                min="1"
                max={max}
                value={value}
                onChange={onHandleSliderChange}
                style={{width: '100%'}}
            />
        </div>
    );
};

// eslint-disable-next-line react/default-props-match-prop-types
NumberInputSlider.defaultProps = {min: 0};

