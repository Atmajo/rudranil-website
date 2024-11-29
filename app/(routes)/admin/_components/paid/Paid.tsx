import React from "react";
import PaidTable from "./PaidTable";

const Paid = () => {
  return (
    <div className="py-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold">Paid</h1>
      </div>
      <PaidTable />
    </div>
  );
};

export default Paid;
