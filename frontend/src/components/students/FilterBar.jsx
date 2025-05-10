import React from "react";
import styled from "styled-components";

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const FilterBar = ({ setCategory, categories }) => {
  return (
    <Select onChange={(e) => setCategory(e.target.value)}>
      <option value="All">Tất cả</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </Select>
  );
};

export default FilterBar;
