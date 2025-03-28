import React, { createContext, useContext, useState } from "react";

const OpportunityContext = createContext();

export const useOpportunity = () => useContext(OpportunityContext);

export const OpportunityProvider = ({ children }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const value = {
    selectedOpportunity,
    setSelectedOpportunity,
  };

  return (
    <OpportunityContext.Provider value={value}>
      {children}
    </OpportunityContext.Provider>
  );
};
