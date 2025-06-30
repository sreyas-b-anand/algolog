import logo from "@/public/logo.png";
import Login from "@/src/components/Login";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background">
      <div className="flex items-center justify-center gap-6 p-8 rounded-md shadow-sm bg-background/50">
        <div className="flex justify-center gap-4 flex-col items-center p-3">
          <Image
            loading="lazy"
            src={logo}
            alt=""
            className="rounded-full w-[80px] h-[80px]"
          />
          <p className="text-3xl text-foreground font-semibold">AlgoLog</p>
          <p className="text-lg text-foreground/50">
            Your competitive programming companion
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
