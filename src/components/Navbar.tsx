import { FaUser } from "react-icons/fa";

interface NavbarProps {
  handleSignup: () => void;
  handleLogin: () => void;
  user: boolean;
}

export const Navbar = ({ handleLogin, handleSignup, user }: NavbarProps) => {
  return (
    <nav
      className={`grid ${
        user
          ? "grid-cols-[120px_1fr_200px_50px]"
          : "grid-cols-[120px_1fr_180px]"
      } w-5xl items-center`}
    >
      <span className="glassmorphism-left uppercase font-extrabold py-1.5 flex justify-center text-lg text-white">
        tiket.ku
      </span>
      <div className="bg-aquamarine-500 w-full h-full" />
      <ul className="glassmorphism-right flex items-center justify-around divide-x divide-aquamarine-400/40 h-full">
        <li
          className="px-4 py-1.5 text-white font-semibold cursor-pointer"
          onClick={handleSignup}
        >
          {user ? "Home" : "Sign Up"}
        </li>
        <li
          className="px-4 py-1.5 text-white font-semibold cursor-pointer"
          onClick={handleLogin}
        >
          {user ? "Schedules" : "Login"}
        </li>
      </ul>
      {user && (
        <ul className="flex">
          <li className="relative flex items-center justify-center px-4">
            <div className="z-1 w-10 h-10 rounded-full glassmorphism flex items-center justify-center cursor-pointer">
              <FaUser color="white" />
            </div>
            <div className=" absolute w-15 h-15 glassmorphism rounded-full"></div>
          </li>
        </ul>
      )}
    </nav>
  );
};
