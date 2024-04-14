import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import { Input } from '../Form';
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
  disabled,
  onChange: onChangeProp,
}) => {
  const inputRef = useRef();
  const dropdownRef = useRef();

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

  useEffect(() => {
    const clickHandler = (e) => {
      if (!e.target.contains(inputRef.current)) return;
      setIsOpen(false);
    };
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  });

  return (
    <div className="dropdown-select" ref={inputRef}>
      <div
        className="dropdown-select__selected flex text-paragraph-p3"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Input
          noFill
          disabled={disabled}
          value={isOpen ? searchValue : selectValue}
          placeholder={placeholder}
          onChange={setSearchValue}
          className="w-full"
        />
        <MaterialSymbol icon="arrow_drop_down" size={24} />
      </div>
      {isOpen && (
        <div className="dropdown-select__options" ref={dropdownRef}>
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
