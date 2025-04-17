// FocusWrapper.tsx
import { PiCursorFill } from "react-icons/pi";

export default function FocusWrapper() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[10px] bg-[rgba(0,0,0,0.1)]">
      <h1 className="flex items-center gap-3 text-xl text-text">
        <PiCursorFill className="text-brand" />
        <span>Click or start typing for focus</span>
      </h1>
    </div>
  );
}