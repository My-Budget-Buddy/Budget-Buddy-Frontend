import { Button } from '@trussworks/react-uswds';
import React, { useEffect, useState } from 'react';

interface ReservedMoniesInputProps {
    amount: number
  }

const ReservedMoniesInput: React.FC<ReservedMoniesInputProps> = ({amount}) => {
  const [value, setValue] = useState(amount);

  useEffect(()=> {
    //TODO Post request to endpoint to update with final reserved value
    // Consider having some sort of cooldown or doing it on navigating away from page instead. 
  }, [value])

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
