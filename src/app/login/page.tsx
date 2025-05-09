"use client";

import { Suspense } from "react";
import LoginForm from "@/app/login/loginform";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
