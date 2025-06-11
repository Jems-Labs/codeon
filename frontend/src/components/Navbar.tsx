import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      const userData = {
        fullName: user.fullName || "",
        username: user.username || "",
        image: user.imageUrl || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        clerkId: user.id,
      };

      callUserSync(userData);
    }

    async function callUserSync(userData: any) {
      const token = await getToken();
      await axios.post("http://localhost:5001/api/user/sync", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [isSignedIn, user, isLoaded]);

  return (
    <header className="fixed top-3 left-4 right-4 z-50 bg-primary/10 border border-border rounded-2xl shadow-md px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">
          Codeon
        </div>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="text-sm px-4">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>  
      </div>
    </header>
  );
}
