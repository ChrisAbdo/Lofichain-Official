import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Rewind from '../icons/Rewind';
import Play from '../icons/Play';
import Forward from '../icons/Forward';

import Eye from '../icons/Eye';
import Eyeslash from '../icons/Eyeslash';

const Alert = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <AnimatePresence>
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
      </AnimatePresence>

      <div className="hero p-12">
        <div className="card lg:card-side border border-[#2a2a2a] ">
          <figure>
            <img
              src="https://placeimg.com/400/400/arch"
              alt="."
              className="p-6"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">New album is released!</h2>
            <p>Click the button to listen on Spotiwhy app.</p>
            <div className="card-actions justify-between">
              <button className="btn btn-primary">
                <Rewind />
              </button>
              <button className="btn btn-primary">
                <Play />
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
