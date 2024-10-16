import { FieldHookConfig, useField } from "formik";
import React, { useEffect, useState } from "react";

const NumberFormikForm = ({
  label,
  important = false,
  disabled = false,
  unit = "",
  name,
  placeholder,
  ...props
}: {
  label: string;
  important: boolean;
  name: string;
  disabled: boolean;
  placeholder?: string;
  unit?: string;
}) => {
  const [field, meta, helpers] = useField(name);
  const [value, setValue] = useState("");

  useEffect(() => {
    const inputValueConvert = parseInt(
      field.value.toString().replace(/,/g, "")
    );
    const formattedValue = inputValueConvert
      ? inputValueConvert.toLocaleString()
      : "";
    setValue(formattedValue);
  }, [field.value]);

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label htmlFor="">
        <span className="text-gray-700 font-medium text-sm">{label} </span>{" "}
        {important && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`${
          meta.error && meta.touched ? "border-red-500" : "border-gray-200"
        } px-3 ${
          disabled && "bg-slate-100"
        } py-2 flex items-center text-sm  border outline-none rounded-sm w-full`}
      >
        <input
          {...field}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          onBlur={() => {
            if (field.value == 0) {
              setValue("0");
            }
          }}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue == "") {
              helpers.setValue(0);
              return;
            }
            if (inputValue.match(/^\d*(,?\d*)*\d$/)) {
              const inputValueConvert = parseInt(inputValue.replace(/,/g, ""));
              helpers.setValue(inputValueConvert);
            }
          }}
          value={value}
          className="outline-none flex-auto bg-transparentF"
        />
        <div className="flex gap-x-1 items-center">
          {unit != "" && <span className="text-gray-400">{unit}</span>}
          <i className="ri-expand-up-down-line"></i>
        </div>
      </div>
      <input
        {...props}
        {...field}
        hidden
        autoComplete="off"
        // onChange={(e) => {
        //   helpers.setValue(e.target.value);
        // }}
        disabled={disabled}
      />
      {meta.error && meta.touched && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
};

export default NumberFormikForm;
