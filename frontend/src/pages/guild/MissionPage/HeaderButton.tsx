import { Link } from 'react-router-dom';
import {
  Button,
  CheckBox,
  DropdownSelect,
  DropdownSelectProps,
  MaterialSymbol,
} from '../../../components';
import { classNames } from '../../../utils';
import { FILTER_LIST, MISSION_STATUS_LIST } from './constants';
import { MissionStatus, MissionType } from '../../../api/guild/interface';
import { MissionPageMode, Query } from './interface';

interface UnderlineButtonProps {
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const UnderlineButton = ({
  selected,
  onClick,
  children,
}: UnderlineButtonProps) => {
  return (
    <Button
      onClick={onClick}
      type="hollow"
      className={
        selected
          ? '!rounded-none !border-l-0 !border-r-0 !border-t-0 shadow-none'
          : '!border-none shadow-none'
      }
    >
      {children}
    </Button>
  );
};

interface HeaderButtonProps {
  value: Query['filter'];
  onChange: (value: Query['filter']) => void;
}

export const HeaderButton = ({
  value = 'all',
  onChange,
}: HeaderButtonProps) => {
  return (
    <div className="small-scrollbar flex flex-1 items-center gap-2 overflow-auto">
      {FILTER_LIST.map(({ name, text }) => (
        <UnderlineButton
          key={name}
          selected={name === value}
          onClick={() => onChange?.(name as Query['filter'])}
        >
          {text}
        </UnderlineButton>
      ))}
    </div>
  );
};

interface LabelProps {
  children?: React.ReactNode;
  className?: string;
}

const Label = ({ children, className }: LabelProps) => (
  <span className={classNames('rounded-sm px-2 text-white', className)}>
    {children}
  </span>
);

const getOption = (className: string, label: string, value: string) => ({
  label: <Label className={className}>{label}</Label>,
  value,
});

const MISSION_TYPE = [
  { label: 'All', value: 'all' },
  getOption('bg-primary-200', 'Ordinary', 'Ordinary'),
  getOption('bg-red', 'Emergency', 'Emergency'),
  getOption('bg-green', 'Daily', 'Daily'),
  getOption('bg-blue', 'Weekly', 'Weekly'),
  getOption('bg-orange', 'Monthly', 'Monthly'),
];

const MISSION_STATUS = [
  { label: 'All', value: 'all' },
  ...MISSION_STATUS_LIST.map(({ background, text }) =>
    getOption(background, text, text)
  ),
];

interface SelectorProps extends DropdownSelectProps {
  textPrefix: React.ReactNode;
}

const Selector = ({ onChange, value, options, textPrefix }: SelectorProps) => {
  return (
    <DropdownSelect
      mode="multiple"
      className="border-b-0 pb-0"
      value={value}
      onChange={(valueList, value) => {
        if (value === 'all' && valueList.length < options.length)
          return onChange?.(options.slice(1).map(({ value }) => value));
        if (value === 'all') return onChange?.([]);
        onChange?.(valueList);
      }}
      customTrigger={({
        selectValue,
        currentValue: currentValueParam,
        setIsOpen,
      }) => {
        const currentValue = currentValueParam as string[];
        return (
          <Button
            className="!border-none !shadow-none"
            type="hollow"
            onClick={() => setIsOpen((d) => !d)}
          >
            <>
              <span className="underline">{textPrefix}</span>
              {(() => {
                if (
                  !currentValue?.length ||
                  currentValue.length === options.length - 1
                )
                  return ': All';
                if (currentValue.length === 1)
                  return (
                    <>
                      : <span className="text-sm">{selectValue}</span>
                    </>
                  );
                return ` (${currentValue.length})`;
              })()}
            </>
            <MaterialSymbol icon="arrow_drop_down" size={18} />
          </Button>
        );
      }}
      renderValue={(_, selectValueOption) => (
        <>
          {selectValueOption?.slice(0, 1).map(({ label }) => label)}
          {selectValueOption?.length > 1 && (
            <div className="rounded-sm bg-primary-300/30 px-2">
              +{selectValueOption.length - 1}...
            </div>
          )}
        </>
      )}
      options={options}
    />
  );
};

interface ManageModeHeaderButtonProps {
  query: Query;
  mode?: MissionPageMode;
  onChange: (value: Query) => void;
  baseUrl: string;
}

export const ManageModeHeaderButton = ({
  query = {},
  mode,
  onChange,
  baseUrl,
}: ManageModeHeaderButtonProps) => {
  return (
    <>
      <div className="no-scrollbar flex items-center overflow-auto">
        <div
          className="mr-2 flex cursor-pointer items-center gap-1 text-paragraph-p3 text-primary-500"
          onClick={() =>
            onChange?.({
              filter: query.filter === 'mine' ? 'all' : 'mine',
            })
          }
        >
          <CheckBox className="mt-1" value={query.filter === 'mine'} />
          Show Only Created By Me
        </div>
        <Selector
          value={query.missionType}
          onChange={(missionType) =>
            onChange({ missionType: missionType as MissionType[] })
          }
          textPrefix="Mission Type"
          options={MISSION_TYPE}
          placeholder="Filter with MissionType"
        />
        <Selector
          value={query.missionStatus}
          onChange={(missionStatus) =>
            onChange({ missionStatus: missionStatus as MissionStatus[] })
          }
          textPrefix="Mission Status"
          options={MISSION_STATUS}
          placeholder="Filter with MissionStatus"
        />
        {mode === MissionPageMode.TEMPLATE ? (
          <Link to={`${baseUrl}/manage`}>
            <Button className="ml-1">Mission List</Button>
          </Link>
        ) : (
          <Link to={`${baseUrl}/template`}>
            <Button className="ml-1">Template</Button>
          </Link>
        )}
      </div>
    </>
  );
};
