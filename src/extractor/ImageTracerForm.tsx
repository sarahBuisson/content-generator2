import { useState } from 'react';
import NumberInputSlider from './NumberInputSlider';

interface ImageTracerOptions {
    numberofcolors: number;
    mincolorratio: number;
    colorquantcycles: number;
    scale: number;
    simplifytolerance: number;
    roundcoords: number;
    lcpr: number;
    qcpr: number;
    desc: boolean;
    linefilter: boolean;
    pathomit: number;
}

const defaultOptions: ImageTracerOptions = {

    numberofcolors: 16,
    mincolorratio: 0.02,
    colorquantcycles: 3,
    scale: 1,
    simplifytolerance: 0,
    roundcoords: 10,
    lcpr: 0,
    qcpr: 0,
    desc: false,
    linefilter: false,
    pathomit: 8,
};

interface ImageTracerFormProperties {
    changeOption: (i: ImageTracerOptions) => void
}

ImageTracerForm.defaultProps = {
    changeOption: (i: ImageTracerOptions) => {
    },
};

export default function ImageTracerForm({changeOption}: ImageTracerFormProperties): JSX.Element {
    const [options, setOptions] = useState<ImageTracerOptions>(defaultOptions);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type, checked} = event.target;
        const nValue = {
            ...options,
            [name]: type === 'checkbox' ? checked : Number(value),
        };
        setOptions(nValue);
        changeOption(nValue)
    };

    const onHandleValueChange = (name: string, value: number): void => {

        const nValue = {
            ...options,
            [name]: Number(value),
        };
        setOptions(nValue);
        changeOption(nValue);
    };

    return (
        <div>
            <form>
                <NumberInputSlider
                    name="numberofcolors"
                    defaultValue={options.numberofcolors}
                    max={100}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="mincolorratio"
                    defaultValue={options.mincolorratio}
                    max={1}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="colorquantcycles"
                    defaultValue={options.colorquantcycles}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="scale"
                    defaultValue={options.scale}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="simplifytolerance"
                    defaultValue={options.simplifytolerance}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="roundcoords"
                    defaultValue={options.roundcoords}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="lcpr"
                    value={options.lcpr}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <NumberInputSlider
                    name="qcpr"
                    value={options.qcpr}
                    max={10}
                    onChangeValue={onHandleValueChange}
                />
                <label>
                    Desc:
                    <input
                        type="checkbox"
                        name="desc"
                        checked={options.desc}
                        onChange={handleOptionChange}
                    />
                </label>
                <label>
                    Line Filter:
                    <input
                        type="checkbox"
                        name="linefilter"
                        checked={options.linefilter}
                        onChange={handleOptionChange}
                    />
                </label>
                <NumberInputSlider
                    name="pathomit"
                    defaultValue={options.pathomit}
                    max={100}
                    onChangeValue={onHandleValueChange}
                />
            </form>
        </div>
    );
}
