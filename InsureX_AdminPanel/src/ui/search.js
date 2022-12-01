import React from "react";
import { Input } from "@mantine/core";
import { Search } from "../icons";

function SearchComponent({ data, setFilteredData, setInputText, type }) {
  const FilterData = (e) => {
    setInputText(e.target.value);
    if (e.target.value === "") {
      return data;
    }
    const { value } = e.target;
    let regex = new RegExp([value.toLowerCase()].join("|"));
    setFilteredData(
      data.filter((e) =>
        type.some((k) =>
          regex.test(
            Object.fromEntries(
              Object.entries(e).map(([key, v]) => [
                key,
                String(v).toLowerCase(),
              ])
            )[k]
          )
        )
      )
    );
  };

  return <Input icon={<Search />} placeholder="Search" onChange={FilterData} />;
}

export default SearchComponent;
