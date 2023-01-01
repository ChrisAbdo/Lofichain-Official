import Head from 'next/head';
import Image from 'next/image';
import audio from '../public/audio.json';
import Balancer from 'react-wrap-balancer';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Lofichain Radio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero mb-12">
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <Player
            autoplay
            loop
            src={audio}
            style={{ height: '300px', width: '300px' }}
          ></Player>

          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div>
              <h1 className="text-7xl font-bold">
                <span className="text-[#50e3c2]">Create.</span>
                <br />
                <span className="text-[#9013fe]">Listen.</span>
                <br />
                <span className="text-[#bd10e0]">Earn.</span>
              </h1>
              <p className="py-6 text-3xl max-w-md">
                <Balancer>
                  LofiChain is a Web&#40;3&#41; radio that rewards users for
                  creating and listening
                </Balancer>
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between w-full flex-1 px-20 text-center md:flex-row">
        <motion.div
          className="card w-96 bg-base-100 shadow-xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0 },
          }}
        >
          <figure className="px-10 pt-10">
            <img
              src="/upload.png"
              alt="Shoes"
              className="rounded-xl w-64 h-72"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Upload a beat!</h2>
            <p>Are you a producer? This one's for you!</p>
          </div>
        </motion.div>
        <motion.div
          className="card w-96 bg-base-100 shadow-xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0 },
          }}
        >
          <figure className="px-10 pt-10">
            <img
              src="/listen.png"
              alt="Shoes"
              className="rounded-xl w-64 h-72"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Listen to beats!</h2>
            <p>Who doesn't love some nice lofi beats?</p>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            className="card w-96 bg-base-100 shadow-xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
          >
            <figure className="px-10 pt-10">
              <img
                src="/earn.png"
                alt="Shoes"
                className="rounded-xl w-64 h-72"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Participate to earn!</h2>
              <p>Algorthmic Rewarding!</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <br />

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <h1 className="flex items-center justify-center gap-2">
          Powered by Polygon & Thirdweb
        </h1>
      </footer>
    </div>
  );
};

export default Home;
