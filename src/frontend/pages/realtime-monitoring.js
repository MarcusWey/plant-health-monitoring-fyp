import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RealTimeMonitoring() {
  const [webcamActive, setWebcamActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [status, setStatus] = useState("stopped");

  const startWebcam = async () => {
    try {
      await fetch("http://127.0.0.1:8000/realtime/start-webcam", { method: "POST" });
      setWebcamActive(true);
      setStatus("running");
    } catch (error) {
      console.error("Failed to start webcam:", error);
    }
  };

  const stopWebcam = async () => {
    try {
      await fetch("http://127.0.0.1:8000/realtime/stop-webcam", { method: "POST" });
    } catch (error) {
      console.error("Failed to stop webcam:", error);
    } finally {
      setWebcamActive(false);
      setStatus("stopped");
    }
  };

  const pollLatestDetections = async () => {
    try {
      const idRes = await fetch("http://127.0.0.1:8000/realtime/latest-id");
      const idData = await idRes.json();
      const latestId = idData.latest_id;

      if (!latestId || detections.some(d => d.id === latestId)) return;

      const resultRes = await fetch(`http://127.0.0.1:8000/realtime/result?id=${latestId}`);
      const resultData = await resultRes.json();
      setDetections(prev => [...prev, resultData]);
    } catch (error) {
      console.warn("Polling error:", error);
    }
  };

  useEffect(() => {
    if (webcamActive) {
      const interval = setInterval(pollLatestDetections, 3000);
      return () => clearInterval(interval);
    }
  }, [webcamActive, detections]);

  const clearDetections = () => {
    setDetections([]);
  };

  return (
    <div className="min-h-screen bg-white text-green-900 font-serif">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/mrfarmer_logo_3.png" alt="Mr. Farmer" width={75} height={75} />
          <span className="font-bold text-2xl">Mr. Farmer</span>
        </div>
        <div className="hidden md:flex gap-8 text-xl">
          <Link href="/#overview"><p className="hover:text-green-600">Overview</p></Link>
          <Link href="/#access-farmiz"><p className="hover:text-green-600">Features</p></Link>
          <Link href="/#plant-care-tips"><p className="hover:text-green-600">Plants Care Tips</p></Link>
          <Link href="/#about-us"><p className="hover:text-green-600">About Us</p></Link>
        </div>
        <div className="flex gap-4">
          <Link href="/farmiz-chatbot">
            <button className="flex flex-col items-center">
              <Image src="/chatbot_icon.png" alt="Chatbot" width={40} height={40} />
              <span className="text-sm">Farmiz</span>
            </button>
          </Link>
          <Link href="/realtime-monitoring">
            <button className="flex flex-col items-center">
              <Image src="/monitoring.png" alt="Monitoring" width={40} height={40} />
              <span className="text-sm">Monitoring</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Status */}
      <div className="flex justify-center my-4">
        <span className={`text-xl font-bold ${status === "running" ? "text-green-600" : "text-red-600"}`}>
          {status === "running" ? "🟢 Webcam Running" : "🔴 Webcam Stopped"}
        </span>
      </div>

      {/* Main Content */}
      <section className="flex flex-col lg:flex-row p-8 gap-6">
        {/* Webcam */}
        <div className="flex flex-col flex-1 bg-gray-100 p-4 rounded-lg">
          {webcamActive ? (
            <img
              src="http://127.0.0.1:8000/realtime/video"
              alt="Live Webcam"
              className="w-full h-[600px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[600px] flex items-center justify-center">
              <Image src="/no_web_cam.png" alt="No Webcam" width={200} height={200} />
            </div>
          )}
          <div className="flex justify-center mt-4">
            {webcamActive ? (
              <button onClick={stopWebcam} className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700">
                Stop Webcam
              </button>
            ) : (
              <button onClick={startWebcam} className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800">
                Start Webcam
              </button>
            )}
          </div>
        </div>

        {/* Detection Results */}
        <div className="w-full lg:w-1/3 bg-green-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detection Results</h2>
            <button onClick={clearDetections} className="text-red-600 hover:underline text-sm">
              Clear
            </button>
          </div>

          {detections.length > 0 ? (
            <div className="flex flex-col gap-4">
              {detections.map((det, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow">
                  <p><strong>ID:</strong> {det.id}</p>
                  <p><strong>Plant:</strong> {det.plant}</p>
                  <p><strong>Disease:</strong> {det.status}</p>
                  <p><strong>Confidence:</strong> {det.confidence}%</p>
                  <p className="mt-2 text-green-700">{det.prescription}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No detections yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
