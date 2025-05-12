import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-[#800020] text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-do-hyeon">
          광운대학교 정보융합학부 챗봇
        </h1>
        <a
          href="https://ic.kw.ac.kr:501/main/main.php"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/hol.png"
            alt="IC 홈페이지"
            className="h-8 w-auto sm:h-9 md:h-10 lg:h-12"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
