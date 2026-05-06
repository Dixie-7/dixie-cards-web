import { motion } from 'motion/react';

const features = [
  {
    title: 'Custom portfolios',
    description:
      'Build a personal portfolio with cards, blocks, images, text sections and flexible layouts.',
  },
  {
    title: 'CV upload',
    description:
      'Keep your résumé available in one place and let visitors access your professional profile easily.',
  },
  {
    title: 'Dynamic cards',
    description:
      'Create different types of cards: introductions, skills, projects, experiences and more.',
  },
  {
    title: 'Easy editing',
    description:
      'Update your content whenever you want without rebuilding your whole portfolio from scratch.',
  },
];

const creatorTypes = [
  'Developers',
  'Designers',
  'Musicians',
  'Writers',
  'Artists',
  'Freelancers',
];

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_35%)]" />

        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          <span className="mb-6 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 shadow-lg shadow-violet-950/30">
            Portfolio builder for creators
          </span>

          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            Create your portfolio like a deck of{' '}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
              living cards
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Dixie Cards is a space designed for creators of all kinds to build,
            present and update their own portfolios with dynamic cards, custom
            sections, projects, skills, images and CV support.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-violet-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500">
              Start creating
            </button>

            <button className="rounded-2xl border border-violet-400/30 bg-zinc-900/70 px-6 py-3 font-medium text-violet-200 backdrop-blur transition hover:-translate-y-0.5 hover:bg-zinc-800">
              Explore features
            </button>
          </div>
        </motion.div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl font-bold text-violet-100 md:text-4xl">
              Everything your portfolio needs, without the boring template smell
            </h2>

            <p className="mt-4 text-zinc-400">
              Instead of forcing every creator into the same layout, Dixie Cards
              lets each profile grow through customizable cards and content
              blocks.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-3xl border border-violet-500/20 bg-zinc-900/70 p-6 shadow-xl shadow-violet-950/20 backdrop-blur"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                  {index + 1}
                </div>

                <h3 className="text-lg font-semibold text-violet-100">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl font-bold text-violet-100 md:text-4xl">
              Built for different kinds of creators
            </h2>

            <p className="mt-4 text-zinc-400">
              Whether you write code, design interfaces, compose music, create
              content or sell freelance services, your portfolio should feel
              like yours. No generic beige nonsense. Estamos grandes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {creatorTypes.map((type) => (
              <div
                key={type}
                className="rounded-2xl border border-violet-400/20 bg-zinc-900/80 px-4 py-5 text-center text-sm font-medium text-violet-100 shadow-lg shadow-violet-950/20"
              >
                {type}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-violet-950/30 md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <span className="text-sm font-medium text-violet-300">
                Step 01
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Create your profile
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Set up your basic info, presentation, links and personal
                configuration.
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-violet-300">
                Step 02
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Add cards and blocks
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Combine text, images, skills, projects and custom sections using
                flexible blocks.
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-violet-300">
                Step 03
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Share your portfolio
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Present your work, update your CV and keep your public profile
                ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Your portfolio should not look like it was assembled during a lunch break.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Dixie Cards gives creators a flexible way to show who they are, what
            they do and why their work matters.
          </p>

          <button className="mt-8 rounded-2xl bg-violet-600 px-7 py-3 font-medium text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500">
            Build your first card
          </button>
        </motion.div>
      </section>
    </main>
  );
};

export default LandingPage;