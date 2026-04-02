"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface YearContextType {
  year: number;
  setYear: (year: number) => void;
}

const YearContext = createContext<YearContextType>({
  year: new Date().getFullYear(),
  setYear: () => {},
});

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState(new Date().getFullYear());

  useEffect(() => {
    const saved = localStorage.getItem("planner-year");
    if (saved) setYearState(Number(saved));
  }, []);

  const setYear = (y: number) => {
    setYearState(y);
    localStorage.setItem("planner-year", String(y));
  };

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  return useContext(YearContext);
}
