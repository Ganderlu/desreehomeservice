import {
  BadgeCheck,
  Bolt,
  Brush,
  Clock,
  Droplet,
  MapPin,
  ShieldCheck,
  Sparkles,
  Snowflake,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import LandingFooter from "../components/landing/footer";
import LandingHero from "../components/landing/hero";
import BenefitCard from "../components/landing/benefit-card";
import ServiceCard from "../components/landing/service-card";
import TestimonialCard from "../components/landing/testimonial-card";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHero />

      <section id="services" className="container-padded py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-secondary">Our Services</h2>
            <p className="mt-2 text-gray-600">
              Premium home services for estates and neighborhoods in Awka & Onitsha.
            </p>
          </div>
          <Link href="/customer/services">
            <Button variant="outline" className="h-11 rounded-2xl border-secondary/30">
              View all services
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] lg:overflow-visible">
          <ServiceCard
            icon={<Droplet className="text-white" size={22} />}
            name="Plumbing"
            priceFrom={3000}
            gradientClassName="bg-gradient-to-br from-[#00BFA5] to-[#00796B] snap-start"
          />
          <ServiceCard
            icon={<Bolt className="text-white" size={22} />}
            name="Electrical Repairs"
            priceFrom={4000}
            gradientClassName="bg-gradient-to-br from-[#FF9500] to-[#FF6A00] snap-start"
          />
          <ServiceCard
            icon={<Sparkles className="text-white" size={22} />}
            name="Deep Cleaning"
            priceFrom={7000}
            gradientClassName="bg-gradient-to-br from-[#8B5CF6] to-[#5B21B6] snap-start"
          />
          <ServiceCard
            icon={<Brush className="text-white" size={22} />}
            name="Wall Painting"
            priceFrom={12000}
            gradientClassName="bg-gradient-to-br from-[#F43F5E] to-[#F97316] snap-start"
          />
          <ServiceCard
            icon={<Snowflake className="text-white" size={22} />}
            name="AC Repair & Servicing"
            priceFrom={9000}
            gradientClassName="bg-gradient-to-br from-[#0EA5A4] to-[#0E7490] snap-start"
          />
          <ServiceCard
            icon={<Wrench className="text-white" size={22} />}
            name="Generator Servicing"
            priceFrom={8000}
            gradientClassName="bg-gradient-to-br from-[#F59E0B] to-[#92400E] snap-start"
          />
          </div>
          <div className="mt-4 text-sm text-gray-600 lg:hidden">
            Swipe to see more services →
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-padded py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">How It Works</h2>
          <p className="mt-2 text-gray-600">
            Simple steps, fast service, and secure escrow payments.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 border shadow-sm px-6 py-8 sm:px-10">
          <div className="relative">
            <div className="hidden md:block absolute left-14 right-14 top-6 h-px bg-slate-200" />
            <div className="flex md:grid md:grid-cols-4 gap-8 md:gap-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
              <div className="min-w-[220px] md:min-w-0 snap-start flex flex-col items-center text-center px-2">
                <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
                  <MapPin size={22} className="text-accent" />
                </div>
                <div className="mt-3 font-semibold text-secondary">Post your job</div>
                <div className="mt-1 text-xs text-gray-600 max-w-[220px]">
                  Tell us the service, your location, and preferred time.
                </div>
              </div>

              <div className="min-w-[220px] md:min-w-0 snap-start flex flex-col items-center text-center px-2">
                <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
                  <BadgeCheck size={22} className="text-accent" />
                </div>
                <div className="mt-3 font-semibold text-secondary">Get matched with verified pros</div>
                <div className="mt-1 text-xs text-gray-600 max-w-[220px]">
                  Nearby, rated workers in Awka & Onitsha get notified.
                </div>
              </div>

              <div className="min-w-[220px] md:min-w-0 snap-start flex flex-col items-center text-center px-2">
                <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
                  <Clock size={22} className="text-accent" />
                </div>
                <div className="mt-3 font-semibold text-secondary">Track in real-time</div>
                <div className="mt-1 text-xs text-gray-600 max-w-[220px]">
                  See ETA, live progress updates, and in-app chat.
                </div>
              </div>

              <div className="min-w-[220px] md:min-w-0 snap-start flex flex-col items-center text-center px-2">
                <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
                  <ShieldCheck size={22} className="text-accent" />
                </div>
                <div className="mt-3 font-semibold text-secondary">Pay only after job done</div>
                <div className="mt-1 text-xs text-gray-600 max-w-[220px]">
                  Paystack escrow releases funds after photo proof.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 md:hidden text-center">
            Swipe to see all steps →
          </div>
        </div>
      </section>

      <section className="container-padded py-16">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Why Choose Desree</h2>
          <p className="mt-2 text-gray-600">Trusted, fast, and hyper-local to your estate.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <BenefitCard
            title="Verified & Skilled Workers"
            description="Background checks, ratings, and skills verification."
            icon={<BadgeCheck size={20} className="text-accent" />}
          />
          <BenefitCard
            title="Escrow Payment Protection"
            description="Funds held until job completion with proof."
            icon={<ShieldCheck size={20} className="text-accent" />}
          />
          <BenefitCard
            title="Fast Response Time"
            description="Get matched within minutes in Awka & Onitsha."
            icon={<Clock size={20} className="text-accent" />}
          />
          <BenefitCard
            title="Hyper-local Estates"
            description="Built for Awka GRA, Onitsha GRA, and nearby areas."
            icon={<MapPin size={20} className="text-accent" />}
          />
        </div>
      </section>

      <section className="container-padded py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-secondary">What Our Customers Say</h2>
            <p className="mt-2 text-gray-600">Real stories from homes in Anambra.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <TestimonialCard
            name="Chiamaka N."
            location="Awka GRA"
            rating={5}
            quote="Booked a plumber in minutes. He arrived fast and fixed everything cleanly. The escrow payment made me feel safe."
          />
          <TestimonialCard
            name="Emeka O."
            location="Onitsha"
            rating={5}
            quote="Great service and very professional. I tracked the worker and paid only after the job was completed."
          />
          <TestimonialCard
            name="Ifeoma A."
            location="Ifite, Awka"
            rating={4}
            quote="The electrician was polite and skilled. The process was smooth and the pricing was clear in naira."
          />
        </div>
      </section>

      <section id="for-workers" className="container-padded py-16">
        <div className="rounded-3xl border bg-gradient-to-r from-secondary via-secondary/90 to-primary/80 p-8 md:p-10 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(600px_circle_at_20%_20%,rgba(255,149,0,0.9),transparent),radial-gradient(700px_circle_at_80%_10%,rgba(0,191,165,0.9),transparent)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Earn with Desree – Join as a Worker
              </h2>
              <p className="mt-3 text-white/90 text-lg">
                Get steady jobs in Awka & Onitsha, build your reputation, and withdraw earnings quickly.
              </p>
              <ul className="mt-6 grid gap-3 text-white/90">
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Steady job alerts near your location
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Instant payouts after proof of work
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  No commission on your first jobs
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Portfolio uploads to win more customers
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/20 p-6 md:p-8">
              <div className="text-sm text-white/80">For artisans & service providers</div>
              <div className="mt-2 text-2xl font-semibold">Start earning this week</div>
              <div className="mt-4 text-white/90 text-sm">
                Create your profile, set your skills, and go online to start receiving job requests.
              </div>
              <div className="mt-6">
                <Link href="/auth">
                  <Button className="h-12 w-full rounded-2xl bg-accent text-white hover:opacity-90 text-base">
                    Register as a Worker
                  </Button>
                </Link>
                <div className="mt-3 text-xs text-white/80">
                  Verification helps you get more jobs and better ratings.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
