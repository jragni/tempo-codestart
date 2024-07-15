/***
 * Hero component
 */
import Image from 'next/image';
import Link from 'next/link'
import HeroImage from 'public/laptop-hero-image.jpg';

export default function Hero() {
  return (
    <div
      className="
        bg-base-100
        flex
        h-[calc(100dvh-64px)]
        justify-center
        text-base-content
        px-16
        py-4
      "
    >
      <div className="card">
        <div className="card-body leading-snug w-[400px]">
          <h2 className="card-title leading-snug text-5xl">
            Tempo Codestart:
          </h2>
          <h3 className="leading-snug text-4xl">
            Your Bootcamp Coding Interview Launchpad
          </h3>
          <h4 className="my-4">
            Go from no experience to a competitve and confident coding bootcamp applicant.
          </h4>
          <div className="card-actions">
            <button className="btn btn-primary">Start Preparing</button>
          </div>
        </div>
      </div>
      <Image
        alt="laptop hero image"
        src={HeroImage}
        height={600}
      />
    </div>
  );
}