import { Button } from '@trussworks/react-uswds';
import React, { useEffect, useState } from 'react';

interface ReservedMoniesInputProps {
    amount: number,
    onChange: (n: number) => void;
  }

const ReservedMoniesInput: React.FC<ReservedMoniesInputProps> = ({amount, onChange}) => {
  const [value, setValue] = useState(amount);

  //TODO Something looks wrong about this
  useEffect(()=> {
    onChange(value);
  }, [onChange, value])

  const handleIncrement = () => {
    setValue(prevValue => prevValue + 1);
  };

  const handleDecrement = () => {
    setValue(prevValue => prevValue - 1);
  };

  return (
    <div style={{ maxWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
            type="number"
            value={value}
            onChange={e => setValue(parseInt(e.target.value))}
            style={{ marginRight: '10px',  maxWidth: '60px', border: '1px solid #ccc'}}
        />
        <div>
            <Button onClick={handleDecrement} type={'button'}>-</Button>
            <Button onClick={handleIncrement} type={'button'}>+</Button>
        </div>
    </div>

  );
};

export default ReservedMoniesInput;
