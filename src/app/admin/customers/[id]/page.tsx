import React from "react";

const page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
};

export default page;
