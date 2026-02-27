"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function FaqEditor() {
  const [data, setData] = useState({ 
      title: "Frequently Asked Questions", 
      faqs: [
        {
          question: "How long does a project take?",
          answer: "Timeline depends on the scope. Most branding projects take 2-4 weeks, while full websites may take 4-8 weeks."
        },
        {
          question: "What is your design process?",
          answer: "We start with discovery and research, move into concepts and iterations, and finalize with handoff."
        }
      ] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFaqData = async () => {
      const res = await fetch("/api/content/faq");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Object.keys(json.data).length > 0) {
            setData(json.data);
        }
      }
      setLoading(false);
    };
    fetchFaqData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      await fetch("/api/content/faq", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: data })
      });
      alert("FAQ section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const updateFaq = (index, field, value) => {
      const newList = [...data.faqs];
      newList[index][field] = value;
      setData({ ...data, faqs: newList });
  };

  const addFaq = () => {
      setData({
          ...data,
          faqs: [...data.faqs, { question: "New Question?", answer: "Answer here." }]
      });
  };

  const removeFaq = (index) => {
      const newList = data.faqs.filter((_, i) => i !== index);
      setData({ ...data, faqs: newList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold mb-6">Edit FAQ Section</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header Text */}
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input type="text" value={data.title || ""} onChange={e => setData({...data, title: e.target.value})} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        {/* Dynamic List */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold border-b pb-2">Questions & Answers</h3>
                <button type="button" onClick={addFaq} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+ Add FAQ</button>
            </div>
            
            <div className="space-y-4">
                {data.faqs?.map((faqItem, index) => (
                    <div key={index} className="flex gap-4 items-start border p-4 rounded-lg bg-gray-50">
                        <div className="flex-1 space-y-3">
                            <input type="text" value={faqItem.question} placeholder="Question?"
                                onChange={e => updateFaq(index, 'question', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2 font-medium" />
                            <textarea value={faqItem.answer} placeholder="Answer text..." rows={3}
                                onChange={e => updateFaq(index, 'answer', e.target.value)} 
                                className="block w-full border border-gray-300 rounded-md p-2 text-sm" />
                        </div>
                        <button type="button" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 mt-2">Remove</button>
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
