import React from "react";
import { MessageCircle } from "lucide-react";
import Button from "@components/ui/Button";
import { useAppDispatch, useAppSelector } from "@hooks/redux/redux-hooks";
import { setIsChatOpen } from "@redux/slices/globalSlice";

const OptionsPanel: React.FC = () => {
  const isOpen = useAppSelector((state) => state.global.isChatOpen);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`fixed right-0 bottom-10 z-50 -translate-x-1/2 transform rounded-lg bg-white/80 p-2 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-900 ${
        isOpen
          ? "pointer-events-none scale-95 opacity-0"
          : "pointer-events-auto scale-100 opacity-100"
      }`}
    >
      <Button
        onClick={() => dispatch(setIsChatOpen(!isOpen))}
        variant="ghost"
        size="icon"
        className="text-gray-500"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default OptionsPanel;
