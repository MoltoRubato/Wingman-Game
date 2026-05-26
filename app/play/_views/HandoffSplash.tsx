"use client";

type Props = {
  to: "Suitor" | "Confidant";
  sub: string;
  onContinue: () => void;
};

export const HandoffSplash = ({ to, sub, onContinue }: Props) => (
  <div className={`splash splash--handoff splash--${to.toLowerCase()}`}>
    <div className="splash-inner">
      <div className="splash-handoff-title">Pass the device to the {to}</div>
      <div className="splash-handoff-sub">{sub}</div>
      <button className="btn btn-primary" onClick={onContinue}>
        I am the {to} - Continue
      </button>
    </div>
  </div>
);
