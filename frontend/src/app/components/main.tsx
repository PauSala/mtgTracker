"use client";

import { Button, ThemeProvider } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { LogViewer } from "./logViewer";

export function Container() {
  const [page, setPage] = useState<number>(0);
  const clickHandler = (direction: number) => {
    setPage((oldPage) => {
      const newPage = oldPage + 1 * direction;
      return newPage;
    });
  };
  return (
    <ThemeProvider>
      <div className="p-1.5">
        <div className="flex gap-2 ">
          <Button
            variant="outlined"
            color="green"
            onClick={() => clickHandler(-1)}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            color="green"
            onClick={() => clickHandler(1)}
          >
            Next
          </Button>
        </div>
        <div className="p-1.5">
          <LogViewer page={page}></LogViewer>
        </div>
      </div>
    </ThemeProvider>
  );
}
