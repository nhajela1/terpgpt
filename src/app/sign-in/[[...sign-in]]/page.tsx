import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <SignIn 
        fallbackRedirectUrl="/home"
        forceRedirectUrl="/home" 
        
      />
    </main>
  )
}