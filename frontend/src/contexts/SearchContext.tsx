import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchKey: string;
  setSearchKey: (searchKey: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchKey, setSearchKey] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchKey, setSearchKey }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("SearchContext must be used within a SearchProvider");
  }
  return context;
};
