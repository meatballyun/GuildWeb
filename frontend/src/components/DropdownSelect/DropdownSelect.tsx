import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import { Input } from '../Form';
import { MaterialSymbol } from '../MaterialSymbol';
import { classNames } from '../../utils';
import { createPortal } from 'react-dom';

type ValueType = string | number;

interface Option {
  value: ValueType;
  label: React.ReactNode;
  custom?: any;
}

const extractTextFromChildren = (label: React.ReactNode) => {
  let text = '';
  if (typeof label === 'string' || typeof label === 'number') {
    text += label;
  } else if (
    label &&
    typeof label === 'object' &&
    'props' in label &&
    label?.props?.children
  ) {
    text += extractTextFromChildren(label.props.children);
  }
  return text;
};

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  menuItem: Option[];
  selectValue?: ValueType[];
  onItemClick: (value: ValueType, option: Option) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
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
              {selected ? (
                <MaterialSymbol
                  icon="done"
                  size={16}
                  weight={700}
                  className="float-end text-primary-400"
                />
              ) : (
                <div className="pr-4" />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export interface DropdownSelectProps {
  options: Option[];
  placeholder?: string;
  renderValue?: (
    currentValue: ValueType[] | undefined,
    selectOptions: Option[]
  ) => React.ReactNode;
  value?: ValueType | ValueType[];
  mode?: 'multiple';
  disabled?: boolean;
  className?: string;
  onChange?: (value: ValueType[], newValue?: ValueType) => void;
  customTrigger?: ({
    isOpen,
    setIsOpen,
    selectValue,
    currentValue,
  }: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectValue: ValueType | ValueType[] | React.ReactNode;
    currentValue?: ValueType | ValueType[];
  }) => React.ReactNode;
}

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
}: DropdownSelectProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);

  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(valueProp);
  const currentValue: ValueType[] | undefined = (() => {
    const data = valueProp ?? selectedOption;
    if (data === undefined || Array.isArray(data)) return data;
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

  const getNextValue = (newValue: ValueType) =>
    currentValue?.includes(newValue)
      ? currentValue?.filter((value) => value !== newValue)
      : [...(currentValue ?? []), newValue];

  const handleOptionClick = (newValue: ValueType) => {
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
    const clickHandler = (e: MouseEvent) => {
      if (
        inputRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
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
    if (!inputRef.current) return;
    const resetPos = () => {
      if (!inputRef.current) return;
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
            value={isOpen ? searchValue : (selectValue as string)}
            placeholder={(selectValue as string) ?? placeholder}
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
