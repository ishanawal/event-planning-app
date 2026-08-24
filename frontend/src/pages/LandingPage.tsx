import {
  ArrowRight,
  Cake,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  Plus,
  Search,
  Tags,
  Users,
  BriefcaseBusiness,
  Palette,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Category from "../components/common/CategoryCard";
import Step from "../components/common/StepsCard";
import FeatureCard from "../components/common/FeatureCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar variant="marketing" />

      {/* Hero Section*/}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              left-1/2
              top-70
              h-130
              w-180
              -translate-x-1/2
              rounded-full
              bg-primary/[0.035]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -right-40
              top-80
              h-75
              w-75
              rounded-full
              bg-secondary/6
              blur-3xl
            "
          />
        </div>

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-6
            py-16
            sm:py-20
            lg:px-8
            lg:py-24
          "
        >
          <div
            className="
              grid
              items-center
              gap-14
              lg:grid-cols-[1.05fr_0.95fr]
              lg:gap-20
            "
          >
            {/* Left */}
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">
                Event planning, made simple.
              </p>

              <h1
                className="
                  mt-7
                  max-w-xl
                  font-serif
                  text-5xl
                  font-semibold
                  leading-[1.04]
                  tracking-tight
                  text-cream
                  sm:text-6xl
                "
              >
                Got something
                <br />
                <span className="text-primary">to plan?</span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-lg
                  text-base
                  leading-7
                  text-muted
                  sm:text-lg
                "
              >
                Keep the date, details, and people in one place. Create an
                event, share it, and get on with the fun part.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" rightIcon={<ArrowRight size={17} />}>
                    Create an event
                  </Button>
                </Link>

                <Link to="/events">
                  <Button variant="outline" size="lg">
                    Browse events
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-xs text-placeholder">
                Free to get started. No complicated setup.
              </p>
            </div>

            {/* Right Section */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div
                className="
                  absolute
                  -inset-5
                  rounded-4xl
                  bg-primary/4
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-5
                  shadow-2xl
                "
              >
                {/* Fake window header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-placeholder">
                      Upcoming event
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-cream">
                      Friday dinner
                    </h2>
                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-primary/10
                      text-primary
                    "
                  >
                    <CalendarDays size={17} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-background
                        text-primary
                      "
                    >
                      <CalendarDays size={15} />
                    </div>

                    <div>
                      <p className="text-xs text-placeholder">When</p>
                      <p className="mt-0.5 text-sm text-cream">
                        Friday, 28 August · 7:30 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-background
                        text-primary
                      "
                    >
                      <Users size={15} />
                    </div>

                    <div>
                      <p className="text-xs text-placeholder">People</p>

                      <p className="mt-0.5 text-sm text-cream">
                        8 people invited
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-background
                        text-primary
                      "
                    >
                      <Tags size={15} />
                    </div>

                    <div>
                      <p className="text-xs text-placeholder">Type</p>

                      <p className="mt-0.5 text-sm text-cream">
                        Dinner · Friends
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end border-t border-border pt-4">
                  <span className="text-xs text-primary">View event</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section id="features" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              The basics, covered
            </p>

            <h2
              className="
                mt-4
                max-w-lg
                font-serif
                text-4xl
                font-semibold
                tracking-tight
                text-cream
                sm:text-5xl
              "
            >
              Everything you need.
              <br />
              Nothing you don't.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted">
              Event Planner keeps the little details from getting scattered
              across messages, notes, and calendars.
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-border
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            <div className="bg-card">
              <FeatureCard
                icon={<CalendarDays size={19} />}
                title="Create an event"
                description="Add a name, date, time, location and the details people actually need."
              />
            </div>

            <div className="bg-card">
              <FeatureCard
                icon={<Tags size={19} />}
                title="Keep things organized"
                description="Use tags to keep birthdays, work events and everything else easy to find."
              />
            </div>

            <div className="bg-card">
              <FeatureCard
                icon={<Search size={19} />}
                title="Find something to do"
                description="Browse upcoming events and see what's happening around you."
              />
            </div>

            <div className="bg-card">
              <FeatureCard
                icon={<Users size={19} />}
                title="Share with people"
                description="Make an event public or keep it private for the people you invite."
              />
            </div>

            <div className="bg-card">
              <FeatureCard
                icon={<LockKeyhole size={19} />}
                title="Control who sees it"
                description="Decide whether your event should be visible to everyone or just your group."
              />
            </div>

            <div className="bg-card">
              <FeatureCard
                icon={<CheckCircle2 size={19} />}
                title="Keep it simple"
                description="Everything stays in one place, so you don't have to remember where you put it."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}

      <section id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              How it works
            </p>

            <h2
              className="
                mt-4
                max-w-xl
                font-serif
                text-4xl
                font-semibold
                tracking-tight
                text-cream
                sm:text-5xl
              "
            >
              Three steps.
              <br />
              That's about it.
            </h2>
          </div>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            <Step
              number="01"
              icon={<Plus size={17} />}
              title="Create"
              description="Give your event a name, pick a date and add the details."
            />

            <Step
              number="02"
              icon={<Tags size={17} />}
              title="Organize"
              description="Add a few tags and choose whether your event is public or private."
            />

            <Step
              number="03"
              icon={<Users size={17} />}
              title="Share"
              description="Send it to your people and everyone has the same details."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}

      <section id="categories" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div
            className="
              flex
              flex-col
              justify-between
              gap-5
              sm:flex-row
              sm:items-end
            "
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Browse events
              </p>

              <h2
                className="
                  mt-4
                  font-serif
                  text-4xl
                  font-semibold
                  tracking-tight
                  text-cream
                  sm:text-5xl
                "
              >
                What are you planning?
              </h2>
            </div>

            <Link
              to="/events"
              className="
                flex
                w-fit
                items-center
                gap-1.5
                text-sm
                font-medium
                text-primary
                transition
                hover:text-primary-hover
              "
            >
              See all events
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Category
              icon={<Cake size={19} />}
              title="Birthdays"
              description="Celebrate another year."
            />

            <Category
              icon={<BriefcaseBusiness size={19} />}
              title="Work"
              description="Meet, learn and get things done."
            />

            <Category
              icon={<Palette size={19} />}
              title="Workshops"
              description="Share ideas and learn something new."
            />

            <Category
              icon={<Users size={19} />}
              title="Get-togethers"
              description="Make time for your people."
            />
          </div>
        </div>
      </section>
      {/* Footer Section */}

      <footer className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div
            className="
              flex
              flex-col
              justify-between
              gap-8
              sm:flex-row
              sm:items-center
            "
          >
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <CalendarDays size={16} />
                </div>

                <span className="font-serif font-semibold text-cream">
                  Event Planner
                </span>
              </Link>

              <p className="mt-2 text-xs text-muted">
                Keep plans in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-muted">
              <a href="#features" className="transition hover:text-cream">
                Features
              </a>

              <a href="#how-it-works" className="transition hover:text-cream">
                How it works
              </a>

              <Link to="/events" className="transition hover:text-cream">
                Events
              </Link>

              <Link to="/login" className="transition hover:text-cream">
                Sign in
              </Link>

              <Link to="/signup" className="transition hover:text-cream">
                Sign up
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6 text-xs text-placeholder">
            © {new Date().getFullYear()} Event Planner
          </div>
        </div>
      </footer>
    </div>
  );
}
