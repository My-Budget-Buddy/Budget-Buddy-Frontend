import { Button, Icon } from '@trussworks/react-uswds';
import React, { useEffect, useState } from 'react';

interface ReservedMoniesInputProps {
    amount: number,
    disabled: boolean,
    onChange: (amount_reserved: number) => void;
  }

const ReservedMoniesInput: React.FC<ReservedMoniesInputProps> = ({amount, onChange, disabled}) => {
  const [value, setValue] = useState(amount);

  //TODO Something looks wrong about this
  useEffect(()=> {
    onChange(value);
  }, [value]);

  const handleIncrement = () => {
    setValue(prevValue => prevValue + 1);
  };

  const handleDecrement = () => {
    setValue(prevValue => prevValue - 1);
  };

  return (
    <div className='flex items-center justify-center max-w-8'>
        <input disabled={disabled}
            type="number"
            value={value}
            onChange={e => setValue(parseInt(e.target.value))}
            style={{ marginRight: '10px',  maxWidth: '60px', border: '1px solid #ccc'}}
        />
        <div>
            <Button disabled={disabled} onClick={handleIncrement} type={'button'} className='' unstyled><Icon.Add /></Button>
            <Button disabled={disabled} onClick={handleDecrement} type={'button'} unstyled><Icon.Remove /></Button>
        </div>
    </div>

  );
};

export default ReservedMoniesInput;
