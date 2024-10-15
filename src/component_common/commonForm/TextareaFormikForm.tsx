import React from "react";
import { useField } from "formik";

const TextareaFormikForm = ({
  label,
  placeholder = "Nhập dữ liệu...",
  important = false,
  disabled = false,
  onChange,
  row = 5,
  name,
  ...props
}: {
  label?: string;
  important?: boolean;
  disabled?: boolean;
  name: string;
  placeholder: string;
  row: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const [field, meta, helpers] = useField(name);
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label htmlFor="">
        <span className="text-gray-700 font-medium text-sm">{label} </span>{" "}
        {important && <span className="text-red-500">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        rows={row}
        {...field}
        autoComplete="off"
        onChange={(e) => {
          helpers.setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        disabled={disabled}
        className={`${
          meta.error && meta.touched ? "border-red-500" : "border-gray-200"
        } px-3 py-3 text-sm disabled:bg-slate-50 border outline-none rounded-sm w-full`}
      ></textarea>
      {meta.error && meta.touched && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
};

export default TextareaFormikForm;
