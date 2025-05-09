import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ pakai App Router
import { FaSearch } from "react-icons/fa";
import Footer from "./Footer";

export default function ActivityList({ selectedCategory }) {
  const [activities, setActivities] = useState([]);
  const router = useRouter(); // ✅ router instance
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const json = await res.json();
        setActivities(json.data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchCategory = selectedCategory
      ? activity.category?.id === selectedCategory
      : true;

    const matchSearch = activity.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const handleViewTrip = (activity) => {
    router.push(`/activity/${activity.id}`); // ✅ redirect ke halaman detail
  };

  return (
    <div>
      <div className="mb-6 w-full md:w-1/2 relative mt-8">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 items-center flex justify-center" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Mau liburan dimana?"
          className="w-full pl-10 pr-4 py-3 border  border-gray-300 rounded-lg text-sm shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative">
              <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                {activity.duration || "x days"}
              </span>
              <img
                src={
                  activity.imageUrls[0] && activity.imageUrls[0].trim() !== ""
                    ? activity.imageUrls[0]
                    : "/catbg.jpg"
                }
                alt={activity.title}
                className="w-full h-56 object-cover transition duration-300 transform hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/catbg.jpg";
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-fuchsia-600 transition duration-200">
                {activity.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Countries:</strong> {activity.category?.name}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Age Range:</strong> {activity.age_range || "18 - 35"}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-fuchsia-700">
                  IDR {new Intl.NumberFormat("id-ID").format(activity.price)}
                </p>
                <button
                  className="px-6 py-2 bg-fuchsia-800 text-white rounded-full shadow-md hover:cursor-pointer hover:bg-gradient-to-r from-purple-800 to-fuchsia-700 hover:shadow-xl transition duration-300"
                  onClick={() => handleViewTrip(activity)}
                >
                  View Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
