import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-fuchsia-800 text-white py-10  mt-16 rounded-sm">
      <div className="container mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between gap-12">
        <div>
          <h4 className="font-bold mb-4">Follow us on</h4>
          <div className="flex gap-4 mb-6 ">
            <a
              href="https://id.linkedin.com/in/stephanus-andres-785b67204"
              target="_blank"
              className="hover:text-gray-300"
            >
              <div className=" rounded-full">
                <FaLinkedin size={30} />
              </div>
            </a>
            <a
              href="https://instagram.com/_stabh"
              className="hover:text-gray-300"
              target="_blank"
            >
              <div className="rounded-full">
                <FaInstagram size={30} />
              </div>
            </a>
            <a
              href="https://youtube.com"
              className="hover:text-gray-300"
              target="_blank"
            >
              <div className="w-fit rounded-full">
                <FaYoutube size={30} />
              </div>
            </a>
            <a
              href="https://github.com/s1ncere11"
              className="hover:text-gray-300"
              target="_blank"
            >
              <div className=" rounded-full">
                <FaGithub size={30} />
              </div>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-sm">Perusahaan</h4>
          <ul className="space-y-2 text-sm">
            <li>Lorem.</li>
            <li>Lorem.</li>
            <li>Lorem, ipsum dolor.</li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="font-bold mb-4">Dukungan</h4>
          <ul className="space-y-2 text-sm">
            <li>Kategori</li>
            <li>Aktivitas</li>
            <li>Promo</li>
          </ul>
        </div>

        {/* About Us Section */}
        <div>
          <h4 className="font-bold mb-4">Tentang Kami</h4>
          <ul className="space-y-2 text-sm">
            <li>Lorem ipsum dolor sit.</li>
            <li>Lorem.</li>
            <li>Lorem.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
