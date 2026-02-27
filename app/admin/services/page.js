"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function ServicesEditor() {
  const [data, setData] = useState({ 
      title: "", 
      subtitle: "", 
      servicesList: [
          { name: "Brand Identity", desc: "Crafting memorable brands." },
          { name: "UI/UX Design", desc: "Designing intuitive interfaces." }
      ] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchServicesData = async () => {
      const res = await fetch("/api/content/services");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchServicesData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      await fetch("/api/content/services", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
      });
      alert("Services section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateService = (index, field, value) => {
      const newList = [...data.servicesList];
      newList[index][field] = value;
      setData({ ...data, servicesList: newList });
  };

  const addService = () => {
      setData({
          ...data,
          servicesList: [...data.servicesList, { name: "New Service", desc: "Description here" }]
      });
  };

  const removeService = (index) => {
      const newList = data.servicesList.filter((_, i) => i !== index);
      setData({ ...data, servicesList: newList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Services Section</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header Text */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle/Description</label>
            <textarea value={data.subtitle || ""} onChange={e => setData({...data, subtitle: e.target.value})} rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        {/* Dynamic List */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold border-b pb-2">Service Items</h3>
                <button type="button" onClick={addService} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+ Add Service</button>
            </div>
            
            <div className="space-y-4">
                {data.servicesList?.map((svc, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-lg bg-gray-50">
                        <div className="flex-1 space-y-3">
                            <input type="text" value={svc.name} placeholder="Service Name"
                                onChange={e => updateService(index, 'name', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                            <textarea value={svc.desc} placeholder="Service Description" rows={2}
                                onChange={e => updateService(index, 'desc', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <button type="button" onClick={() => removeService(index)} className="text-red-500 hover:text-red-700 mt-2">Replace/Remove</button>
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
