import { SignUp } from "@clerk/nextjs";

export default function signUpPage() {
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/home" />
    </main>
  )
}