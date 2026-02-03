import { useState } from "react";
import { FiCamera, FiPlus, FiX } from "react-icons/fi";

const SetupProfile = () => {
  const [tags, setTags] = useState<string[]>(["Design", "UI/UX", "React"]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Set up your profile</h1>
              <p className="text-sm text-slate-500">Tell people who you are and what you do</p>
            </div>
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              Skip for now
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <FiCamera className="text-slate-500" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow">
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Profile photo</p>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a clear headshot so teammates can recognize you.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
                    Upload photo
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
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
                />
              </label>
              <label className="text-sm">
                <span className="text-slate-500">Role / Title</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  placeholder="Product Designer"
                />
              </label>
            </div>

            <label className="text-sm mt-4 block">
              <span className="text-slate-500">Bio</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 min-h-[120px]"
                placeholder="Share a short bio that helps others get to know you."
              />
            </label>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">Tags</p>
                  <p className="text-xs text-slate-500">Add skills or interests</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag}
                    <button
                      className="text-slate-400 hover:text-slate-600"
                      onClick={() => removeTag(tag)}
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-col md:flex-row md:items-center gap-2">
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                  onClick={addTag}
                >
                  Add tag
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="text-sm text-slate-500 hover:text-slate-700">
              Skip setup
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
