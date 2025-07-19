// app/create-listing/page.tsx (or pages/create-listing.tsx if using Pages Router)

"use client"; // Only if you're using App Router

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("You must be logged in");

    const { error } = await supabase.from("listings").insert({
      title,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
      user_id: user.id,
    });

    if (error) {
      alert("Error creating listing: " + error.message);
    } else {
      setSuccess(true);
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
      {success && <p className="text-green-600 mb-4">Listing created!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="w-full border p-2"
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="w-full border p-2"
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          type="submit"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
