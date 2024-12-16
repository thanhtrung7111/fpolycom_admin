import React, { ReactNode } from "react";

const StatusBadge = ({
  item,
  success,
  warning,
  error,
  pending,
  reject,
  children,
}: {
  item: string;
  success?: string;
  warning?: string;
  error?: string;
  reject?: string;
  pending?: string;
  children: ReactNode;
}) => {
  let className = "bg-green-400";
  switch (item) {
    case success:
      className = "bg-green-500";
      break;
    case warning:
      className = "bg-yellow-500";
      break;
    case error:
      className = "bg-red-500";
      break;
    case reject:
      className = "bg-red-800";
      break;
  }

  return (
    <div
      className={`${className} px-3 py-1 w-fit text-white rounded-sm text-xs`}
    >
      {children}
    </div>
  );
};

export default StatusBadge;
