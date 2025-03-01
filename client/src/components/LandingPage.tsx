import { motion } from "framer-motion";
const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#E6D6CE] h-auto pt-2 px-8 max-sm:px-0">
      <div className="p-4 flex gap-8 items-center max-sm:flex-col">
        <section className="w-[50%] font-irish-grover max-sm:w-[70%]">
          <p className="text-[#383535] text-8xl max-md:text-6xl max-sm:text-5xl">
            Learn
          </p>
          <div className="flex text-8xl gap-8 max-md:text-6xl max-sm:text-5xl max-md:gap-3">
            <p className="font-irish-grover ">Grow</p>
            <p className="text-[#383535] max-md:text-6xl ">
              And{" "}
              <p className="text-[#735252] text-8xl max-md:text-6xl max-sm:text-5xl max-md:hidden">
                Succeed
              </p>
            </p>
          </div>
          <p className="text-[#735252] text-8xl max-md:text-6xl max-sm:text-5xl min-md:hidden">
            Succeed
          </p>
        </section>
        <section className="w-[50%] max-sm:w-[80%]">
          <motion.img
            src="/assets/home.png" // Replace with your image path
            alt="Floating Image"
            className="object-cover"
            animate={{
              y: [0, -20, 0], // Floating effect
              rotateX: [0, 15, 0], // 3D tilt effect,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ perspective: 1000 }}
          />
        </section>
      </div>
      <div className="flex flex-col items-center text-6xl max-sm:px-4 font-bold pb-4 mt-20 max-md:text-4xl max-sm:text-2xl max-sm:mt-5">
        <div className="flex gap-2 items-center">
          <p className="text-[#432C2C]">100xKnowledge,</p>
          <p>because</p>
        </div>
        <p>10x ain't enough!</p>
      </div>
      <div className="w-full flex justify-center">
        <button className="bg-[#423737] px-8 rounded-4xl py-3 font-bold cursor-pointer text-white shadow hover:opacity-75 my-4 ">
          Explore courses
        </button>
      </div>
      <p className="text-center text-[#7E7777] font-semibold text-xl max-sm:text-lg pb-4 max-sm:text-xl">
        A beginner-friendly platform for mastering skills.
      </p>
      <div className="flex flex-col w-[80vw] m-auto py-8 px-8 bg-[#484444] rounded-3xl max-sm:w-[90vw] mt-8 mb-4">
        <div className="font-irish-grover flex flex-col text-4xl text-white mb-2 max-sm:text-2xl max-md:text-3xl">
          <p>Want to share knowledge to the</p>
          <p>world & earn?</p>
        </div>
        <button className="bg-[#6D6464] px-8 w-[150px] rounded-4xl py-3 font-bold cursor-pointer text-white shadow hover:opacity-75 mt-4 ">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
