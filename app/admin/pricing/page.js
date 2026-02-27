"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function PricingEditor() {
  const [data, setData] = useState({ 
      title: "Perfect Plan", 
      plans: [
        {
          packageName: "Starter",
          title: "Quick Launch",
          description: "For businesses that need high-impact, fast launch.",
          idealFor: "Perfect for single landing pages, brand updates, or key one-off projects.",
          cta: "Schedule an intro call",
          included: ["Compliance Frameworks (1–2)", "Basic Trust Center Setup"]
        },
        {
            packageName: "Pro",
            title: "Growth Mode",
            description: "Designed for scaling teams and growing compliance needs.",
            idealFor: "Ideal for small to mid-sized businesses expanding operations.",
            cta: "Book your strategy session",
            included: ["Compliance Frameworks (3–4)", "Custom Trust Center"]
        }
      ] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPricingData = async () => {
      const res = await fetch("/api/content/pricing");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchPricingData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      await fetch("/api/content/pricing", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
      });
      alert("Pricing section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = (index, field, value) => {
      const newList = [...data.plans];
      newList[index][field] = value;
      setData({ ...data, plans: newList });
  };

  const updateIncluded = (planIndex, featIndex, value) => {
      const newList = [...data.plans];
      newList[planIndex].included[featIndex] = value;
      setData({ ...data, plans: newList });
  };

  const addIncluded = (planIndex) => {
      const newList = [...data.plans];
      newList[planIndex].included.push("New Feature");
      setData({ ...data, plans: newList });
  };

  const removeIncluded = (planIndex, featIndex) => {
      const newList = [...data.plans];
      newList[planIndex].included.splice(featIndex, 1);
      setData({ ...data, plans: newList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit Pricing Plans</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header Text */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        {/* Dynamic Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.plans?.map((plan, index) => (
                <div key={index} className="border p-6 rounded-lg bg-gray-50 flex flex-col space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Plan #{index + 1}</h3>
                    
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Package Name</label>
                        <input type="text" value={plan.packageName} onChange={e => updatePlan(index, 'packageName', e.target.value)} 
                               className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                        <input type="text" value={plan.title} onChange={e => updatePlan(index, 'title', e.target.value)} 
                               className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                        <textarea value={plan.description} onChange={e => updatePlan(index, 'description', e.target.value)} rows={2}
                               className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Ideal For</label>
                        <textarea value={plan.idealFor} onChange={e => updatePlan(index, 'idealFor', e.target.value)} rows={2}
                               className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Call To Action (CTA)</label>
                        <input type="text" value={plan.cta} onChange={e => updatePlan(index, 'cta', e.target.value)} 
                               className="w-full border p-2 rounded mt-1" />
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-semibold text-gray-500 uppercase">Included Features</label>
                             <button type="button" onClick={() => addIncluded(index)} className="text-xs bg-gray-200 px-2 py-1 rounded">+ Add</button>
                        </div>
                        <div className="space-y-2">
                             {plan.included.map((feat, featIdx) => (
                                 <div key={featIdx} className="flex gap-2">
                                     <input type="text" value={feat} onChange={e => updateIncluded(index, featIdx, e.target.value)} className="w-full border p-1 rounded text-sm" />
                                     <button type="button" onClick={() => removeIncluded(index, featIdx)} className="text-red-500 text-xs">X</button>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
