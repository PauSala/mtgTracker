"use client";
import { useEffect, useState } from "react";

export function LogViewer({ page }: { page: number }) {
  console.log("page: ", page);

  useEffect(() => {
    fetch(`http://localhost:3001/objects/${page}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  });

  return <div></div>;
}
