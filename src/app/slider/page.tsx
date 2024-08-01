import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const Slider = () => {
  const autoplayOptions = {
    delay: 3000,
    stopOnMouseEnter: true,
    stopOnInteraction: false,
  };
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay(autoplayOptions),
  ]);

  return (
    <div className="embla">
      <div className="embla__viewport mt-12 h-56" ref={emblaRef}>
        <div className="embla__container h-full">
          <div className="embla__slide flex items-center justify-center">
            <Image
              src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600"
              width={350}
              height={500}
              alt="Corporate Meeting"
            />
          </div>
          <div className="embla__slide flex items-center justify-center">
            <Image
              src="https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=600"
              width={350}
              height={500}
              alt="Bonday Exhibition"
            />
          </div>
          <div className="embla__slide flex items-center justify-center">
            <Image
              src="https://images.pexels.com/photos/716281/pexels-photo-716281.jpeg?auto=compress&cs=tinysrgb&w=600"
              width={350}
              height={500}
              alt="Global Business Summit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
