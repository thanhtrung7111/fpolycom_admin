import { useQuery } from "@tanstack/react-query";
import React from "react";

const ImageComponent = ({
  url = "",
  id = "",
  file = null,
  type = "",
  className = "h-24 w-24",
}: {
  url?: string;
  file: File | null;
  id: string | undefined;
  type: string;
  className: string;
}) => {
  const { data, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["image" + type, id],
    queryFn: () => url,
    enabled: url != "",
  });
  console.log(data);
  return (
    <div className={`${className}`}>
      <img
        className="h-full w-full object-cover object-center"
        src={file != null ? URL.createObjectURL(file) : data}
        alt=""
      />
    </div>
  );
};

export default ImageComponent;
