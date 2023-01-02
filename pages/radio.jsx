import Link from 'next/link';
import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import Rewind from '../icons/Rewind';
import Forward from '../icons/Forward';

import Eye from '../icons/Eye';
import Eyeslash from '../icons/Eyeslash';

const Alert = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {isOpen ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="alert shadow-lg border-b border-[#2a2a2a] alert1"
        >
          <Link href="/upload">
            <div>
              <span>
                Hey there! Want to upload your own beats? Check out the{' '}
                <span className="link"> upload page!</span>
              </span>
            </div>
          </Link>

          <div className="flex-none">
            <button onClick={() => setIsOpen(false)} className="btn btn-sm">
              <Eye />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="alert shadow-lg bg-black">
          <div />
          <div className="flex-none">
            <button onClick={() => setIsOpen(true)} className="btn btn-sm">
              <Eyeslash />
            </button>
          </div>
        </div>
      )}

      <div className="hero p-12">
        <div className="card lg:card-side border border-[#2a2a2a] ">
          <figure>
            <img
              src="https://placeimg.com/400/400/arch"
              alt="."
              className="p-6"
            />
          </figure>
          <div className="card-body space-y-4">
            <h2 className="card-title text-center items-center justify-center">
              New album is released!
            </h2>
            <p className="text-center items-center justify-center">
              AUTHOR PLACEHOLDER{' '}
            </p>

            {/* music timeline to show how long the song is */}
            <progress className="progress" value="100" max="100"></progress>

            <div className="card-actions justify-between">
              <button className="btn btn-primary">
                <Rewind />
              </button>
              <button className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                  />
                </svg>
              </button>
              <button className="btn btn-primary">
                <Forward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
