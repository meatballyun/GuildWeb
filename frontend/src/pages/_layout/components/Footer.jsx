import { Fragment } from 'react';

export const Footer = () => {
  return (
    <div
      style={{
        textShadow:
          'rgb(116 97 97 / 28%) 0.5px 0.5px 0, rgb(0 0 0 / 30%) -0.5px -1px 1px',
        color: 'rgb(19 9 7)',
      }}
      className="absolute bottom-1 left-0 flex w-full items-center justify-center text-center text-paragraph-p3"
    >
      {[
        `ver.${process.env.REACT_APP_VERSION}`,
        `Copyright © ${new Date().getFullYear()} Yun-T.Z. All rights`,
        <a href={process.env.REACT_APP_MAIL_USER} className="underline">
          CONTACT US
        </a>,
      ].map((content, i) => {
        return (
          <Fragment key={i}>
            {!!i && <span className="mx-2">|</span>}
            {content}
          </Fragment>
        );
      })}
    </div>
  );
};
