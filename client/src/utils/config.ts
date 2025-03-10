interface Config {
  API_URL: string;
  RAZORPAY_KEY: string;
  ENV: string;
}

const config: Config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_r9x0083Lr1W1nI",
  ENV: import.meta.env.MODE || "development",
};

export default config;
