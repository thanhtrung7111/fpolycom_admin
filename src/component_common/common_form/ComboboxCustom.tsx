import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommonObject } from "@/type/TypeCommon";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { any } from "zod";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
const ComboboxCustom = ({
  onChange,
  dataList = [],
  dataKey,
  dataName,
  placeholder,
}: {
  onChange?: (item: any) => void;
  dataList: CommonObject[];
  dataKey: keyof CommonObject;
  dataName: keyof CommonObject;
  placeholder?: string;
}) => {
  const [dataFilter, setDataFilter] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>("");
  useEffect(() => {
    if (value != "" && value != null) {
      if (onChange) onChange(value);
    }
  }, [value]);
  useEffect(() => {
    setDataFilter(dataList);
  }, [dataList]);

  const handleSearch = (e: string) => {
    if (e == "") {
      setDataFilter(dataList);
    } else {
      setDataFilter(
        dataList.filter(
          (item) => item[dataName].toLowerCase().indexOf(e.toLowerCase()) >= 0
        )
      );
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-gray-600"
        >
          {!!value
            ? dataList.length > 0 &&
              dataList.find((item) => item[dataKey] == value)[dataName]
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 w">
        <Command>
          <CommandInput
            placeholder="Nhập tìm kiếm..."
            onValueChange={(e) => {
              handleSearch(e);
            }}
          />
          <CommandList>
            <CommandEmpty>Không có danh sách.</CommandEmpty>

            {dataFilter.map((item: any) => (
              <CommandItem
                key={item[dataKey]}
                value={item[dataKey]}
                onSelect={(currentValue) => {
                  setValue(currentValue == value ? "" : currentValue);
                  console.log(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item[dataKey] ? "opacity-100" : "opacity-0"
                  )}
                />
                {item[dataName]}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxCustom;
