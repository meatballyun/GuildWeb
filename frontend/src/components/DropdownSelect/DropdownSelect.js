import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import { Input } from '../Form';
import { MaterialSymbol } from '../MaterialSymbol';
import { classNames } from '../../utils';
import { createPortal } from 'react-dom';

const extractTextFromChildren = (label) => {
  let text = '';
  if (typeof label === 'string' || typeof label === 'number') {
    text += label;
  } else if (label?.props?.children) {
    text += extractTextFromChildren(label.props.children);
  }
  return text;
};

export const Dropdown = forwardRef(
  ({ menuItem, selectValue, onItemClick, ...props }, ref) => {
    return (
      <div className="dropdown-select__options" ref={ref} {...props}>
        {menuItem.map((item) => {
          const selected = selectValue?.includes(item.value);
          return (
            <div
              key={`${item.value}`}
              className={classNames(
                'dropdown-select__option',
                selected && 'selected'
              )}
              onClick={() => onItemClick?.(item.value, item)}
            >
              {item.label}
              {selected && (
                <MaterialSymbol
                  icon="done"
                  size={16}
                  weight={800}
                  className="float-end text-primary-400"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export const DropdownSelect = ({
  options = [],
  placeholder,
  renderValue,
  value: valueProp,
  mode,
  disabled,
  className,
  onChange: onChangeProp,
  customTrigger,
}) => {
  const inputRef = useRef();
  const dropdownRef = useRef();
  const [inputRect, setInputRect] = useState();

  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(valueProp);
  const currentValue = (() => {
    const data = valueProp ?? selectedOption;
    if (!data || Array.isArray(data)) return data;
    return [data];
  })();
  const onChange = onChangeProp ?? setSelectedOption;

  useEffect(() => {
    setSelectedOption(valueProp);
  }, [valueProp]);

  const selectValue = useMemo(() => {
    const selectOptions = options.filter(({ value }) =>
      currentValue?.includes(value)
    );
    if (renderValue) return renderValue(currentValue, selectOptions ?? {});
    return selectOptions?.map(({ label }) => label).join(' ') ?? currentValue;
  }, [currentValue, options, renderValue]);

  const getNextValue = (newValue) =>
    currentValue?.includes(newValue)
      ? currentValue?.filter((value) => value !== newValue)
      : [...(currentValue ?? []), newValue];

  const handleOptionClick = (newValue) => {
    if (mode === 'multiple') {
      onChange(getNextValue(newValue), newValue);
      return;
    }
    onChange([newValue], newValue);
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
      if (
        inputRef.current.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      )
        return;
      setIsOpen(false);
    };
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, []);

  useEffect(() => {
    const resetPos = () => {
      const rect = inputRef.current.getBoundingClientRect();
      setInputRect(rect);
    };
    resetPos();

    const observer = new ResizeObserver(resetPos);
    observer.observe(inputRef.current);
    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  return (
    <div className={classNames('dropdown-select', className)} ref={inputRef}>
      {customTrigger?.({ isOpen, setIsOpen, selectValue, currentValue }) ?? (
        <div
          className="dropdown-select__selected  flex p-0 text-paragraph-p3"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Input
            noFill
            disabled={disabled}
            value={isOpen ? searchValue : selectValue}
            placeholder={selectValue ?? placeholder}
            onChange={setSearchValue}
            className="w-full"
          />
          <MaterialSymbol icon="arrow_drop_down" size={24} />
        </div>
      )}
      {isOpen &&
        inputRect &&
        createPortal(
          <Dropdown
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: inputRect.top + inputRect.height,
              left: inputRect.left,
              minWidth: inputRect.width,
            }}
            menuItem={filterOptions}
            selectValue={currentValue}
            onItemClick={handleOptionClick}
          />,
          document.body
        )}
    </div>
  );
};
