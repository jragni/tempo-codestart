/***
 * Hero component
 */
import Link from 'next/link'
import HeroImage from 'public/hero-coding-image.jpeg';

export default function Hero() {
  // TODO update this link depending on the last problem user in session solved
  const problemLink = '/problems/welcome-to-tempo';
  return (
    <div
      className="
        bg-base-200
        flex
        flex-wrap-reverse
        h-[calc(100dvh-64px)]
        justify-center
        text-base-content
        lg:px-16
        py-4
        relative
      "
    >
      <div
        className="absolute top-0 left-0 right-0 opacity-35 inset-0 w-full"
        style={{
          backgroundImage: `url(${HeroImage.src})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div className="card">
        <div className="card-body leading-snug min-w-[280px] max-w-[400px]">
          <h2 className="card-title leading-snug text-5xl font-bold my-4">
            Tempo Codestart:
          </h2>
          <h3 className="leading-snug text-4xl">
            Your Bootcamp Coding Interview Launchpad
          </h3>
          <h4 className="my-4 text-lg">
            Go from no experience to a competitve and confident coding bootcamp applicant.
          </h4>
          <div className="card-actions">
            <Link className="btn btn-primary" href={problemLink}>Start Preparing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
