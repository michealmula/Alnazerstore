import { useEffect, useState } from "react";
import "./SplashScreen.css";
import logo from "/logo.png";

const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState("enter"); // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(() => onFinish(), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className={`splash-overlay splash-${phase}`}>
      <div className="splash-content">

        {/* Diamond ornament top */}
        <div className="splash-ornament">
          <span className="ornament-line" />
          <span className="ornament-diamond" />
          <span className="ornament-line" />
        </div>

        {/* Logo / Brand */}
        <div className="splash-logo">
<img
src={logo}
  alt="Logo"
  className="splash-logo-img"
/>

          <h1 className="splash-name-ar">الناظر ستور</h1>
          <p className="splash-name-en">ALNAZER STORE</p>
        </div>

        {/* Tagline */}
        <p className="splash-tagline"> إكسسوارات · سكين 
كير</p>

        {/* Diamond ornament bottom */}
        <div className="splash-ornament">
          <span className="ornament-line" />
          <span className="ornament-diamond" />
          <span className="ornament-line" />
        </div>

        {/* Loading dots */}
        <div className="splash-dots" aria-label="جار التحميل">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;