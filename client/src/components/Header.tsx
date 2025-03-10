import { useRecoilState } from "recoil";
import Cookie from "js-cookie";
import api from "../utils/axios";
import authState, { AuthState } from "../utils/atoms/auth";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useEffect } from "react";

const Header: React.FC = () => {
  const [authenticationData, setAuthenticationData] = useRecoilState(authState);
  const getLoggedInUser = async () => {
    const token = Cookie.get("token");
    if (token) {
      try {
        const response = await api.get("/user/me");
        const data = response.data;
        if (response.status === 200) {
          setAuthenticationData((prev: AuthState) => ({
            ...prev,
            isAuthenticated: true,
            user: data?.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const handleAuthentication = (state: string) => {
    if (!authenticationData?.isAuthenticated) {
      setAuthenticationData((prev) => ({
        ...prev,
        authenticationFormState: {
          isVisible: true,
          state: state,
        },
      }));
      return;
    }
    setAuthenticationData((prev) => ({
      ...prev,
      isAuthenticated: !prev.isAuthenticated,
      user: null,
    }));
    Cookie.remove("token");
  };

  return (
    <header className="w-full h-16 bg-[#1A1A1A] flex justify-between items-center px-6 shadow-lg">
      <p className="text-[#00FFAA] font-bold text-3xl max-sm:text-xl">
        100xKnow
      </p>
      <div className="flex gap-4 items-center max-sm:gap-2">
        {!authenticationData?.isAuthenticated && (
          <button
            className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-bold shadow hover:bg-[#00FFAA] transition-all duration-300 max-sm:px-4 max-sm:py-1 max-sm:text-sm"
            onClick={() => handleAuthentication("signin")}
          >
            Sign In
          </button>
        )}
        <button
          className="bg-[#242424] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#00FFAA] hover:text-black transition-all duration-300 max-sm:px-4 max-sm:py-1 max-sm:text-sm"
          onClick={() => handleAuthentication("signup")}
        >
          {!authenticationData?.isAuthenticated ? "Join Now" : "Log Out"}
        </button>
      </div>
      <Modal isOpen={authenticationData?.authenticationFormState.isVisible}>
        <Authentication />
      </Modal>
    </header>
  );
};

export default Header;
