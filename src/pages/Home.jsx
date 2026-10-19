
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaBone,
  FaShoppingBag,
  FaMedkit,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaHandsHelping,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

import RecentListings from "../components/RecentListings";
import FAQ from "./FAQ";
import Newsletter from "./Newsletter";

const SLIDE_INTERVAL = 5500;
const TRANSITION_DURATION = 0.8;

const BANNERS = [
  {
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=2000&q=85",
    alt: "Golden retriever enjoying a peaceful moment outdoors",
    eyebrow: "WELCOME TO PAWMART",
    title: "Find Your Furry Friend Today.",
    description:
      "Discover loving companions, quality pet essentials, and everything your pets need for a happier life.",
    primaryLabel: "Explore Listings",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "About PawMart",
    secondaryLink: "/about-us",
  },
  {
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2000&q=85",
    alt: "Cat looking curiously toward the camera",
    eyebrow: "EVERY PET DESERVES LOVE",
    title: "A Little Love Changes Everything.",
    description:
      "Meet your next companion and discover the joy of giving a pet a caring home.",
    primaryLabel: "Find a Pet",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "About Adoption",
    secondaryLink: "/about-us",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=2000&q=85",
    alt: "Happy dog enjoying time outdoors",
    eyebrow: "CARE STARTS HERE",
    title: "Everything Your Pet Needs, In One Place.",
    description:
      "Explore pet food, accessories, and care essentials for every stage of your pet's life.",
    primaryLabel: "Browse Listings",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "Explore Categories",
    secondaryLink: "/#categories",
  },
  {
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=2000&q=85",
    alt: "Cat relaxing comfortably at home",
    eyebrow: "FOR THE LOVE OF CATS",
    title: "Your Next Best Friend Is Waiting.",
    description:
      "Explore pet listings and find a companion that fits your home and lifestyle.",
    primaryLabel: "Find a Companion",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "Learn More",
    secondaryLink: "/about-us",
  },
  {
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2000&q=85",
    alt: "Dogs spending time together outdoors",
    eyebrow: "CARE THAT COMES FROM THE HEART",
    title: "Every Pet Deserves a Loving Home.",
    description:
      "Discover adoption opportunities and help pets find caring families.",
    primaryLabel: "Explore Pets",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "Our Mission",
    secondaryLink: "/about-us",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=2000&q=85",
    alt: "Dog enjoying quality time with its owner",
    eyebrow: "HAPPY PETS, HAPPY HOMES",
    title: "Make Every Moment More Paw-some.",
    description:
      "Discover useful products and everyday essentials for your beloved companions.",
    primaryLabel: "Browse Listings",
    primaryLink: "/pets&Supplies",
    secondaryLabel: "About PawMart",
    secondaryLink: "/about-us",
  },
];

