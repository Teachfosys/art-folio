"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function ContactEditor() {
  const [data, setData] = useState({ 
      title: "Get In Touch",
      subtitle: "Have a project in mind? Let's discuss.",
      email: "hello@shahriar.design",
      phone: "+880 1234 567890",
      location: "Dhaka, Bangladesh",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!..." 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContactData = async () => {
      const res = await fetch("/api/content/contact");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchContactData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      await fetch("/api/content/contact", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
      });
      alert("Contact details updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit Contact Information</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
           <label className="block text-sm font-medium text-gray-700">Section Title</label>
           <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Subtitle</label>
           <textarea value={data.subtitle || ""} onChange={e => setData({...data, subtitle: e.target.value})} rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
               <label className="block text-sm font-medium text-gray-700">Support Email</label>
               <input type="email" value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} 
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700">Phone Number</label>
               <input type="text" value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} 
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700">Physical Location</label>
               <input type="text" value={data.location || ""} onChange={e => setData({...data, location: e.target.value})} 
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
               <p className="text-xs text-gray-500 mb-1">Paste the `src` attribute value from Google Maps HTML embed code.</p>
               <textarea value={data.mapUrl || ""} onChange={e => setData({...data, mapUrl: e.target.value})} rows={3}
                      className="block w-full border border-gray-300 rounded-md p-3" />
            </div>
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
