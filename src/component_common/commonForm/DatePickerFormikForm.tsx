import { FieldHookConfig, useField } from "formik";
import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
const DatePickerFormikForm = ({
  label,
  important = false,
  disabled = false,
  name,
  ...props
}: {
  label: string;
  important: boolean;
  name: string;
  disabled: boolean;
}) => {
  const [field, meta, helpers] = useField(name);
  const [currentDate, setCurrentDate] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setCurrentDate({
      startDate: field.value,
      endDate: field.value,
    });
  }, []);

  useEffect(() => {
    console.log(field.value);
    setCurrentDate({
      endDate: field.value,
      startDate: field.value,
    });
  }, [field.value]);
  return (
    <div className="flex flex-col gap-y-1 w-full">
      {label && (
        <label htmlFor="">
          <span className="text-gray-700 text-sm font-medium">{label} </span>{" "}
          {important && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* <Datepicker
        {...props}
        {...field}
        selected={field.value}
        onChange={(date) => helpers.setValue(date)}
        className={`${
          meta.error && meta.touched ? "border-red-500" : "border-gray-200"
        } px-3 py-3 text-sm disabled:bg-slate-50 border outline-none rounded-sm w-full`}
      ></Datepicker> */}
      <div
        className={`${
          meta.error && meta.touched ? "border-red-500" : "border-gray-200"
        } text-sm disabled:bg-slate-50 border outline-none rounded-sm w-full`}
      >
        <Datepicker
          useRange={false}
          primaryColor="orange"
          disabled={disabled}
          asSingle={true}
          i18n="vn"
          containerClassName="relative"
          inputClassName={`Datepicker px-3 py-3 w-full outline-none`}
          toggleClassName="absolute bg-slate-400 text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          displayFormat={"DD/MM/YYYY"}
          value={currentDate}
          onChange={(newValue: any) => {
            helpers.setValue(newValue.startDate);
          }}
        ></Datepicker>
        <input type="date" hidden {...field} />
      </div>
      {meta.error && meta.touched && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
};

export default DatePickerFormikForm;
