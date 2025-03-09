import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import authState from "../utils/atoms/auth";
import {
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [authenticationData, setAuthenticationData] = useRecoilState(authState);

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Expert Instructors" },
    { number: "1000+", label: "Course Hours" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] text-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <motion.section
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-[#00FFAA] block mb-2">Elevate</span>
              <span className="text-[#FFD700]">Innovate</span>
              <span className="text-[#00FFAA]"> & Succeed</span>
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Transform your future with cutting-edge courses designed for the
              digital age.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#00FFAA] to-[#00CC88] px-10 py-4 rounded-lg font-bold text-black shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                if (authenticationData?.isAuthenticated) {
                  navigate("/course/explore");
                } else {
                  setAuthenticationData({
                    ...authenticationData,
                    authenticationFormState: {
                      isVisible: true,
                      state: "signin",
                    },
                  });
                }
              }}
            >
              Start Learning Now
            </motion.button>
          </motion.section>
          <motion.section
            className="w-full lg:w-1/2 max-sm:hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/assets/home.png"
              alt="Futuristic Learning"
              className="w-full h-auto rounded-2xl shadow-2xl"
              animate={{
                y: [0, -10, 0],
                rotateY: [0, 5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ perspective: 1000 }}
            />
          </motion.section>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="bg-[#161616] py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-4xl font-bold text-[#00FFAA] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          {...fadeInUp}
        >
          <span className="text-[#FFD700]">Why Choose</span>{" "}
          <span className="text-[#00FFAA]">100xKnowledge?</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <AcademicCapIcon className="w-8 h-8" />,
              title: "Industry Experts",
              desc: "Learn from seasoned professionals with real-world experience.",
            },
            {
              icon: <ClockIcon className="w-8 h-8" />,
              title: "Flexible Learning",
              desc: "Study at your own pace with 24/7 access to course materials.",
            },
            {
              icon: <UserGroupIcon className="w-8 h-8" />,
              title: "Exclusive Community",
              desc: "Connect with peers and mentors in our thriving learning community.",
            },
            {
              icon: <ChartBarIcon className="w-8 h-8" />,
              title: "Career Growth",
              desc: "Accelerate your career with industry-recognized certifications.",
            },
            {
              icon: <GlobeAltIcon className="w-8 h-8" />,
              title: "Global Access",
              desc: "Join learners from over 150+ countries worldwide.",
            },
            {
              icon: <SparklesIcon className="w-8 h-8" />,
              title: "Interactive Learning",
              desc: "Engage with hands-on projects and real-world applications.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-[#00FFAA] mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-[#FFD700]">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!authenticationData?.isAuthenticated && (
        <motion.div
          className="container mx-auto px-4 pb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#1E1E1E] to-[#242424] rounded-3xl p-12 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[#00FFAA] opacity-5"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.08, 0.05],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <h2 className="text-5xl font-bold mb-6">
              Ready to <span className="text-[#FFD700]">Share</span> Your{" "}
              <span className="text-[#00FFAA]">Knowledge?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our community of expert instructors and help shape the future
              of education.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 bg-gradient-to-r from-[#FFD700] to-[#FFC000] px-12 py-4 rounded-xl font-bold text-black shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAuthenticationData({
                  ...authenticationData,
                  authenticationFormState: { isVisible: true, state: "signup" },
                });
              }}
            >
              Become an Instructor
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;
