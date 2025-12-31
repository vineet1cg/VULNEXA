import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">
          SentinAI
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to continue
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              if (!credentialResponse.credential) {
                throw new Error("No Google ID token received");
              }

              await login(credentialResponse.credential); // ✅ ID TOKEN
              navigate("/dashboard");
            } catch (err) {
              console.error(err);
              setError("Authentication failed");
            }
            // console.log("Google credential:", credentialResponse.credential);
          }}
          onError={() => {
            setError("Google sign-in failed");
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;