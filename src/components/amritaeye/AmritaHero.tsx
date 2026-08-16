import { Link } from 'react-router-dom';

export function AmritaHero() {
  return (
    <section aria-labelledby="amrita-hero-title" className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-12">
        <div className="flex min-h-[620px] flex-col justify-between border-neutral-200 px-5 py-16 sm:px-8 sm:py-20 lg:col-span-7 lg:border-r lg:px-12 lg:py-24 xl:px-16 xl:py-28">
          <div>
            <div className="mb-16 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 sm:mb-20">
              <span className="h-1.5 w-1.5 bg-[#800020]" aria-hidden="true" />
              <span>Amrita Eye</span>
              <span className="h-px w-8 bg-neutral-300" aria-hidden="true" />
              <span>Campus reporting</span>
            </div>

            <h1
              id="amrita-hero-title"
              className="max-w-4xl text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.055em] text-neutral-900 sm:text-6xl md:text-7xl xl:text-[5.25rem]"
            >
              Every broken light on campus has a witness
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg sm:leading-8">
              Photograph the issue, confirm its location, and send a traceable report to the campus
              team responsible for fixing it.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/report"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-neutral-900 bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:ring-[#800020]"
              >
                Report an issue
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path
                    d="M4 10h11m-4-4 4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </Link>

              <Link
                to="/map"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
              >
                View campus map
              </Link>
            </div>
          </div>

          <dl className="mt-20 grid max-w-xl grid-cols-3 border-t border-neutral-200 pt-5">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                01
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-700">Capture</dd>
            </div>
            <div className="border-l border-neutral-200 pl-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                02
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-700">Locate</dd>
            </div>
            <div className="border-l border-neutral-200 pl-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                03
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-700">Track</dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center bg-[#f5f5f5] px-5 py-14 sm:px-8 sm:py-20 lg:col-span-5 lg:px-10 xl:px-14">
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              <span>Student report preview</span>
              <span className="font-mono tracking-normal">AMR-0247</span>
            </div>

            <article className="rounded-md border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <span className="text-xs font-medium text-neutral-500">New submission</span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700">
                  <svg aria-hidden="true" viewBox="0 0 8 8" className="h-2 w-2">
                    <circle cx="4" cy="4" r="3" fill="#800020" />
                  </svg>
                  Pending
                </span>
              </div>

              <div className="m-5 border border-neutral-200 bg-neutral-100">
                <svg
                  aria-label="Wireframe photograph of a broken campus light"
                  role="img"
                  viewBox="0 0 640 360"
                  className="aspect-[16/9] h-auto w-full text-neutral-400"
                  fill="none"
                >
                  <path d="M0 286 146 194l129 69 97-55 268 118" stroke="currentColor" />
                  <path d="M0 326h640M476 66v225M448 66h56" stroke="currentColor" />
                  <path d="M504 66v37h-56V66" stroke="currentColor" />
                  <path d="m458 104 12 10m24-10-12 10" stroke="currentColor" />
                  <path d="M78 252v-76m0 0 45-36m-45 36-37-25" stroke="currentColor" />
                  <rect x="31" y="123" width="100" height="129" stroke="currentColor" />
                  <rect x="48" y="144" width="24" height="31" stroke="currentColor" />
                  <rect x="90" y="144" width="24" height="31" stroke="currentColor" />
                  <rect x="48" y="194" width="66" height="58" stroke="currentColor" />
                  <path d="M298 238h96v57h-96zM322 238v57M370 238v57" stroke="currentColor" />
                  <circle cx="476" cy="298" r="7" fill="#800020" stroke="none" />
                  <path d="M154 305h93m182 0h102" stroke="currentColor" strokeDasharray="5 7" />
                </svg>
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Electrical
                  </span>
                  <span className="text-xs text-neutral-400">Submitted 08:42</span>
                </div>

                <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900">
                  Light out near Academic Block II
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  The path between the library and east entrance is unlit after sunset.
                </p>

                <div className="mt-6 flex items-center gap-2 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 shrink-0"
                  >
                    <path
                      d="M15.25 8.25c0 4-5.25 8-5.25 8s-5.25-4-5.25-8a5.25 5.25 0 1 1 10.5 0Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <circle cx="10" cy="8.25" r="1.75" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span>Academic Block II · East walkway</span>
                </div>
              </div>
            </article>

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              Reports retain the submitted image, location, timestamp, and resolution status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
