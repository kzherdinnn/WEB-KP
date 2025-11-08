import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const ArticleDetail = () => {
  const { id } = useParams();

  // Sample article data (in real app, fetch from API based on id)
  const articles = {
    1: {
      id: 1,
      title: "10 Tips for Choosing the Perfect Hotel Room",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
      author: "Sarah Johnson",
      authorBio: "Travel Expert & Hotel Consultant",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Travel Tips",
      categoryColor: "bg-blue-500",
      content: `
        <p class="mb-6">Choosing the perfect hotel room can make or break your travel experience. Whether you're traveling for business or pleasure, the right accommodation sets the tone for your entire trip. Here are 10 essential tips to help you make the best choice.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Location is Everything</h2>
        <p class="mb-6">The location of your hotel can significantly impact your travel experience. Consider proximity to attractions, business districts, or transportation hubs. A central location might cost more, but it can save time and transportation costs.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Read Reviews Carefully</h2>
        <p class="mb-6">Don't just look at the star rating—read actual guest reviews. Pay attention to recent reviews and look for patterns in feedback. Focus on aspects that matter most to you, whether it's cleanliness, service, or noise levels.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Check Room Amenities</h2>
        <p class="mb-6">Make sure the room has everything you need. Consider Wi-Fi speed, air conditioning, workspace, minibar, and bathroom facilities. Don't assume all rooms have the same amenities—always verify before booking.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Compare Photos with Reality</h2>
        <p class="mb-6">Hotel photos can be misleading. Look for guest photos on review sites to get a more realistic view. Pay attention to room size, natural lighting, and actual condition of furnishings.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Consider the View</h2>
        <p class="mb-6">Room views can vary dramatically within the same hotel. If a view is important to you, specify your preference when booking. Be aware that rooms with better views typically cost more.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Floor Level Matters</h2>
        <p class="mb-6">Higher floors usually mean less noise from street traffic but might take longer to access. Lower floors offer easier evacuation in emergencies but can be noisier. Choose based on your priorities.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Check Cancellation Policies</h2>
        <p class="mb-6">Plans can change unexpectedly. Always understand the cancellation policy before booking. Flexible rates might cost slightly more but provide peace of mind if you need to change plans.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Join Loyalty Programs</h2>
        <p class="mb-6">Hotel loyalty programs often provide free upgrades, early check-in, and late checkout. Even if you don't travel frequently, these perks can significantly enhance your stay.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Book Directly When Possible</h2>
        <p class="mb-6">While third-party sites might seem cheaper, booking directly with the hotel can offer benefits like room upgrades, flexible cancellation, and better customer service if issues arise.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Ask About Special Requests</h2>
        <p class="mb-6">Don't hesitate to make special requests—whether it's a quiet room, extra pillows, or a specific floor. Hotels want to ensure your satisfaction and will often accommodate reasonable requests.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Conclusion</h2>
        <p class="mb-6">Choosing the perfect hotel room requires research and careful consideration, but it's worth the effort. By following these tips, you'll increase your chances of finding accommodation that meets your needs and enhances your travel experience. Remember, the perfect room for you depends on your personal preferences and travel priorities.</p>
      `,
    },
    2: {
      id: 2,
      title: "Hidden Gems: Exploring Local Attractions Near Your Hotel",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=600&fit=crop",
      author: "Michael Chen",
      authorBio: "Local Travel Guide & Cultural Explorer",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Destinations",
      categoryColor: "bg-emerald-500",
      content: `
        <p class="mb-6">One of the joys of travel is discovering hidden gems that aren't in every guidebook. These local treasures often provide the most authentic and memorable experiences. Let's explore how to find and enjoy these special places near your hotel.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Ask the Hotel Staff</h2>
        <p class="mb-6">Your hotel's concierge and staff are invaluable resources. They live and work in the area and often know the best local spots that tourists miss. Don't be shy—ask for their personal recommendations.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Explore on Foot</h2>
        <p class="mb-6">Walking is the best way to discover a neighborhood's character. Take morning or evening strolls, venture down side streets, and follow your curiosity. You'll often stumble upon charming cafes, local markets, and interesting architecture.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Visit Local Markets</h2>
        <p class="mb-6">Local markets are windows into daily life. Whether it's a farmer's market, flea market, or food market, these spaces offer authentic interactions with locals and unique finds you won't see in tourist shops.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Try Neighborhood Restaurants</h2>
        <p class="mb-6">Skip the famous tourist restaurants and eat where locals eat. Look for busy, smaller establishments away from main tourist areas. The food is often better and more affordable, and you'll experience authentic local cuisine.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Conclusion</h2>
        <p class="mb-6">Discovering hidden gems near your hotel adds depth and authenticity to your travel experience. These local treasures create memories that last long after your trip ends.</p>
      `,
    },
    3: {
      id: 3,
      title: "Business Travel Made Easy: Productivity Hacks",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=600&fit=crop",
      author: "David Rodriguez",
      authorBio: "Business Travel Consultant",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Business Travel",
      categoryColor: "bg-purple-500",
      content: `
        <p class="mb-6">Business travel can be challenging, but with the right strategies, you can stay productive and comfortable. Here are proven hacks to make your business trips more efficient and less stressful.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Pack Smart and Light</h2>
        <p class="mb-6">Invest in quality, versatile business attire and a good carry-on bag. Pack everything you need for a week in a carry-on to avoid checked baggage delays. Use packing cubes to stay organized.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Choose Hotels Strategically</h2>
        <p class="mb-6">Select hotels near your meeting locations with good work facilities. Look for properties with reliable Wi-Fi, comfortable workspaces, and 24-hour business centers. Join hotel loyalty programs for consistent experiences.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Maximize Travel Time</h2>
        <p class="mb-6">Use flight time for focused work or rest. Download documents offline, bring noise-canceling headphones, and turn off notifications. Airport lounges offer quiet spaces for calls and work between flights.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Maintain Your Routine</h2>
        <p class="mb-6">Try to maintain your regular sleep, exercise, and meal schedules. This helps manage jet lag and keeps you performing at your best. Many hotels have gyms or you can do quick workouts in your room.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Conclusion</h2>
        <p class="mb-6">With these productivity hacks, business travel becomes more manageable and efficient. Remember, taking care of yourself is crucial for maintaining high performance during trips.</p>
      `,
    },
  };

  const article = articles[id] || articles[1];

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle} ${shareUrl}`,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] md:h-[70vh] overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 lg:left-16 z-10">
          <a
            href="/articles"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-semibold outfit hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </a>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className={`${article.categoryColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg outfit inline-block mb-4`}
              >
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 outfit">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm outfit">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{article.author}</p>
                    <p className="text-xs text-white/70">{article.authorBio}</p>
                  </div>
                </div>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  {article.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700 outfit">
              Bagikan:
            </span>
            <div className="flex gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none outfit"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              color: "#4B5563",
              lineHeight: "1.8",
            }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 outfit">
                Tags:
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                Travel Tips
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                Hotel Guide
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm outfit">
                Accommodation
              </span>
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-12 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 outfit">
                  {article.author}
                </h3>
                <p className="text-sm text-gray-600 mb-4 outfit">
                  {article.authorBio}
                </p>
                <p className="text-gray-700 leading-relaxed outfit">
                  Passionate about sharing travel insights and helping people
                  make the most of their journeys. With years of experience in
                  the hospitality industry, I love discovering and sharing the
                  best travel tips.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Articles */}
          <div className="mt-12 text-center">
            <a
              href="/articles"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg outfit hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FaArrowLeft className="w-5 h-5" />
              <span>Lihat Artikel Lainnya</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;
