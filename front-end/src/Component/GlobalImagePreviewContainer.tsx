import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface ImagePreviewComponentProps {
    imageUrl: string;
    onClose: () => void;
}

const GlobalImagePreviewContainer = ({ imageUrl, onClose }: ImagePreviewComponentProps) => {

    const [scale, setScale] = useState(1);


    //sideEffects

    // Close on Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);



    const handleZoom = () => {
        setScale((prev) => {
            return prev + 0.5;
        })
    }

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
                <div className="flex max-h-[70vh] min-h-65 cursor-zoom-in items-center justify-center bg-slate-50 p-2 sm:p-3">
                    <img src={imageUrl} alt="Preview" className="max-h-[64vh] w-auto max-w-full rounded-lg border border-slate-200 object-contain shadow-sm"
                        // onWheel={handleZoom}
                        onClick={handleZoom}
                        style={{
                            transform: `scale(${scale})`,
                            transition: "transform 0.2s"
                        }}

                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalImagePreviewContainer;
