'use server'

import { AllMenusDocument } from "@graphql";
import { apiQuery } from "next-dato-utils";
import ServerTest from "@app/test/ServerTest";
import { Suspense } from "react";

export default async function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ServerTest />
      </Suspense>
    </div>
  );
}