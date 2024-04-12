import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { BaseInput } from '../Form';
import { MaterialSymbol } from '../MaterialSymbol';

const extractTextFromChildren = (label) => {
  let text = '';
  if (typeof label === 'string' || typeof label === 'number') {
    text += label;
  } else if (label?.props?.children) {
    text += extractTextFromChildren(label.props.children);
  }
  return text;
};

export const DropdownSelect = ({
  options = [],
  placeholder,
  renderValue,
  value: valueProp,
  onChange: onChangeProp,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(valueProp);
  const currentValue = valueProp ?? selectedOption;
  const onChange = onChangeProp ?? setSelectedOption;
  useEffect(() => {
    setSelectedOption(valueProp);
  }, [valueProp]);

  const selectValue = useMemo(() => {
    const selectOption = options.find(({ value }) => value === currentValue);
    if (renderValue) return renderValue(selectOption ?? {});
    return selectOption?.label;
  }, [currentValue, options, renderValue]);

  const handleOptionClick = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
  };
  useEffect(() => {
    setSearchValue('');
  }, [isOpen]);

  const filterOptions = useMemo(() => {
    return options.filter((option) => {
      const optionText = extractTextFromChildren(option.label);
      return optionText.includes(searchValue);
    });
  }, [options, searchValue]);

  return (
    <div className="dropdown-select">
      <div
        className="dropdown-select__selected flex text-paragraph-p3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BaseInput
          value={isOpen ? searchValue : selectValue}
          placeholder={placeholder}
          onChange={setSearchValue}
          className="w-full"
        />
        <MaterialSymbol icon="arrow_drop_down" size={24} />
      </div>
      {isOpen && (
        <div className="dropdown-select__options">
          {filterOptions.map(({ value, label }) => (
            <div
              key={value}
              className="dropdown-select__option"
              onClick={() => handleOptionClick(value)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