const CATEGORIES = [
  {
    name: "Pets",
    description: "Find a companion to love.",
    value: "Pets",
    Icon: FaPaw,
    iconClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  {
    name: "Pet Food",
    description: "Nutrition for happier pets.",
    value: "Food",
    Icon: FaBone,
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  },
  {
    name: "Accessories",
    description: "Everyday essentials and more.",
    value: "Accessories",
    Icon: FaShoppingBag,
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    name: "Pet Care Products",
    description: "Support a healthy, happy life.",
    value: "Care Products",
    Icon: FaMedkit,
    iconClass:
      "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
];

const BENEFITS = [
  {
    Icon: FaHeart,
    title: "Compassion First",
    description:
      "Encourage responsible adoption and help pets find caring homes.",
  },
  {
    Icon: FaShieldAlt,
    title: "Make Informed Choices",
    description:
      "Review listing details carefully before adopting a pet or purchasing a product.",
  },
  {
    Icon: FaHandsHelping,
    title: "A Community That Cares",
    description:
      "Connect with pet lovers and discover companions and useful essentials.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!shouldReduceMotion);
  const [readySlides, setReadySlides] = useState(() => new Set());
  const [failedSlides, setFailedSlides] = useState(() => new Set());

  const currentRef = useRef(0);
  const readySlidesRef = useRef(new Set());
  const failedSlidesRef = useRef(new Set());
  const isPlayingRef = useRef(!shouldReduceMotion);

  const transitionDuration = shouldReduceMotion
    ? 0
    : TRANSITION_DURATION;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Home | PawMart";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Preload and decode images before allowing the carousel to display them.
  useEffect(() => {
    let cancelled = false;

    BANNERS.forEach((banner, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = banner.image;

      const markReady = () => {
        if (cancelled) return;

        readySlidesRef.current = new Set([
          ...readySlidesRef.current,
          index,
        ]);

        setReadySlides(new Set(readySlidesRef.current));
      };

      const markFailed = () => {
        if (cancelled) return;

        failedSlidesRef.current = new Set([
          ...failedSlidesRef.current,
          index,
        ]);

        setFailedSlides(new Set(failedSlidesRef.current));
      };

      if (typeof image.decode === "function") {
        image.decode().then(markReady).catch(() => {
          // Some browsers reject decode() even when the image can load.
          if (image.complete && image.naturalWidth > 0) {
            markReady();
          } else {
            markFailed();
          }
        });
      } else {
        image.onload = markReady;
        image.onerror = markFailed;

        if (image.complete) {
          image.naturalWidth > 0 ? markReady() : markFailed();
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    readySlidesRef.current = readySlides;
  }, [readySlides]);

  useEffect(() => {
    failedSlidesRef.current = failedSlides;
  }, [failedSlides]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Find the next available image without switching to an image that is
  // still loading or has failed.
  const findAvailableSlide = useCallback((startIndex, direction = 1) => {
    const ready = readySlidesRef.current;
    const failed = failedSlidesRef.current;

    for (let step = 1; step <= BANNERS.length; step += 1) {
      const index =
        (startIndex + direction * step + BANNERS.length) %
        BANNERS.length;

      if (ready.has(index) && !failed.has(index)) {
        return index;
      }
    }

    return -1;
  }, []);

  const goToSlide = useCallback(
    (index) => {
      const normalizedIndex =
        (index + BANNERS.length) % BANNERS.length;

      if (
        !readySlidesRef.current.has(normalizedIndex) ||
        failedSlidesRef.current.has(normalizedIndex)
      ) {
        return;
      }

      currentRef.current = normalizedIndex;
      setCurrent(normalizedIndex);
    },
    []
  );

  const showPrevious = useCallback(() => {
    const nextIndex = findAvailableSlide(currentRef.current, -1);

    if (nextIndex !== -1) {
      goToSlide(nextIndex);
    }
  }, [findAvailableSlide, goToSlide]);

  const showNext = useCallback(() => {
    const nextIndex = findAvailableSlide(currentRef.current, 1);

    if (nextIndex !== -1) {
      goToSlide(nextIndex);
    }
  }, [findAvailableSlide, goToSlide]);

  const handleCategoryClick = useCallback(
    (category) => {
      navigate(
        `/category-filtered-product/${encodeURIComponent(category.value)}`
      );
    },
    [navigate]
  );

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((previous) => !previous);
  }, []);

  // One stable interval. Hovering over the carousel does not pause it.
  useEffect(() => {
    if (!isPlaying || shouldReduceMotion || BANNERS.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (!isPlayingRef.current) return;

      const nextIndex = findAvailableSlide(currentRef.current, 1);

      if (nextIndex !== -1) {
        currentRef.current = nextIndex;
        setCurrent(nextIndex);
      }
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, shouldReduceMotion, findAvailableSlide]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsPlaying(false);
    }
  }, [shouldReduceMotion]);

  return (
    <main className="min-w-0 overflow-hidden bg-base-200 pb-12 text-neutral transition-colors duration-300 dark:bg-neutral dark:text-white sm:pb-16">
      {/* Hero carousel */}
      <section
        aria-label="PawMart featured highlights"
        aria-roledescription="carousel"
        className="relative isolate min-h-[480px] overflow-hidden bg-slate-950 sm:min-h-[540px] lg:min-h-[590px]"
      >
        {/* Persistent background prevents a blank flash between slides. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
        />

        {/* All layers stay mounted, so image elements are not recreated. */}
        {BANNERS.map((banner, index) => {
          const isActive = current === index;
          const isReady = readySlides.has(index);
          const isFailed = failedSlides.has(index);

          return (
            <div
              key={banner.image}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${BANNERS.length}`}
              className={`absolute inset-0 ${
                isActive ? "z-10" : "pointer-events-none z-0"
              }`}
              style={{
                opacity: isActive && isReady && !isFailed ? 1 : 0,
                transition: `opacity ${transitionDuration}s ease-in-out`,
                willChange: "opacity",
              }}
            >
              {!isFailed && (
                <img
                  src={banner.image}
                  alt={isActive ? banner.alt : ""}
                  loading="eager"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  draggable="false"
                  onLoad={() => {
                    readySlidesRef.current = new Set([
                      ...readySlidesRef.current,
                      index,
                    ]);
                    setReadySlides(new Set(readySlidesRef.current));
                  }}
                  onError={() => {
                    failedSlidesRef.current = new Set([
                      ...failedSlidesRef.current,
                      index,
                    ]);
                    setFailedSlides(new Set(failedSlidesRef.current));
                  }}
                  className="absolute inset-0 h-full w-full select-none object-cover object-center"
                />
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15"
              />

              <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-6 py-20 sm:min-h-[540px] sm:px-12 lg:min-h-[590px] lg:px-16">
                <div className="max-w-2xl text-white">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-indigo-300 sm:text-sm">
                    {banner.eyebrow}
                  </p>

                  <h1 className="max-w-xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                    {banner.title}
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8 lg:text-lg">
                    {banner.description}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      to={banner.primaryLink}
                      tabIndex={isActive && isReady && !isFailed ? 0 : -1}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/60"
                    >
                      <FaPaw aria-hidden="true" />
                      {banner.primaryLabel}
                      <FaArrowRight aria-hidden="true" />
                    </Link>

                    <Link
                      to={banner.secondaryLink}
                      tabIndex={isActive && isReady && !isFailed ? 0 : -1}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                    >
                      {banner.secondaryLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous slide */}
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6 sm:h-12 sm:w-12"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>

        {/* Next slide */}
        <button
          type="button"
          onClick={showNext}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:h-12 sm:w-12"
        >
          <FaChevronRight aria-hidden="true" />
        </button>

        {/* Slide indicators and autoplay control */}
        <div className="absolute bottom-5 left-1/2 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
          {BANNERS.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              disabled={!readySlides.has(index) || failedSlides.has(index)}
              className={`h-2.5 shrink-0 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-30 ${
                current === index
                  ? "w-7 bg-white sm:w-8"
                  : "w-2.5 bg-white/55 hover:bg-white/90"
              }`}
            />
          ))}

          <span
            aria-hidden="true"
            className="mx-0.5 h-5 w-px shrink-0 bg-white/30"
          />

          <button
            type="button"
            onClick={toggleAutoplay}
            aria-label={
              isPlaying ? "Pause banner rotation" : "Resume banner rotation"
            }
            aria-pressed={isPlaying}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {isPlaying ? (
              <FaPause size={11} aria-hidden="true" />
            ) : (
              <FaPlay size={11} aria-hidden="true" />
            )}
          </button>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <SectionHeading
          eyebrow="EXPLORE PAWMART"
          title="Everything for Your Pets"
          description="Find companions, everyday essentials, and care products in one place."
          reducedMotion={shouldReduceMotion}
        />

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.value}
              type="button"
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 14,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.35,
                delay: shouldReduceMotion ? 0 : index * 0.06,
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              onClick={() => handleCategoryClick(category)}
              className="group flex min-h-44 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10 sm:flex-col sm:items-start sm:justify-between sm:p-6"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${category.iconClass}`}
              >
                <category.Icon size={26} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1 sm:w-full">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-white/10 dark:text-indigo-300">
                <FaArrowRight size={14} aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section
        aria-label="Recent listings"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <RecentListings />
      </section>

      {/* Why PawMart */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:p-12">
            <div className="relative min-h-64 overflow-hidden rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 sm:min-h-80">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1000&q=85"
                alt="Dogs enjoying time outdoors"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                More than a marketplace
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Better Care Starts with a Little Love
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                PawMart brings pet lovers and pet essentials together in one
                convenient place. Explore adoption opportunities, discover
                useful products, and make thoughtful choices for the animals
                that depend on us.
              </p>

              <Link
                to="/about-us"
                className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              >
                Learn About PawMart
                <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-0 border-t border-slate-100 dark:border-white/10 sm:grid-cols-3">
            {BENEFITS.map(({ Icon, title, description }, index) => (
              <div
                key={title}
                className={`p-6 sm:p-7 ${
                  index > 0
                    ? "border-t border-slate-100 dark:border-white/10 sm:border-l sm:border-t-0"
                    : ""
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon size={20} aria-hidden="true" />
                </span>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-10">
        <FAQ />
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50/70 dark:border-white/10 dark:bg-indigo-500/10">
          <Newsletter />
        </div>
      </section>
    </main>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
  reducedMotion,
}) => (
  <motion.div
    initial={{
      opacity: 0,
      y: reducedMotion ? 0 : 12,
    }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: reducedMotion ? 0 : 0.35 }}
    className="text-center"
  >
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
      {eyebrow}
    </p>

    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
      {title}
    </h2>

    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
      {description}
    </p>
  </motion.div>
);

export default Home;
