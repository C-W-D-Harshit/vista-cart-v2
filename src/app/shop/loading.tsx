import Loader from "@/components/essentials/Loader";
import React from "react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="main-load">
      <Loader />
    </div>
  );
}
