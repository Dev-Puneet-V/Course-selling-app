import { useRecoilState } from "recoil";
import Cookie from "js-cookie";
import axios from "axios";
import authState, { AuthState } from "../utils/atoms/auth";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useEffect } from "react";

const Header: React.FC = () => {
  const [authenticationData, setAuthenticationData] = useRecoilState(authState);
  const getLoggedInUser = async () => {
    const token = Cookie.get("token");
    if (token) {
      const response = await axios.get("http://localhost:3000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      const status = response.status;
      if (status === 200) {
        setAuthenticationData((prev: AuthState) => ({
          ...prev,
          isAuthenticated: true,
          user: data?.data,
        }));
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
    <div className="h-18 bg-[#E6D6CE] w-full flex justify-between items-center p-4">
      <p className="font-semibold text-2xl text-brown opacity-100">100xKnow</p>
      <div className="flex gap-4 items-center max-sm:gap-2">
        {!authenticationData?.isAuthenticated && (
          <button
            className="bg-[#D7CDCD] w-28 max-sm:w-24 rounded-4xl py-2 font-bold cursor-pointer shadow hover:opacity-75"
            onClick={() => handleAuthentication("signin")}
          >
            Sign In
          </button>
        )}
        <button
          className="bg-[#423737] w-28 max-sm:w-24 rounded-4xl py-2 font-bold cursor-pointer text-white shadow hover:opacity-75"
          onClick={() => handleAuthentication("signup")}
        >
          {!authenticationData?.isAuthenticated ? "Join Now" : "Log Out"}
        </button>
      </div>
      <Modal isOpen={authenticationData?.authenticationFormState.isVisible}>
        <Authentication />
      </Modal>
    </div>
  );
};

export default Header;
