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

export default function App() {
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
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
