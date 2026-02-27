"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function PartnersEditor() {
  const [data, setData] = useState({ 
      title: "Our Trusted partners",
      partnersList: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPartnersData = async () => {
      const res = await fetch("/api/content/partners");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData((prev) => ({ ...prev, ...json.data }));
        }
      }
      setLoading(false);
    };
    fetchPartnersData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      await fetch("/api/content/partners", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
      });
      alert("Partners section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");
        const token = await user.getIdToken();

        const newPartners = [];
        for (const file of e.target.files) {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Upload failed.");
            const { url } = await uploadRes.json();
            
            newPartners.push({
                id: Date.now() + Math.random(),
                imageUrl: url,
                name: file.name
            });
        }
        
        setData(prev => ({
            ...prev,
            partnersList: [...(prev.partnersList || []), ...newPartners]
        }));
    } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload image(s).");
    } finally {
        setUploading(false);
        e.target.value = ""; // Reset input
    }
  };

  const removePartner = (id) => {
      setData(prev => ({
          ...prev,
          partnersList: prev.partnersList.filter(p => p.id !== id)
      }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit Partners Logos</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header Text */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        {/* Dynamic Logos */}
        <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Partner Logos</h3>
                
                <div className="relative">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                    <button type="button" disabled={uploading} className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded hover:bg-gray-200 disabled:opacity-50">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                       {uploading ? "Uploading..." : "Upload Logos"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {data.partnersList?.map((partner) => (
                    <div key={partner.id} className="relative group border rounded-lg p-2 flex flex-col items-center justify-center aspect-square bg-gray-50 h-[120px]">
                        <img src={partner.imageUrl} alt={partner.name} className="max-w-full max-h-[80px] object-contain" />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <button type="button" onClick={() => removePartner(partner.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                ))}
                {(!data.partnersList || data.partnersList.length === 0) && (
                    <div className="col-span-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p>No partner logos uploaded.</p>
                    </div>
                )}
            </div>
        </div>

        <button type="submit" disabled={saving || uploading} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
