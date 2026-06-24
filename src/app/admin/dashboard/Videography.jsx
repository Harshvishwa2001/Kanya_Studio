"use client";
import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaTrashAlt, FaSpinner, FaVideo,
  FaPlay, FaFilm, FaTimes, FaExternalLinkAlt
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export const Videography = ({ title }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", videoFile: null });

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const result = await res.json();
      if (result.success) setItems(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally { setIsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile) return toast.error("Select a cinematic sequence!");

    // Client-side size check (Optional: e.g., 100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (formData.videoFile.size > MAX_SIZE) {
      return toast.error("File is too large. Max limit is 100MB.");
    }

    setIsSubmitting(true);

    try {
      // 1. Get Signature
      const signRes = await fetch("/api/sign-cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "kanya_studio_videos" })
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || "Failed to get signature");

      // 2. Upload to Cloudinary directly
      const uploadData = new FormData();
      uploadData.append("file", formData.videoFile);
      uploadData.append("api_key", signData.apiKey);
      uploadData.append("timestamp", signData.timestamp);
      uploadData.append("signature", signData.signature);
      uploadData.append("folder", "kanya_studio_videos");

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`, {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadResult.error?.message || "Failed to upload to Cloudinary");

      // 3. Save to MongoDB
      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title, videoUrl: uploadResult.secure_url })
      });
      const saveResult = await saveRes.json();

      if (saveRes.ok && saveResult.success) {
        setItems([saveResult.data, ...items]);
        setShowForm(false);
        setFormData({ title: "", videoFile: null });
        toast.success("Film uploaded successfully!");
      } else {
        const errorMessage = saveResult.message || saveResult.error || "Server rejected the upload";
        toast.error(`Save Failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(`Transmission failed! ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteVideo = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium text-sm">Remove this film from the collection?</p>
        <div className="flex gap-3 mt-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
                if (res.ok) {
                  setItems(items.filter(v => v._id !== id));
                  toast.success("Film removed successfully!");
                }
              } catch (error) {
                toast.error("Delete failed");
              }
            }}
          >
            Delete
          </button>
          <button
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-md text-xs font-bold transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4">

      {/* 1. CINEMATIC HEADER */}
      <div className="flex flex-col md:flex-col justify-between items-center gap-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
            <FaFilm size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title} <span className="text-[#c26e00]">Films</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Cinematic Production Management</p>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-top-8 duration-700 w-full mt-4">
          <form onSubmit={handleSubmit} className="relative bg-[#0a0f1c] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden group">
            {/* Subtle premium glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c26e00]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 group-hover:bg-[#c26e00]/20 transition-colors duration-1000" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-end">

              {/* Film Title Input */}
              <div className="w-full lg:flex-1 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#c26e00] uppercase tracking-[0.2em] ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c26e00] animate-pulse" />
                  Film Title
                </label>
                <div className="relative">
                  <input
                    type="text" required placeholder="Ex: The Royal Wedding of Aaditya & Meera"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:bg-white/10 focus:border-[#c26e00]/50 transition-all placeholder:text-slate-500/50 focus:ring-4 focus:ring-[#c26e00]/10 font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">

                {/* File Upload Trigger */}
                <label className="flex-1 lg:w-80 flex items-center gap-4 bg-white/5 border border-dashed border-white/20 p-2 rounded-2xl cursor-pointer hover:border-[#c26e00]/50 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 shrink-0 transition-colors group-hover:text-[#c26e00]">
                    <FaVideo size={18} />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden pr-4">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider truncate w-full">
                      {formData.videoFile ? formData.videoFile.name : "Select Source File"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      {formData.videoFile ? "Ready for staging" : "MP4, MOV (Max 100MB)"}
                    </span>
                  </div>
                  <input type="file" hidden accept="video/*" onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })} />
                </label>

                {/* Submit Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-gradient-to-r from-[#c26e00] to-[#e68a00] text-white px-10 py-2 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-[0_10px_40px_-10px_rgba(194,110,0,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center min-w-[160px] h-[66px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Syncing...</span>
                    </div>
                  ) : (
                    "Upload Film"
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* 3. THE PREMIERE GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering Gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">

              {/* Video Preview Container */}
              <div className="relative aspect-video overflow-hidden">
                <video
                  src={item.videoUrl}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  preload="metadata"
                  playsInline
                  muted
                />

                {/* Visual Polish Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-110 group-hover:bg-[#c26e00] transition-all duration-500">
                    <FaPlay className="ml-1" />
                  </div>
                </div>

                {/* Management Tags */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteVideo(item._id); }}
                    className="p-3 bg-white/10 backdrop-blur-lg rounded-xl text-white hover:bg-rose-500 transition-all"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>

              {/* Title Card */}
              <div className="p-8 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[#c26e00] text-[9px] font-black uppercase tracking-[0.2em]">Kanya Studio Productions</p>
                  <h3 className="text-white font-bold text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="text-white/20 group-hover:text-white transition-colors">
                  <FaExternalLinkAlt size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. EMPTY REEL STATE */}
      {!isLoading && items.length === 0 && (
        <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[3rem] space-y-4">
          <FaVideo className="text-slate-200 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No films in the archive</h3>
          <p className="text-slate-400 text-sm max-w-[300px] mx-auto">Upload your cinematic masterpieces to showcase them in the production gallery.</p>
        </div>
      )}
    </div>
  );
};