import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const SearchBar = ({ setKeyword }) => {
  return (
    <Input
      type="text"
      placeholder="Tìm kiếm khóa học..."
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};

export default SearchBar;
