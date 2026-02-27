"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function ReviewEditor() {
  const [data, setData] = useState({ 
      title: "", 
      subtitle: "", 
      reviewsList: [
          { name: "John Doe", role: "CEO", comment: "Great work!", rating: 5, imageUrl: "" }
      ] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReviewData = async () => {
      const res = await fetch("/api/content/reviews");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchReviewData();
  }, []);

  const handleUpload = async (file) => {
    if (!file) return "";
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
    if (!res.ok) throw new Error("Upload failed");
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

      const updatedReviews = await Promise.all(data.reviewsList.map(async (rev) => {
          if (rev.file) {
              const url = await handleUpload(rev.file);
              const { file, ...rest } = rev;
              return { ...rest, imageUrl: url };
          }
          return rev;
      }));

      const finalData = { ...data, reviewsList: updatedReviews };

      await fetch("/api/content/reviews", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: finalData })
      });
      alert("Reviews updated!");
      setData(finalData); 
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateReview = (index, field, value) => {
      const newList = [...data.reviewsList];
      newList[index][field] = value;
      setData({ ...data, reviewsList: newList });
  };

  const addReview = () => {
      setData({
          ...data,
          reviewsList: [...data.reviewsList, { name: "New Client", role: "Role", comment: "Comment", rating: 5, imageUrl: "" }]
      });
  };

  const removeReview = (index) => {
      const newList = data.reviewsList.filter((_, i) => i !== index);
      setData({ ...data, reviewsList: newList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit Client Reviews</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header Text */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea value={data.subtitle || ""} onChange={e => setData({...data, subtitle: e.target.value})} rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        {/* Dynamic List */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold border-b pb-2">Client Reviews</h3>
                <button type="button" onClick={addReview} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+ Add Review</button>
            </div>
            
            <div className="space-y-4">
                {data.reviewsList?.map((rev, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-lg bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 relative overflow-hidden">
                           {(rev.imageUrl || rev.file) ? (
                              <img src={rev.file ? URL.createObjectURL(rev.file) : rev.imageUrl} alt="preview" className="object-cover w-full h-full" />
                           ) : (
                               <span className="flex items-center justify-center h-full text-[10px] text-center text-gray-500">Avatar</span>
                           )}
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex gap-2">
                                <input type="text" value={rev.name} placeholder="Client Name"
                                    onChange={e => updateReview(index, 'name', e.target.value)} 
                                    className="block w-full border border-gray-300 rounded-md p-2" />
                                <input type="number" value={rev.rating || 5} min="1" max="5" placeholder="Rating (1-5)"
                                    onChange={e => updateReview(index, 'rating', parseInt(e.target.value))} 
                                    className="block w-24 border border-gray-300 rounded-md p-2" />
                            </div>
                            <input type="text" value={rev.role} placeholder="Role / Company"
                                onChange={e => updateReview(index, 'role', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                            <textarea value={rev.comment} placeholder="Client's review comment" rows={2}
                                onChange={e => updateReview(index, 'comment', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                            <input type="file" onChange={e => updateReview(index, 'file', e.target.files[0])} accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <button type="button" onClick={() => removeReview(index)} className="text-red-500 hover:text-red-700 mt-2">Remove</button>
                    </div>
                ))}
            </div>
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
