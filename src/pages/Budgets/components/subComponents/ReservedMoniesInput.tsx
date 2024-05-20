import { Button, Icon } from '@trussworks/react-uswds';
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
    <div className='flex items-center justify-center max-w-8'>
        <input
            type="number"
            value={value}
            onChange={e => setValue(parseInt(e.target.value))}
            style={{ marginRight: '10px',  maxWidth: '60px', border: '1px solid #ccc'}}
        />
        <div>
            <Button onClick={handleIncrement} type={'button'} className='' unstyled><Icon.Add /></Button>
            <Button onClick={handleDecrement} type={'button'} unstyled><Icon.Remove /></Button>
        </div>
    </div>

  );
};

export default ReservedMoniesInput;
