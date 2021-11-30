import React, { ReactNode } from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  children: ReactNode;
  className?: string;
}

function NewTabLink(props: Props) {
  return (
    // Don't add rel="noreferrer" to AtCoder links
    // to allow AtCoder get the referral information.
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      href={props.href}
      rel="noopener"
      target="_blank"
      className={props.className}
    >
      {props.children}
    </a>
  );
}

export default NewTabLink;
