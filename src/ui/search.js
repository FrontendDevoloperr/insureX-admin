import React from "react";
import { Input } from "@mantine/core";
import { Search } from "../icons/index";

function SearchComponent({ data, setFilteredData, setInputText, type }) {
  const FilterData = (e) => {
    const { value } = e.target;
    setInputText(value.toLowerCase());
    if (value === "") {
      return data;
    }

    setFilteredData(
      data.filter((res) =>
        res[type].toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return <Input icon={<Search />} placeholder="Search" onInput={FilterData} />;
}

export default SearchComponent;
