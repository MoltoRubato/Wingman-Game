"use client";

import { PORTRAITS } from "@/components/svg/portraits";

type Props = {
  to: "Suitor" | "Confidant";
  sub: string;
  onContinue: () => void;
};

export const HandoffSplash = ({ to, sub, onContinue }: Props) => {
  const Portrait = to === "Suitor" ? PORTRAITS.suitor : PORTRAITS.confidant;
  return (
    <div className={`splash splash--handoff splash--${to.toLowerCase()}`}>
      <div className="splash-inner">
        <div className="handoff-icon">
          <Portrait w={200} h={250} />
        </div>
        <div className="splash-handoff-title">Pass the device to the {to}</div>
        <div className="splash-handoff-sub">{sub}</div>
        <button className="btn btn-primary" onClick={onContinue}>
          I am the {to} — Continue →
        </button>
      </div>
    </div>
  );
};
