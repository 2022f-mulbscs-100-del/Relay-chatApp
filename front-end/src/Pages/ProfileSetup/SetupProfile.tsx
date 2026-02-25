import { useRef, useState } from "react";
import { FiCamera, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useUserApis } from "../../customHooks/useUserApis";
import ImageCroppingContainer from "../../Component/ImageCroppingContainer";

const SetupProfile = () => {
  const navigate = useNavigate();
  const { setupProfile } = useUserApis();
  
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const InputRef = useRef<HTMLInputElement | null>(null);
  
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "phone":
        if (phone.length >= 15) return;
        setPhone(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "about":
        setAbout(value);
        break;
      default:
        break;
    }
  };

  const handleContinue = async () => {
    if(!phone || !title || !about || !image) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await setupProfile(phone, title, about, image);
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while setting up profile");
    }
  }

  const HandleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setIsCropperOpen(true);
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    setIsCropperOpen(false);
    setIsUploading(true);
    
    try {
      // Convert data URL to blob
      const response = await fetch(croppedDataUrl);
      const blob = await response.blob();
      const file = new File([blob], selectedFile?.name || "cropped-image.png", { type: "image/png" });
      
      const imageUrl = await uploadToClaudinary(file);
      setImage(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedFile(null);
    if (InputRef.current) {
      InputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (InputRef.current) {
      InputRef.current.value = "";
    }
  };

  const uploadToClaudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "relay-chatApp-front-preset"); 

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload", { 
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("Cloudinary response:", data);
      return data.secure_url; 
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  return (
    <>
      {/* Cropper Modal */}
      {isCropperOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <ImageCroppingContainer
            imageFile={selectedFile}
            onCrop={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </div>
      )}

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="w-full px-0 py-6">
          <div className="w-full px-20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Set up your profile</h1>
                <p className="text-sm text-slate-500">Tell people who you are and what you do</p>
              </div>
              <button 
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer" 
                onClick={() => { navigate("/") }}
              >
                Skip for now
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <input 
                  ref={InputRef} 
                  type="file" 
                  accept="image/*"  
                  className="hidden"
                  onChange={HandleFileChange}
                />
                <div
                  onClick={()=>{InputRef?.current?.click()}}
                  className="relative w-24 h-24 cursor-pointer"
                >
                  <div className="w-full h-full rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {isUploading ? (
                      <div className="text-xs text-slate-500">Uploading...</div>
                    ) : image ? (
                      <img src={image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FiCamera className="text-slate-500" />
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow">
                    <FiPlus className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Profile photo</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a clear headshot so teammates can recognize you.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button 
                      type="button"
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition disabled:opacity-50"
                      onClick={()=>{InputRef.current?.click()}}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload photo"}
                    </button>
                    <button 
                      type="button"
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                      onClick={handleRemoveImage}
                      disabled={!image || isUploading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="text-slate-500">Phone number</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="+1 (555) 000-0000"
                    name="phone"
                    value={phone}
                    onChange={HandleChange}
                  />
                </label>
                <label className="text-sm">
                  <span className="text-slate-500">Name</span>
                  <input
                    name="title"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="John Doe"
                    value={title}
                    onChange={HandleChange}
                  />
                </label>
              </div>

              <label className="text-sm mt-4 block">
                <span className="text-slate-500">Bio</span>
                <textarea
                  name="about"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 min-h-[120px]"
                  placeholder="Share a short bio that helps others get to know you."
                  value={about}
                  onChange={HandleChange}
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button 
                className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                onClick={() => { navigate("/") }}
              >
                Skip setup
              </button>
              <button 
                className="cursor-pointer px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupProfile;





// const uploadWithProgress = async (file) => {

//  const formData = new FormData();

//  formData.append("file", file);
//  formData.append("upload_preset", "relay-chatApp-preset");

//  const xhr = new XMLHttpRequest();

//  xhr.open(
//   "POST",
//   "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload"
//  );

//  xhr.upload.onprogress = (e) => {

//   const percent = (e.loaded / e.total) * 100;

//   console.log(percent);

//  };

//  xhr.send(formData);

// };