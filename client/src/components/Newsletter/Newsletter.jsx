import React from "react";

const Newsletter = () => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 pt-20 pb-20">
      <div className="bg-gray-900 text-white rounded-2xl px-6 py-12 md:py-16 max-w-5xl mx-auto text-center shadow-lg">
        {/* Heading & Description */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold font-serif playfair">Info & Promo Bengkel</h2>
          <p className="mt-3 text-sm md:text-base text-gray-400 outfit">
            Berlangganan buletin kami untuk menjadi yang pertama menerima penawaran servis,
            tips perawatan kendaraan, dan pembaruan terbaru dari bengkel kami.
          </p>
        </div>

        {/* Email Input & Button */}
        <form className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto outfit">
          <input
            type="email"
            placeholder="Masukkan alamat email Anda"
            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-black hover:bg-slate-950 cursor-pointer text-white font-medium px-6 py-3 rounded-md transition active:scale-95"
          >
            Berlangganan
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4" />
            </svg>
          </button>
        </form>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-500 outfit">
          Dengan berlangganan, Anda menyetujui <span className="underline cursor-pointer hover:text-white">Kebijakan Privasi</span> dan memberi izin untuk menerima informasi serta promo dari bengkel kami.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
