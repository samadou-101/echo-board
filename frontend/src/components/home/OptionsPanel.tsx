import React from "react";
import { MessageCircle } from "lucide-react";
import Button from "@components/ui/Button";
import { useAppDispatch, useAppSelector } from "@hooks/redux/redux-hooks";
import { setIsChatOpen } from "@redux/slices/globalSlice";

const OptionsPanel: React.FC = () => {
  const isOpen = useAppSelector((state) => state.global.isChatOpen);
  const dispatch = useAppDispatch();
  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-white/80 p-2 shadow-lg dark:bg-gray-900">
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
