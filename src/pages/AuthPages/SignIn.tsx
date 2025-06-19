import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";

export default function SignIn() {
  interface DecodedToken {
    type: string;
    [key: string]: any;
  }

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded?.type === "admin") navigate("/");
      } catch { }
    }
  }, []);

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
