import React, { useState } from "react";
import ProfileInfo from "../../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate;

  const onLogout = () => {
    navigate("/login");
  };

  const handleSearch = () => {}

  const onClearSearch = () => {
    setSearchQuery("");
  }


  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-between px-6 py-3 shadow-lg">
      <h2 className="text-2xl font-bold text-white py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />

      <ProfileInfo onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
