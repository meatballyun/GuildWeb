import { useState } from 'react';
import { MissionPill } from '../components';
import { Button, Dropdown, MaterialSymbol } from '../../../components';
import { MissionType } from '../../../api/guild/interface';

interface MissionTypeSelectProps {
  value: MissionType | '';
  onChange: (value: MissionType | '') => void;
}

export const MissionTypeSelect = ({
  value: valueProp,
  onChange,
}: MissionTypeSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-nowrap">
      {valueProp ? (
        <MissionPill
          type={valueProp}
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
            onChange(v as MissionType | '');
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
