import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../lib/api";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  eventDate?: string;
  featured: boolean;
  isActive: boolean;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await api.get("/gallery");

      const activeItems = res.data.items.filter(
        (item: GalleryItem) => item.isActive
      );

      setGallery(activeItems);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-maroon-700">
            Gallery
          </h1>

          <p className="mt-6 text-gray-500">
            Loading gallery...
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,16,31,0.75), rgba(92,16,31,0.75)), url('/college-photo2.jpg')",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-5xl font-bold text-white">
            Campus Gallery
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-maroon-100">
            Explore memorable moments from Padma Kanya Multiple Campus,
            including academic activities, campus life, sports,
            graduation ceremonies, cultural programs and events.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4">

          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl font-bold text-maroon-700">
              Our Gallery
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              Browse photos from campus events, classrooms, student
              activities, graduation ceremonies, sports competitions,
              cultural programs and many more memorable moments.
            </p>
          </div>

          {gallery.length === 0 ? (
            <div className="rounded-xl bg-white py-20 text-center shadow">
              <h3 className="text-2xl font-semibold text-gray-700">
                No gallery available
              </h3>

              <p className="mt-3 text-gray-500">
                Please check again later.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {gallery.map((item) => (
                <Link
                  key={item._id}
                  to={`/gallery/${item._id}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />

                    {item.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white shadow">
                        Featured
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 rounded-full bg-maroon-700 px-3 py-1 text-xs font-semibold text-white">
                      {item.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-ink-900">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                    )}

                    {item.eventDate && (
                      <p className="mt-5 text-sm font-medium text-maroon-600">
                        📅{" "}
                        {new Date(item.eventDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}

            </div>
          )}
        </div>
      </section>
    </>
  );
}