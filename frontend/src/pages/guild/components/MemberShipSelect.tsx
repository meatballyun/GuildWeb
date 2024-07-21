import { useState } from 'react';
import { MembershipPill } from './MembershipPill';
import { Dropdown, MaterialSymbol } from '../../../components';
import { Membership } from '../../../api/guild/interface';

interface MemberShipSelectProps {
  value: Membership;
  onChange?: (value: Membership) => void;
}

export const MemberShipSelect = ({
  value: valueProp,
  onChange,
}: MemberShipSelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <MembershipPill
        onClick={() => setOpen((v) => !v)}
        membership={valueProp}
        suffix={<MaterialSymbol icon="arrow_drop_down" size={20} />}
      />
      {open && (
        <Dropdown
          onItemClick={(value) => onChange?.(value as Membership)}
          menuItem={
            valueProp === 'pending'
              ? [{ label: 'delete', value: 'delete' }]
              : [
                  { label: 'vice master', value: 'vice' },
                  { label: 'regular', value: 'regular' },
                  {
                    label: <span className="text-red">Delete</span>,
                    value: 'delete',
                  },
                ].filter(({ value }) => value !== valueProp)
          }
        />
      )}
    </div>
  );
};
