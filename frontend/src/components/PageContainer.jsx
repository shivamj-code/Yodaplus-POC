const PageContainer = ({ children, eyebrow, title, description }) => (
  <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    {(eyebrow || title || description) && (
      <header className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        ) : null}
      </header>
    )}
    {children}
  </main>
);

export default PageContainer;
