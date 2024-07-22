import { signInWithGoogle } from "../utils/firebase-config";

const SignIn = () => {
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const { uid, email, displayName } = user;
      await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: uid,
          email: email,
          name: displayName,
        }),
      });
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default SignIn;
