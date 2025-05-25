// frontend/pages/index.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { src: "/plant_health_monitoring.png", alt: "Plant Health Analysis" },
    { src: "/chatbot_system.png", alt: "Chatbot System" },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white text-green-900 font-serif scroll-smooth">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/mrfarmer_logo_3.png" alt="Mr. Farmer" width={75} height={75} />
          <span className="font-bold text-2xl">Mr. Farmer</span>
        </div>
        <div className="hidden md:flex gap-8 text-xl items-center">
          <a href="#overview" className="hover:text-green-600">Overview</a>
          <a href="#access-farmiz" className="hover:text-green-600">Features</a>
          <a href="#plant-care-tips" className="hover:text-green-600">Plants Care Tips</a>
          <a href="#about-us" className="hover:text-green-600">About Us</a>
        </div>
        <div className="flex gap-4">
          <Link href="/farmiz-chatbot">
            <button className="flex flex-col items-center text-green-800 hover:text-green-900">
              <Image src="/chatbot_icon.png" alt="Chatbot" width={40} height={40} />
              <span className="text-sm mt-1">Farmiz</span>
            </button>
          </Link>
          <Link href="/realtime-monitoring">
            <button className="flex flex-col items-center text-green-800 hover:text-green-900">
              <Image src="/monitoring.png" alt="Monitoring" width={40} height={40} />
              <span className="text-sm mt-1">Monitoring</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Step 1 Hero Section */}
      <section className="grid md:grid-cols-2 items-center gap-8 p-12">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          <h1 className="text-8xl font-bold leading-tight">
            Healthy Plants,<br />Happy Life!
          </h1>
          <button className="bg-green-800 hover:bg-green-900 text-white py-3 px-6 rounded-full w-max">
            Your Plant’s Health Starts Here.
          </button>
          <p className="text-xl">
            Nurturing Your Plants with Smarter Care – From Real-Time Detection to Expert Advice, All in One Place.
          </p>
          {/* MMU Logo */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg">Developed by:</p>
            <Image src="/mmu_logo.png" alt="MMU Logo" width={200} height={80} />
          </div>
          {/* Two paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-base">
            <p>Each plant's health is analyzed with precision and care, ensuring accurate and reliable guidance. From real-time detection to expert advice, your plant’s well-being is our priority.</p>
            <p>Discover how we use advanced technology to monitor and safeguard your plants at every stage – from detection to providing actionable insights for optimal care.</p>
          </div>
          {/* Learn More Button */}
          <a href="#access-farmiz">
            <button className="mt-6 text-green-800 flex items-center gap-2 hover:underline">
              LEARN MORE
              <span>➔</span>
            </button>
          </a>
        </div>
        {/* Right Tomato Image */}
        <div className="flex justify-center">
          <Image src="/fresh_tomato.jpeg" alt="Tomato Plant" width={1500} height={1500} className="rounded-lg" />
        </div>
      </section>

      {/* Step 2 - Plant Health Monitoring Slider */}
      <section id="access-farmiz" className="bg-green-50 py-24">
        <div className="flex flex-col items-center gap-10">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-green-800 mb-4">Get Access To Our Plant Health System</h2>
            <p className="text-xl text-green-700">Monitor your plants, detect diseases, and receive expert advice in real-time!</p>
          </div>
          <div className="relative bg-green-800 rounded-2xl w-[1000px] h-[600px] flex items-center justify-center shadow-lg overflow-hidden">
            <div className="transition-all duration-700 ease-in-out">
              {currentSlide === 0 && (
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  width={750}
                  height={500}
                  className="rounded-xl object-contain"
                />
              )}
              {currentSlide === 1 && (
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  width={1050}
                  height={950}
                  className="rounded-xl object-contain"
                />
              )}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-6">
              <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white text-green-800 text-2xl flex items-center justify-center shadow-md hover:bg-green-300 transition">
                ◀
              </button>
              <button onClick={handleNext} className="w-12 h-12 rounded-full bg-white text-green-800 text-2xl flex items-center justify-center shadow-md hover:bg-green-300 transition">
                ▶
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 - Plant Care Tips Static Section */}
      <section id="plant-care-tips" className="bg-white py-24 px-8">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto flex flex-col gap-4">

          {/* OUR TOOLS */}
          <p className="text-green-800 uppercase tracking-widest text-sm font-semibold">
            Our Tools
          </p>

          {/* Title */}
          <h2 className="text-5xl font-bold text-green-900 font-serif">
            Discover expert tips and advice
          </h2>

          {/* Subtitle */}
          <p className="text-green-700 text-lg mt-2">
            to nurture your plants and keep them flourishing.
          </p>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            
            {/* Card 1 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[300px] overflow-hidden rounded-2xl shadow-md">
                <Image src="/healthy_apple.jpg" alt="Light" width={400} height={300} className="object-cover w-full h-full" />
              </div>
              <div className="bg-green-300 p-4 rounded-lg mt-4 w-full text-center">
                <h3 className="font-bold text-green-800">Light:</h3>
                <p className="text-green-800 text-sm mt-1">
                  Place plants in indirect sunlight for optimal growth.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[300px] overflow-hidden rounded-2xl shadow-md">
                <Image src="/healthy_orange.jpg" alt="Fertilizing" width={400} height={300} className="object-cover w-full h-full" />
              </div>
              <div className="bg-green-300 p-4 rounded-lg mt-4 w-full text-center">
                <h3 className="font-bold text-green-800">Fertilizing:</h3>
                <p className="text-green-800 text-sm mt-1">
                  Feed plants every 4-6 weeks with a balanced fertilizer.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[300px] overflow-hidden rounded-2xl shadow-md">
                <Image src="/healthy_tomato.jpg" alt="Humidity" width={400} height={300} className="object-cover w-full h-full" />
              </div>
              <div className="bg-green-300 p-4 rounded-lg mt-4 w-full text-center">
                <h3 className="font-bold text-green-800">Humidity:</h3>
                <p className="text-green-800 text-sm mt-1">
                  Mist tropical plants regularly to maintain humidity.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[300px] overflow-hidden rounded-2xl shadow-md">
                <Image src="/healthy_peach.jpg" alt="Temperature" width={400} height={300} className="object-cover w-full h-full" />
              </div>
              <div className="bg-green-300 p-4 rounded-lg mt-4 w-full text-center">
                <h3 className="font-bold text-green-800">Temperature:</h3>
                <p className="text-green-800 text-sm mt-1">
                  Keep plants in warm environments, avoid cold drafts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* Step 4 - About Us Section */}
      <section id="about-us" className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">

          {/* About Us Title */}
          <div>
            <h2 className="text-4xl font-bold text-green-900 mb-8">
              About Us – Who are we
            </h2>

            {/* Row 1: Left Image + Right Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Image */}
              <div>
                <Image src="/farmers.jpg" alt="Farmers" width={600} height={400} className="rounded-2xl object-cover" />
              </div>

              {/* Text */}
              <div className="text-green-800 text-lg leading-relaxed">
                <p>
                  Welcome to Mr. Farmer, your trusted platform for smarter plant care and health monitoring.
                  At Mr. Farmer, we are passionate about helping farmers, gardeners, and plant enthusiasts achieve
                  healthier plants with ease. Whether you're managing a farm or nurturing a home garden, our innovative
                  tools and insights are here to support you every step of the way.
                </p>
              </div>
            </div>

            {/* Row 2: Left Text + Right Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-16">
              {/* Text */}
              <div className="text-green-800 text-lg leading-relaxed">
                <p>
                  Our website combines the power of Real-Time Disease Detection and our intelligent chatbot, Farmiz,
                  to bring you the best plant care experience. With advanced AI technologies, we provide real-time
                  analysis to detect plant health issues and offer actionable solutions. Through Farmiz, you can access
                  instant advice, plant care tips, and tailored recommendations to ensure your plants thrive.
                </p>
              </div>

              {/* Image */}
              <div>
                <Image src="/plant_and_ai.jpg" alt="Plant and AI" width={600} height={400} className="rounded-2xl object-cover" />
              </div>
            </div>

            {/* Row 3: Left Image + Right Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-16">
              {/* Image */}
              <div>
                <Image src="/bridge_nature.jpg" alt="Bridge Nature" width={600} height={400} className="rounded-2xl object-cover" />
              </div>

              {/* Text */}
              <div className="text-green-800 text-lg leading-relaxed">
                <p>
                  At Mr. Farmer, we aim to bridge technology and nature, making plant care accessible and efficient
                  for everyone. Our mission is to promote sustainable agriculture and empower individuals to grow
                  healthier, greener plants.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer - Only Center Mr Farmer Logo */}
      <footer className="py-8">
        <div className="flex justify-center items-center">
          <Image src="/mrfarmer_logo_3.png" alt="Mr. Farmer Logo" width={80} height={80} />
          <span className="font-bold text-2xl">Mr. Farmer</span>
        </div>
      </footer>
    </div>
  );
}
