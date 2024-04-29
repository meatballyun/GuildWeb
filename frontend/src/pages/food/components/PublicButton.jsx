import { Button, MaterialSymbol } from '../../../components';

export const PublishedContent = ({ published }) => {
  if (published)
    return (
      <>
        <MaterialSymbol icon="public" fill />
        Published
      </>
    );
  return (
    <>
      <MaterialSymbol icon="lock" fill />
      Private
    </>
  );
};

export const PublicButton = ({ value, onChange, disabled }) => {
  if (disabled)
    return (
      <div className="flex h-full items-center gap-1 text-paragraph-p2 text-primary-500">
        <PublishedContent published={!!value} />
      </div>
    );
  return (
    <Button
      onClick={() => onChange(!value)}
      type="hollow"
      size="md"
      className="flex items-center gap-1"
    >
      <PublishedContent published={!!value} />
    </Button>
  );
};
