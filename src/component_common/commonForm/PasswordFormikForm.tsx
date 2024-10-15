import { FieldHookConfig, useField } from "formik";
import React, { useState } from "react";

const PasswordFormikForm = ({
  label,
  important = false,
  disabled = false,
  placeholder,
  name,
  ...props
}: {
  label: string;
  name: string;
  disabled?: boolean;
  important?: boolean;
  placeholder?: string;
}) => {
  const [field, meta, helpers] = useField(name);
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label htmlFor="">
        <span className="text-gray-700 font-medium text-sm">{label} </span>{" "}
        {important && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`${
          meta.error && meta.touched ? "border-red-500" : "border-gray-200"
        } px-3 py-3 text-sm border bg-white outline-none rounded-sm w-full flex`}
      >
        <input
          {...props}
          {...field}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          type={show ? "text" : "password"}
          className="outline-none flex-auto text-sm"
        />

        <div
          className="cursor-pointer w-8 text-end"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <i className="ri-eye-line"></i>
          ) : (
            <i className="ri-eye-close-line"></i>
          )}
        </div>
      </div>
      {meta.error && meta.touched && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
};

export default PasswordFormikForm;
