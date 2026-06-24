"use client";
import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaTrashAlt, FaSpinner, FaCloudUploadAlt,
  FaEdit, FaImage, FaExpandAlt, FaTimes
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export const Photography = ({ title }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", imageFile: null });

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photography");
      const result = await res.json();
      if (result.success) setItems(result.data);
    } catch (err) { console.error("Fetch error:", err); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageFile && !editingId) return toast.error("Please select an image!");
    setIsSubmitting(true);

    try {
      let finalImageUrl = null;

      if (formData.imageFile) {
        // 1. Get Signature
        const signRes = await fetch("/api/sign-cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "kanya_studio" })
        });
        const signData = await signRes.json();
        if (!signRes.ok) throw new Error(signData.error || "Failed to get signature");

        // 2. Upload to Cloudinary
        const uploadData = new FormData();
        uploadData.append("file", formData.imageFile);
        uploadData.append("api_key", signData.apiKey);
        uploadData.append("timestamp", signData.timestamp);
        uploadData.append("signature", signData.signature);
        uploadData.append("folder", "kanya_studio");

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
          method: "POST",
          body: uploadData
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error?.message || "Failed to upload to Cloudinary");

        finalImageUrl = uploadResult.secure_url;
      }

      // 3. Save to MongoDB
      const payload = { name: formData.name };
      if (finalImageUrl) payload.imageUrl = finalImageUrl;
      if (editingId) payload.id = editingId;

      const res = await fetch("/api/photography", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        if (editingId) {
          setItems(items.map(item => item._id === editingId ? result.data : item));
          toast.success("Photo updated successfully!");
        } else {
          setItems([result.data, ...items]);
          toast.success("Photo uploaded successfully!");
        }
        resetForm();
      } else {
        toast.error(`Save failed: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Capture failed! ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", imageFile: null });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ name: item.name, imageFile: null });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePhoto = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium text-sm">Delete this photo from the collection?</p>
        <div className="flex gap-3 mt-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/photography?id=${id}`, { method: "DELETE" });
                const result = await res.json();
                if (result.success) {
                  setItems(items.filter(p => p._id !== id));
                  toast.success("Photo deleted successfully!");
                }
              } catch (err) { toast.error("Delete failed"); }
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
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-6">
      {/* 1. LUXE HEADER */}
      <div className="flex flex-col md:flex-col justify-between items-start gap-6 border-b border-slate-100 pb-6  ">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <FaImage className="text-white text-2xl" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Curation Portal</span>
            </div>
            <h2 className="text-4xl font-light text-[#0f172a] tracking-tight">
              {title} <span className="font-black text-indigo-600">Photography</span>
            </h2>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-top-10 duration-700 w-full mt-4">
          <form onSubmit={handleSubmit} className="relative bg-[#0a0f1c] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-600/20 transition-colors duration-1000" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-end">

              <div className="w-full lg:flex-1 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Work Description
                </label>
                <div className="relative">
                  <input
                    type="text" required placeholder="Ex: The Ethereal Landscape - Iceland 2024"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-500/50 focus:ring-4 focus:ring-indigo-500/10 font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <label className="flex-1 lg:w-80 flex items-center gap-4 bg-white/5 border border-dashed border-white/20 p-2 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 shrink-0 transition-colors group-hover:text-indigo-400">
                    <FaCloudUploadAlt size={22} />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden pr-4">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider truncate w-full">
                      {formData.imageFile ? "Image Loaded" : "Select Source"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      High Res JPG/PNG
                    </span>
                  </div>
                  <input type="file" hidden accept="image/*" onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} />
                </label>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-10 py-2 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center min-w-[160px] h-[66px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <FaSpinner className="animate-spin text-lg" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 3. MASONRY GRID (4:5 Aspect) */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-48 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-md" />
            <div className="absolute top-0 w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Syncing Archive</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {items.map((item) => (
            <div key={item._id} className="group relative">
              <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-4">
                <img
                  src={item.imageUrl}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:opacity-80"
                  alt={item.name}
                />

                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 space-y-6">
                    <div className="space-y-1">
                      <p className="text-white text-sm font-black uppercase tracking-widest line-clamp-1">{item.name}</p>
                      <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest opacity-80 italic">Curated Portfolio Piece</p>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button onClick={() => handleEdit(item)} className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white hover:text-[#0f172a] text-white rounded-2xl flex items-center justify-center transition-all shadow-xl">
                        <FaEdit size={18} />
                      </button>
                      <button onClick={() => deletePhoto(item._id)} className="h-14 w-14 bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl">
                        <FaTrashAlt size={18} />
                      </button>
                      <div className="ml-auto h-14 w-14 bg-indigo-500/20 backdrop-blur-xl border border-indigo-500/30 text-indigo-300 rounded-2xl flex items-center justify-center opacity-50">
                        <FaExpandAlt size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. EMPTY STATE */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 rounded-[4rem] bg-slate-50 border-2 border-dashed border-slate-200">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-inner mb-8">
            <FaImage className="text-slate-200 text-4xl" />
          </div>
          <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">Archive Unpopulated</h3>
          <p className="text-sm text-slate-400 max-w-[300px] text-center mt-3 font-medium leading-relaxed">
            Your photography gallery is currently empty. Initialize a new upload to begin curating your visual legacy.
          </p>
        </div>
      )}
    </div>
  );
};