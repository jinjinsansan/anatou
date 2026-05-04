"use client";

import { useEffect, useState } from "react";

const FALLBACK_YEAR = 2026;

export function CurrentYear() {
  const [year, setYear] = useState<number>(FALLBACK_YEAR);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
