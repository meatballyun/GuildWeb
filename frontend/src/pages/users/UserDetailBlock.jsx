import { Button, ImageUploader, MaterialSymbol } from '../../components';
import { Block } from '../_layout/components';
import { classNames } from '../../utils';
import { COLORS } from '../../styles';
import { useMemo } from 'react';

export const UserDetailBlock = ({ className, detail, onButtonClick }) => {
  const { imageUrl, name, rank, status, id } = detail;

  const { message, button } = useMemo(() => {
    switch (status) {
      case 'Confirmed':
        return {
          button: [
            {
              style: { background: COLORS.red },
              onClick: () => onButtonClick('remove'),
              prefix: <MaterialSymbol icon="person_remove" className="mr-1" />,
              children: 'Remove Friend',
            },
          ],
        };
      case 'Pending Response':
        return {
          message: 'You have sent they a friend invitation',
          button: [
            {
              type: 'hollow',
              onClick: () => onButtonClick('revoke'),
              prefix: <MaterialSymbol icon="cancel" className="mr-1" />,
              children: 'Revoke',
            },
          ],
        };
      case 'Pending Confirmation':
        return {
          message: 'Send you a friend invitation',
          button: [
            {
              type: 'hollow',
              onClick: () => onButtonClick('reject'),
              prefix: <MaterialSymbol icon="close" className="mr-1" />,
              children: 'Reject',
            },
            {
              onClick: () => onButtonClick('confirmed'),
              prefix: <MaterialSymbol icon="done" className="mr-1" />,
              children: 'Confirmed',
            },
          ],
        };
      default:
        return {
          button: [
            {
              onClick: () => onButtonClick('add'),
              prefix: <MaterialSymbol icon="person_add" className="mr-1" />,
              children: 'Add Friend',
            },
          ],
        };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  return (
    <Block className={classNames(className, 'h-max')} title="User Detail">
      <div className="flex w-full flex-col items-center">
        {message && (
          <div className="mb-4 rounded-sm bg-warning px-4 py-1">{message}</div>
        )}
        <div className="h-[240px] w-[240px] border-[20px] border-primary-200">
          <ImageUploader value={imageUrl} disabled type="user" />
        </div>
        <div className="w-full whitespace-pre-wrap break-all text-center">
          <span className="mr-2 text-heading-h1">{name}</span>
          <span className="my-2 text-heading-h3">Lv. {rank}</span>
        </div>

        <div className="flex gap-2">
          {button.map((props, i) => (
            <Button key={i} {...props} />
          ))}
        </div>
      </div>
    </Block>
  );
};
