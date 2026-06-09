import { useState } from "react";

export default function Generate({ token }) {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const generate = async () => {
    if (!productName || !features) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_name: productName,
            features,
          }),
        }
      );

      const data = await res.json();
      setResult(data.generated_text);
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
    alert("Copied!");
  };

  // Save to Products
  const saveToProducts = async () => {
    try {
      setSaving(true);

      await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          price: parseFloat(price) || 0,
          description: result,
        }),
      });

      setSaveMessage("Saved to Products ✅");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white shadow-lg rounded-2xl p-8">

          <h2 className="text-3xl font-bold mb-2">
            AI Product Generator
          </h2>

          <p className="text-gray-500 mb-6">
            Generate and save products to your catalog
          </p>

          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name"
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full border p-3 rounded-xl mb-4"
          />

          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Features"
            className="w-full border p-3 rounded-xl mb-4"
            rows="5"
          />

          <p className="text-sm text-gray-500 mb-4">
            {features.length} characters
          </p>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={() => {
              setProductName("");
              setFeatures("");
              setResult("");
            }}
            className="w-full mt-2 border border-gray-300 py-3 rounded-xl"
          >
            Clear
          </button>

          {result && (
            <div className="mt-6">

              <h3 className="font-semibold mb-2">
                Generated Description
              </h3>

              <div className="bg-gray-50 border p-4 rounded-xl whitespace-pre-line">
                {result}
              </div>

              <button
                onClick={copyText}
                className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg"
              >
                Copy Description
              </button>

              <button
                onClick={saveToProducts}
                disabled={saving}
                className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                {saving ? "Saving..." : "Save to Products"}
              </button>

              {saveMessage && (
                <p className="text-green-600 mt-3">{saveMessage}</p>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}