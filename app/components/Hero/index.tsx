/***
 * Hero component
 */
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
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
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-35">
        <Image
          src="/hero-coding-image.jpeg"
          alt="Coding background"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>
      <div className="card">
        <div className="card-body leading-snug min-w-[280px] max-w-[400px] md:max-w-[500px]">
          <h2 className="card-title leading-snug text-3xl md:text-4xl lg:text-5xl font-bold my-4">
            Tempo Codestart:
          </h2>
          <h3 className="leading-snug text-2xl md:text-3xl lg:text-4xl">
            Your Bootcamp Coding Interview Launchpad
          </h3>
          <h4 className="my-4 text-base md:text-lg lg:text-xl">
            Go from no experience to a competitive and confident coding bootcamp applicant.
          </h4>
          <div className="card-actions">
            <Link className="btn btn-primary" href={problemLink}>Start Preparing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
