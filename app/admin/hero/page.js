"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function HeroEditor() {
  const [data, setData] = useState({ title: "", subtitle: "", buttonText: "", imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      setData(prev => ({ ...prev })); // Optional reset UI logic if needed
      
      const res = await fetch("/api/content/hero");
      if (res.ok) {
        const json = await res.json();
        if (json.data) setData(prev => ({ ...prev, ...json.data }));
      }
      setLoading(false);
    };
    
    fetchHeroData();
  }, []);

  const handleUpload = async () => {
    if (!file) return null;
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/upload", { 
        method: "POST", 
        headers: { "Authorization": `Bearer ${token}` },
        body: formData 
    });
    if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        throw new Error("Upload failed");
    }
    const uploaded = await res.json();
    return uploaded.url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      let finalImageUrl = data.imageUrl;
      if (file) {
        finalImageUrl = await handleUpload();
      }

      const updatedData = { ...data, imageUrl: finalImageUrl };

      await fetch("/api/content/hero", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: updatedData })
      });
      alert("Hero section updated!");
      setData(updatedData);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Hero Section</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Title</label>
          <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
          <textarea value={data.subtitle || ""} onChange={e => setData({...data, subtitle: e.target.value})} rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input type="text" value={data.buttonText || ""} onChange={e => setData({...data, buttonText: e.target.value})} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hero Image</label>
          {data.imageUrl && !file && (
             <div className="mt-2 mb-4">
                 <img src={data.imageUrl} alt="Hero" className="h-48 rounded object-cover" />
             </div>
          )}
          <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
