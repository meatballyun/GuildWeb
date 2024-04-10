import { Button, MaterialSymbol } from '../../../components';

export const PublicButton = ({ value, onChange }) => {
  if (value)
    return (
      <Button
        onClick={() => onChange(false)}
        type="hollow"
        size="md"
        className="flex items-center gap-1"
      >
        <MaterialSymbol icon="public" fill />
        Public
      </Button>
    );
  return (
    <Button
      onClick={() => onChange(true)}
      type="hollow"
      size="md"
      className="flex items-center gap-1"
    >
      <MaterialSymbol icon="lock" fill />
      Private
    </Button>
  );
};
