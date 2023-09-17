import { NextRequest } from "next/server";

async function QueryMaker(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;

  // Convert URLSearchParams to a plain JavaScript object
  const queryParamsObject: { [key: string]: string } = {};

  queryParams.forEach((value, key) => {
    queryParamsObject[key] = value;
  });

  return queryParamsObject;
}

export default QueryMaker;
