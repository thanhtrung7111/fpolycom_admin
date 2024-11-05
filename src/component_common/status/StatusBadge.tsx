import React, { ReactNode } from "react";

const StatusBadge = ({
  item,
  success,
  warning,
  error,
  pending,
  children,
}: {
  item: string;
  success?: string;
  warning?: string;
  error?: string;
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
  }

  return (
    <div
      className={`${className} px-3 py-2 w-fit text-white rounded-sm text-xs`}
    >
      {children}
    </div>
  );
};

export default StatusBadge;
