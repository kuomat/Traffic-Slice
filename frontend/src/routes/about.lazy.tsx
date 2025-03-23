import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-4xl font-bold mb-6 text-center">About Page</h1> */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold">
          Traffic Slice: See What Leaves, Protect What Matters.
        </h2>
        <h3 className="text-2xl font-semibold mt-4">
          Take Control of Your Data
        </h3>
        <p className="text-lg leading-relaxed">
          In today's digital world, using loaner or work laptops is common—but
          how do you know what's happening under the hood? Is your data truly
          secure? Are your files, credentials, or personal information being
          sent out without your knowledge?
        </p>
        <p className="text-lg leading-relaxed">
          Traffic Slice gives you full visibility into your laptop's network
          activity, tracking incoming and outgoing requests while highlighting
          sensitive data. With real-time monitoring and intuitive insights, you
          can stay informed and take action before potential risks become
          threats.
        </p>
        <h3 className="text-2xl font-semibold mt-4">
          Why We Built Traffic Slice
        </h3>
        <p className="text-lg leading-relaxed">
          We've all been there—using a borrowed or company-issued laptop, unsure
          of what's running in the background. Traditional security tools can be
          complex and overwhelming, leaving users in the dark about their own
          data. Traffic Slice was designed to bridge that gap, providing a
          simple yet powerful way to understand and manage network traffic.
        </p>
        <h3 className="text-2xl font-semibold mt-4">How It Works</h3>
        <ul className="list-disc list-inside text-lg leading-relaxed">
          <li>
            Monitors Your Network Traffic – Tracks requests going in and out of
            your device.
          </li>
          <li>
            Detects Sensitive Data Transfers – Flags when critical information
            might be leaving your laptop.
          </li>
          <li>
            Provides Clear Insights – Offers an easy-to-understand interface so
            you can act with confidence.
          </li>
        </ul>
        <p className="text-lg leading-relaxed">
          With Traffic Slice, you don't have to be a cybersecurity expert to
          protect yourself. Whether you're a student, employee, or
          privacy-conscious individual, you deserve to know where your data is
          going—and now, you can.
        </p>
      </div>
    </div>
  )
}
