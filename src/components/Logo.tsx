import { useDarkMode } from "../context/DarkModeContext";

function Logo() {
  const { isDark } = useDarkMode();
  const src = isDark ? "/logo-dark.png" : "/logo-light.png";
  return (
    <div className="h-12 w-12  rounded-lg overflow-hidden">
      <img className="w-auto h-12" src={src} alt="Logo" />
    </div>
  );
}

export default Logo;
