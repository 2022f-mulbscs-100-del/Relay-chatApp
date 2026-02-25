import { useEffect, useRef, useState } from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "react-cropper/node_modules/cropperjs/dist/cropper.css";
import { FiX, FiRotateCw, FiCheck, FiZoomIn, FiZoomOut } from "react-icons/fi";

interface ImageCroppingContainerProps {
  imageFile: File | null;
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const ImageCroppingContainer = ({ imageFile, onCrop, onCancel }: ImageCroppingContainerProps) => {
  const [image, setImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
      onCrop(croppedDataUrl);
    }
  };

  const resetCropper = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
    }
  };

  const zoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(0.1);
    }
  };

  const zoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(-0.1);
    }
  };

  if (!image) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-4xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Crop Image</h2>
        <p className="text-sm text-slate-500 mt-1">Adjust the crop area to your preference</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
            <Cropper
              src={image}
              style={{ height: 500, width: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={0}
              background={false}
              responsive={true}
              autoCropArea={0.3}
              checkOrientation={false}
              cropBoxResizable={false}
              cropBoxMovable={true}
              dragMode="none"
              minCropBoxWidth={200}
              minCropBoxHeight={200}
              center={true}
              highlight={true}
              modal={true}
              zoomable={true}
              scalable={true}
              movable={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={resetCropper}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <FiRotateCw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={zoomOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={zoomIn}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={getCroppedImage}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                <FiCheck className="w-4 h-4" />
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ImageCroppingContainer;