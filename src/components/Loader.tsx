// import { Loader2 } from "lucide-react"

const Loader = () => {
  return (
    <div className="flex items-center justify-center gap-[0.5px] animate-bounce w-full h-full ">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};

export default Loader;
