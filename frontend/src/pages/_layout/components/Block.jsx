import { classNames } from '../../../utils';

export const Block = ({ className, contentClassName, title, children }) => {
  return (
    <div className={classNames('block-container', className)}>
      <div className="rounded-sm bg-primary-600 p-1 text-center text-heading-h2 text-primary-100">
        {title}
      </div>
      <div className={classNames('block-content', contentClassName)}>
        {children}
      </div>
    </div>
  );
};
