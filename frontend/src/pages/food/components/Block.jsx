import { classNames } from '../../../utils';

export const Block = ({ className, title, children }) => {
  return (
    <div
      className={classNames(
        'flex flex-col overflow-hidden rounded-md border-2 border-primary-600 p-[2px]',
        className
      )}
    >
      <div className="rounded-sm bg-primary-600 p-1 text-center text-heading-h2 text-primary-100">
        {title}
      </div>
      <div className="h-full overflow-auto p-2">{children}</div>
    </div>
  );
};
