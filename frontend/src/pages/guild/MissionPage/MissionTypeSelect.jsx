import { useState } from 'react';
import { MissionPill } from '../components';
import { Button, Dropdown, MaterialSymbol } from '../../../components';

export const convertMissionTypeValue = (value) => {
  switch (value) {
    case 'daily':
      return {
        type: 'Repetitive',
        repetitiveTaskType: 'Daily',
      };
    case 'weekly':
      return {
        type: 'Repetitive',
        repetitiveTaskType: 'Weekly',
      };
    case 'monthly':
      return {
        type: 'Repetitive',
        repetitiveTaskType: 'Monthly',
      };
    case 'ordinary':
      return {
        type: 'Ordinary',
      };
    case 'emergency':
      return {
        type: 'Emergency',
      };
    default:
      return {};
  }
};

export const MissionTypeSelect = ({ value: valueProp, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-nowrap">
      {valueProp ? (
        <MissionPill
          {...convertMissionTypeValue(valueProp)}
          onClick={() => setOpen((v) => !v)}
          suffix={<MaterialSymbol icon="arrow_drop_down" size={20} />}
        />
      ) : (
        <Button
          size="sm"
          type="hollow"
          className="!rounded-full !py-0 !pr-0"
          onClick={() => setOpen((v) => !v)}
          suffix={<MaterialSymbol icon="arrow_drop_down" size={20} />}
        >
          Mission Type
        </Button>
      )}
      {open && (
        <Dropdown
          onItemClick={(v) => {
            onChange(v);
            setOpen(false);
          }}
          menuItem={[
            { label: 'All', value: '' },
            { label: 'Ordinary', value: 'ordinary' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Emergency', value: 'emergency' },
          ]}
        />
      )}
    </div>
  );
};
