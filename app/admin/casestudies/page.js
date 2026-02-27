"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function CaseStudiesEditor() {
  const [data, setData] = useState({ 
      title: "", 
      subtitle: "", 
      projects: [
          { name: "Mokeup Project", category: "Logo", imageUrl: "" }
      ] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCaseData = async () => {
      const res = await fetch("/api/content/casestudies");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchCaseData();
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

      // Ensure pending uploads happen
      const updatedProjects = await Promise.all(data.projects.map(async (proj) => {
          if (proj.file) {
              const url = await handleUpload(proj.file);
              const { file, ...rest } = proj; // remove file object before saving to db
              return { ...rest, imageUrl: url };
          }
          return proj;
      }));

      const finalData = { ...data, projects: updatedProjects };

      await fetch("/api/content/casestudies", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: finalData })
      });
      alert("Case Studies updated!");
      setData(finalData); // update local state so file objects are cleared
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateProject = (index, field, value) => {
      const newList = [...data.projects];
      newList[index][field] = value;
      setData({ ...data, projects: newList });
  };

  const addProject = () => {
      setData({
          ...data,
          projects: [...data.projects, { name: "New Project", category: "Category", imageUrl: "" }]
      });
  };

  const removeProject = (index) => {
      const newList = data.projects.filter((_, i) => i !== index);
      setData({ ...data, projects: newList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit Case Studies</h1>
      
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
                <h3 className="text-lg font-semibold border-b pb-2">Projects Items</h3>
                <button type="button" onClick={addProject} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+ Add Project</button>
            </div>
            
            <div className="space-y-4">
                {data.projects?.map((proj, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-lg bg-gray-50">
                        <div className="w-full md:w-32 h-32 bg-gray-200 rounded shrink-0 relative overflow-hidden">
                           {(proj.imageUrl || proj.file) ? (
                              <img src={proj.file ? URL.createObjectURL(proj.file) : proj.imageUrl} alt="preview" className="object-cover w-full h-full" />
                           ) : (
                               <span className="flex items-center justify-center h-full text-xs text-gray-500">No Image</span>
                           )}
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            <input type="text" value={proj.name} placeholder="Project Name"
                                onChange={e => updateProject(index, 'name', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                            <input type="text" value={proj.category} placeholder="Category"
                                onChange={e => updateProject(index, 'category', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                            
                            <input type="file" onChange={e => updateProject(index, 'file', e.target.files[0])} accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <button type="button" onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700 mt-2">Remove</button>
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
