import { atom } from "recoil";
interface AuthenticationFormState {
  isVisible: boolean;
  state: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
    authenticationFormState: AuthenticationFormState;
    user: any | null;
}

const authState = atom<AuthState>({
  key: "authState",
  default: {
    isAuthenticated: false,
    authenticationFormState: {
      isVisible: false,
      state: null,
    },
    user: null,
  },
});

export default authState;
