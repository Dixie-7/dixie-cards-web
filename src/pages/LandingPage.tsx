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
      'Keep your resume available in one place and let visitors access your professional profile easily.',
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

const steps = [
  {
    label: 'Step 01',
    title: 'Create your profile',
    description:
      'Set up your basic info, presentation, links and personal configuration.',
  },
  {
    label: 'Step 02',
    title: 'Add cards and blocks',
    description:
      'Combine text, images, skills, projects and custom sections using flexible blocks.',
  },
  {
    label: 'Step 03',
    title: 'Share your portfolio',
    description:
      'Present your work, update your resume and keep your public profile ready.',
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-x-clip bg-zinc-950 text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6 pb-28 pt-32 sm:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_35%)]" />

        <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <span className="mb-6 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 shadow-lg shadow-violet-950/30">
            Portfolio builder for creators
          </span>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-white [text-wrap:balance] md:text-7xl">
            Create your portfolio like a deck of{' '}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
              living cards
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-zinc-300 [text-wrap:pretty] sm:text-lg sm:leading-8">
            Dixie Cards is a space designed for creators of all kinds to build,
            present and update their own portfolios with dynamic cards, custom
            sections, projects, skills, images and CV support.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="rounded-2xl bg-violet-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Start creating
            </button>

            <button
              type="button"
              className="rounded-2xl border border-violet-400/30 bg-zinc-900/70 px-6 py-3 font-medium text-violet-200 backdrop-blur transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Explore features
            </button>
          </div>
        </motion.div>
      </section>

      <section className="relative px-6 py-20 sm:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <h2 className="text-3xl font-bold text-violet-100 [text-wrap:balance] md:text-4xl">
              Everything your portfolio needs, without the boring template smell
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400 [text-wrap:pretty]">
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
                className="flex h-full flex-col rounded-3xl border border-violet-500/20 bg-zinc-900/70 p-6 text-center shadow-xl shadow-violet-950/20 backdrop-blur sm:text-left"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center self-center rounded-2xl bg-violet-500/15 text-violet-300 sm:self-start">
                  {index + 1}
                </div>

                <h3 className="text-lg font-semibold text-violet-100">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400 [text-wrap:pretty]">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <h2 className="text-3xl font-bold text-violet-100 [text-wrap:balance] md:text-4xl">
              Built for different kinds of creators
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400 [text-wrap:pretty]">
              Whether you write code, design interfaces, compose music, create
              content or sell freelance services, your portfolio should feel
              personal, clear and unmistakably yours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3"
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

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-violet-950/30 md:p-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
              How it works
            </span>
            <h2 className="mt-5 text-3xl font-bold text-white [text-wrap:balance] md:text-4xl">
              Build and publish your portfolio in three steps
            </h2>
            <p className="mt-4 max-w-xl text-zinc-400 [text-wrap:pretty]">
              Each step is simple, so the experience stays focused and your
              content remains the center of attention.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.label}
                className="flex h-full flex-col rounded-3xl border border-white/6 bg-white/3 p-6 text-center md:text-left"
              >
                <span className="text-sm font-medium text-violet-300">
                  {step.label}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400 [text-wrap:pretty]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.08] text-white [text-wrap:balance] md:text-5xl">
            Your portfolio should not look like it was assembled during a lunch
            break.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-zinc-400 [text-wrap:pretty]">
            Dixie Cards gives creators a flexible way to show who they are, what
            they do and why their work matters.
          </p>

          <button
            type="button"
            className="mt-6 rounded-2xl bg-violet-600 px-7 py-3 font-medium text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500"
          >
            Build your first card
          </button>
        </motion.div>
      </section>
    </main>
  );
};

export default LandingPage;
