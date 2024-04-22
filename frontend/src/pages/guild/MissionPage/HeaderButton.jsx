import { Button, CheckBox } from '../../../components';

export const HeaderButton = ({ value = 'all', onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onChange?.('all')}
        type={value === 'all' || value === 'canAccepted' ? 'solid' : 'hollow'}
      >
        Mission List
      </Button>
      {(value === 'all' || value === 'canAccepted') && (
        <div
          className="flex items-center gap-1 text-paragraph-p3 text-primary-500"
          onClick={() => onChange(value === 'all' ? 'canAccepted' : 'all')}
        >
          <CheckBox value={value === 'canAccepted'} />
          only show can accepted mission
        </div>
      )}
      <Button
        onClick={() => onChange?.('inProcess')}
        type={value === 'inProcess' ? 'solid' : 'hollow'}
      >
        In Process
      </Button>
      <Button
        onClick={() => onChange?.('completed')}
        type={value === 'completed' ? 'solid' : 'hollow'}
      >
        Completed
      </Button>
      <Button
        onClick={() => onChange?.('expired')}
        type={value === 'expired' ? 'solid' : 'hollow'}
      >
        Expired
      </Button>
    </div>
  );
};
