import { classNames } from '../../../utils';

interface LabelProps {
  children: React.ReactNode;
}

const Label = ({ children }: LabelProps) => {
  return (
    <div className="inline-block pl-2 text-heading-h5 text-primary-300">
      <span className="underline">{children}</span>：
    </div>
  );
};

interface ItemProps {
  className?: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

const Item = ({ label, className, children }: ItemProps) => {
  return (
    <div className="flex w-full flex-wrap items-center">
      <Label>{label}</Label>
      <div
        className={classNames(
          'p-2 text-paragraph-p3 text-primary-600',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface BlockProps {
  className?: string;
  contentClassName?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Block = ({
  className,
  contentClassName,
  title,
  children,
}: BlockProps) => {
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

Block.Item = Item;
