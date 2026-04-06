const [language, setLanguage] = useState("python-3.14");
const [code, setCode] = useState("");
const [output, setOutput] = useState("");
const [loading, setLoading] = useState(false);

const handleRun = async () => {
  setLoading(true);
  setOutput("");

  try {
    const res = await fetch("http://localhost:5000/code/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
        input: "",
      }),
    });

    const data = await res.json();

    // Always make output a string
    if (data.error) {
      setOutput(
        typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error, null, 2),
      );
    } else if (data.output) {
      setOutput(
        typeof data.output === "string"
          ? data.output
          : JSON.stringify(data.output, null, 2),
      );
    } else {
      setOutput("No output returned");
    }
  } catch (err) {
    setOutput("Error connecting to server");
  }

  setLoading(false);
};
return (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <NavBar />
    <h1 className="text-3xl font-bold mb-6 text-center">⚡ Online Compiler</h1>

    {/* Top Bar */}
    <div className="flex justify-between items-center mb-4">
      {/* Language Dropdown */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600"
      >
        <option value="python-3.14">Python</option>
        <option value="g++-15">C++</option>
        <option value="gcc-15">C</option>
        <option value="openjdk-25">Java</option>
      </select>

      {/* Run Button */}
      <button
        onClick={handleRun}
        className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold"
      >
        {loading ? "Running..." : "Run ▶"}
      </button>
    </div>

    {/* Main Layout */}
    <div className="grid grid-cols-2 gap-4 h-[70vh]">
      {/* Code Editor */}
      <div className="flex flex-col">
        <h2 className="mb-2 font-semibold">Code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-gray-800 p-4 rounded-lg border border-gray-700 resize-none font-mono"
          placeholder="Write your code here..."
        />
      </div>

      {/* Output Window */}
      <div className="flex flex-col">
        <h2 className="mb-2 font-semibold">Output</h2>
        <div className="flex-1 bg-black p-4 rounded-lg border border-gray-700 overflow-auto font-mono">
          {output || "Output will appear here..."}
        </div>
      </div>
    </div>
  </div>
);
