import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Notes App. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/Brice-art/NotesApp"
              className="text-white hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/brice-ali-byiringiro-ab1182254/"
              className="text-white hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
