
import { Link } from "react-router-dom";
import { MdPets, MdFavorite, MdRestaurant, MdShoppingBag, MdArrowForward } from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";

const SERVICES = [
  {
    icon: MdFavorite,
    title: "Pet Adoption",
    description:
      "Discover pets looking for a loving home and take the first step toward a responsible adoption.",
  },
  {
    icon: MdRestaurant,
    title: "Pet Food",
    description:
      "Explore food options designed to support your pet’s nutrition, energy, and everyday well-being.",
  },
  {
    icon: MdShoppingBag,
    title: "Pet Accessories",
    description:
      "Find everyday essentials, toys, grooming products, and accessories to keep your pet comfortable.",
  },
];

const AboutUs = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-base-200 text-neutral dark:bg-neutral dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <MdPets size={34} aria-hidden="true" />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Get to know us
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            About <span className="text-indigo-600 dark:text-indigo-400">PawMart</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Your trusted place to discover pets, explore pet essentials, and
            make everyday pet care easier. We bring pet lovers and their needs
            together in one convenient place.
          </p>
        </motion.section>

        {/* Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="mb-16 grid items-center gap-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-9 lg:mb-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-12"
        >
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              Why PawMart?
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Every pet deserves love, care, and a safe home.
            </h2>
          </div>

          <div className="space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            <p>
              Our mission is to make pet ownership more convenient, enjoyable,
              and responsible. PawMart brings pet discovery, adoption, food,
              and accessories together to help pet owners find what they need.
            </p>
            <p>
              We believe caring for a pet means more than meeting everyday
              needs. It means building a lasting bond, making informed
              decisions, and creating a safe and loving environment for every
              animal.
            </p>
          </div>
        </motion.section>

        {/* Services */}
        <section className="mb-16 sm:mb-20">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              What we offer
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Everything for happier pets
            </h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Thoughtful essentials and helpful ways to make life with your pet
              better.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                  }}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/40 dark:hover:shadow-black/20 sm:p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                    <Icon size={25} aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {service.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Call to action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 text-center text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[32px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-indigo-500/60"
          />

          <div className="relative mx-auto max-w-2xl">
            <MdPets
              className="mx-auto mb-4 text-indigo-100"
              size={36}
              aria-hidden="true"
            />

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Join the PawMart Family
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-indigo-100 sm:text-lg">
              Find your next companion, discover pet essentials, and make every
              moment with your pet count.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 shadow-sm transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 active:translate-y-0"
            >
              Get Started
              <MdArrowForward size={20} aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
