import { useEffect, useState } from "react";

export default function Dashboard({ token }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const recentActivity = history.slice(0, 5);
  
  const [stats, setStats] = useState({
    total_generations: 0,
    total_products: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        await Promise.all([
          loadHistory(),
          loadStats(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.product_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const loadHistory = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("History response:", data);

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error("Expected array:", data);
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("Stats:", data);

      if (!res.ok) {
        console.error("Stats error:", data);
        return;
      }

      setStats(data);

    } catch (err) {
      console.error(err);
    }
  };

  const deleteAllHistory = async () => {
    if (!window.confirm("Delete all history?")) {
      return;
    }
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/history`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
           <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Dashboard
           </h1>

           <p className="text-gray-500 text-lg">
              Manage AI-generated product content and track your usage.
           </p>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-6"
          />

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Delete all generation history?"
                )
              ) {
                deleteAllHistory();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium transition mt-5"
          >
            Delete All
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6">
            <p className="text-gray-500 text-sm">
              Total Products
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {stats.total_products}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6">
            <p className="text-gray-500 text-sm">
              Total Generations
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {stats.total_generations}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6">
            <p className="text-gray-500 text-sm">
              Recent Activity
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {recentActivity.length}
            </h3>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">

          {/* Recent Activity Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

             <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold mb-4">
                Recent Activity
              </h3>

              <span className="text-sm text-gray-400">
                Last 5 actions
              </span>
            </div>

            {recentActivity.length === 0 ? (
              <p className="text-gray-500">
                No activity yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>
                      Generated description for
                      <strong> {item.product_name}</strong>
                    </span>

                    <span className="text-gray-400 text-sm">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Summary Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4">
              Usage Summary
            </h3>

            <div className="space-y-4">

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">
                    AI Generations
                  </span>

                  <span className="font-medium">
                    {stats.total_generations}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        stats.total_generations * 10,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">
                    Products
                  </span>

                  <span className="font-medium">
                    {stats.total_products}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        stats.total_products * 10,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-3xl font-bold">
              Generation History
            </h2>

            <p className="text-gray-500 mt-1">
              Browse all generated descriptions
            </p>
          </div>

        </div>

        {/* Empty state */}
        {history.length === 0 ? (
          <div className="text-center mt-24">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-500 text-lg">
              No history yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Generate your first product description to see it here
            </p>
          </div>
        ) : (
          
          <div className="grid gap-6 md:grid-cols-2">

            {filteredHistory.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  No matching products found
                </p>
              </div>
            ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6"
              >

                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product_name}
                    </h3>
                    <span className=" inline-block mt-2 px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full ">
                      AI Generated
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>

                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Features
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    {item.features}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    AI Description
                  </p>
                  <div className="mt-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {item.text}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(item.text)
                      }
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Copy
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(
                          `${import.meta.env.VITE_API_URL}/history/${item.id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        setHistory((prev) =>
                          prev.filter((h) => h.id !== item.id)
                        );
                      }}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

          </div>
        )}

      </div>
    </div>
  );
}