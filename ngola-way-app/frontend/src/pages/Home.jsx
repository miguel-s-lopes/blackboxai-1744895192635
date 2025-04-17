import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Your Journey, Your Way with Ngola Way
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Book rides and stays seamlessly. Experience convenience at its finest with our all-in-one platform for transportation and accommodation.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/book-ride"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Book a Ride
                </Link>
                <Link
                  to="/find-stay"
                  className="rounded-md bg-secondary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  Find a Stay
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Everything You Need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All-in-One Platform
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're looking for a ride or a place to stay, we've got you covered with our comprehensive suite of services.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Ride Booking Feature */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <svg className="h-5 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                    <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.61-.719.61-1.22v-6.76a.75.75 0 00-.75-.75h-4z" />
                  </svg>
                  Quick Ride Booking
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Book a ride in seconds with our easy-to-use platform. Track your driver in real-time and enjoy a seamless journey.</p>
                </dd>
              </div>

              {/* Stay Booking Feature */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <svg className="h-5 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                  </svg>
                  Comfortable Stays
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Find and book the perfect accommodation for your needs. From cozy rooms to entire homes, we have it all.</p>
                </dd>
              </div>

              {/* Security Feature */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <svg className="h-5 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.87-3.786 9.899-8.002 11.82a.499.499 0 01-.676 0C5.107 16.899 1.32 12.87 1.32 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.078-2.749z" clipRule="evenodd" />
                  </svg>
                  Secure & Reliable
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Your safety is our priority. All drivers and properties are verified, and payments are secure.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
