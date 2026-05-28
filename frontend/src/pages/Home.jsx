import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

const features = [
  {
    icon: FileCheck2,
    title: "Issue digital certificates",
    description: "Upload a PDF, capture learner details, hash the file, and anchor the record on-chain."
  },
  {
    icon: ShieldCheck,
    title: "Verify authenticity",
    description: "Check certificate IDs against stored records and blockchain state in seconds."
  },
  {
    icon: LockKeyhole,
    title: "Revoke compromised records",
    description: "Mark certificates as revoked while preserving an auditable transaction trail."
  }
];

const Home = () => (
  <main>
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Trusted credentials MVP
          </div>
          <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
            CertChain
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Blockchain-based Certificate Verification System
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/issue" className="w-full sm:w-auto" icon={ArrowRight}>
              Issue Certificate
            </Button>
            <Button as={Link} to="/verify" variant="secondary" className="w-full sm:w-auto">
              Verify Certificate
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-soft">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Certificate Status</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">Verified</p>
              </div>
              <ShieldCheck className="h-10 w-10 text-emerald-500" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-4">
              {["SHA256 document hash", "Blockchain transaction", "Revocation status"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
          Features
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">
          A focused workflow for certificate trust
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <feature.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
            <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  </main>
);

export default Home;
