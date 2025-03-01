const Header: React.FC = () => {
  return (
    <div className="h-18 bg-[#E6D6CE] w-full flex justify-between items-center p-4">
      <p className="font-semibold text-2xl text-brown opacity-100">100xKnow</p>
      <div className="flex gap-4 items-center max-sm:gap-2">
        <button className="bg-[#D7CDCD] w-28 max-sm:w-24 rounded-4xl py-2 font-bold cursor-pointer shadow hover:opacity-75">
          Sign In
        </button>
        <button className="bg-[#423737] w-28 max-sm:w-24 rounded-4xl py-2 font-bold cursor-pointer text-white shadow hover:opacity-75">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default Header;
