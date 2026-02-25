import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface ImagePreviewComponentProps {
    imageUrl: string; 
    onClose: () => void;
    sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ImagePreviewComponent = ({ imageUrl, onClose, sendMessage,inputMessage,setInputMessage }: ImagePreviewComponentProps) => {

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);


    const imageName = imageUrl.split("/").pop()?.split("?")[0] || "image";

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-preview-title"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div className="min-w-0">
                        <p id="image-preview-title" className="text-sm font-semibold text-slate-900">
                            Image preview
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {imageName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        aria-label="Close preview"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex max-h-[70vh] min-h-65 items-center justify-center bg-slate-50 p-2 sm:p-3">
                    <img src={imageUrl} alt="Preview" className="max-h-[64vh] w-auto max-w-full rounded-lg border border-slate-200 object-contain shadow-sm" />
                </div>
                <form
                    className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4"
                    onSubmit={(event) => {
                        sendMessage(event);
                        onClose();
                    }}
                >
                    <div className="flex items-center gap-2">
                        <input
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                            type="text"
                            placeholder="Add a caption..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                            aria-label="Send image with caption"
                        >
                            <FaPaperPlane className="inline-block" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImagePreviewComponent;
