import React, { useState, useEffect } from 'react';
import { Select } from "@trussworks/react-uswds";

interface CategoryPickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    // TODO- fetch user's categories
    // try {
    //   const response = await fetch('your-endpoint-url');
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch options');
    //   }
    //   const data = await response.json();
    //   setOptions(data);
    // } catch (error) {
    //   console.error(error);
    // }

    setOptions(["opt 1", "opt 2", "opt 3"]);
  };


  return (
    <Select id="category-picker" name="category-picker" value={value} onChange={(e) => onChange(e)}>
      <option value="">- Select -</option>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </Select>
  );
};

export default CategoryPicker;
