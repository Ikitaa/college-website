import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function GalleryDetailPage() {
  const { id } = useParams();

  const [gallery, setGallery] = useState<any>(null);

  useEffect(() => {
  const fetchGallery = async () => {
    try {
      const res = await api.get(`/gallery/${id}`);
      console.log(res.data);
      setGallery(res.data.item);
    } catch (err) {
      console.error(err);
    }
  };

  fetchGallery();
}, [id]);
    

  if (!gallery) return <p>Loading...</p>;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">

      <Link
        to="/gallery"
        className="text-maroon-600 hover:underline"
      >
        ← Back to Gallery
      </Link>

      <img
        src={`http://localhost:5000${gallery.imageUrl}`}
        alt={gallery.title}
        className="mt-6 h-[450px] w-full rounded-xl object-cover"
      />

      <h1 className="mt-6 text-4xl font-bold">
        {gallery.title}
      </h1>

      <p className="mt-4 text-gray-600">
        {gallery.description}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        {new Date(gallery.createdAt).toLocaleDateString()}
      </p>

    </section>
  );
}