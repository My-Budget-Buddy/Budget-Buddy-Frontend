import { Button, Icon } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";

interface ReservedMoniesInputProps {
    max: number;
    amount: number;
    disabled: boolean;
    onChange: (amount_reserved: number) => void;
}

function returnCapped(amount: number, cap: number): number {
    if (amount > cap) {
        return cap;
    } else {
        return amount;
    }
}

const ReservedMoniesInput: React.FC<ReservedMoniesInputProps> = ({ max, amount, onChange, disabled }) => {
    const [value, setValue] = useState(amount);

    //TODO Something looks wrong about this
    useEffect(() => {
        onChange(value);
    }, [value]);

    const handleIncrement = () => {
        setValue((prevValue) => returnCapped(prevValue + 100, max));
    };

    const handleDecrement = () => {
        setValue((prevValue) => returnCapped(prevValue - 100, max));
    };

    return (
        <div className="flex items-center justify-center max-w-8">
            <input
                disabled={disabled}
                type="number"
                value={value}
                onChange={(e) => setValue(returnCapped(parseInt(e.target.value), max))}
                style={{
                    appearance: "textfield",
                    marginRight: "10px",
                    maxWidth: "100px",
                    minWidth: "80px",
                    border: "1px solid #ccc"
                }}
            />
            <div>
                <Button disabled={disabled} onClick={handleIncrement} type={"button"} className="" unstyled>
                    <Icon.Add />
                </Button>
                <Button disabled={disabled} onClick={handleDecrement} type={"button"} unstyled>
                    <Icon.Remove />
                </Button>
            </div>
        </div>
    );
};

export default ReservedMoniesInput;
