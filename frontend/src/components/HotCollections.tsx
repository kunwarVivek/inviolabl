"use client";
import React from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Icon } from "@iconify/react";
import  collimg1  from '../../public/coll-1.jpg';
import  collimg2  from '../../public/coll-2.jpg';
import  collimg3  from '../../public/coll-3.jpg';
import  collimg4  from '../../public/coll-4.jpg';
import  collimg5  from '../../public/coll-5.jpg';
import dummyProfileImg from "../../public/dummy-profile-image-1.jpg"




const HotCollections = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // for medium devices like tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640, // for small devices like phones
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-10">
      <h1 className="text-center text-3xl font-bold mb-7">Hot Collections</h1>
      <div className="max-w-screen-xl mx-auto ">
        <Slider {...settings}>
          <div className="p-4">
            <div className="max-w-xs mx-auto bg-white border border-gray-200 rounded-lg shadow">
              <div className="relative w-full">
                <Image
                  src={collimg1}
                  alt=""
                  height={300} width={300}
                  objectFit="cover" // Ensures the image covers the area nicely
                  className="rounded-t-lg"
                />{" "}
                <div className="absolute z-20 -bottom-4 left-[40%] ">
                  <div className="rounded-full bg-white border-2 p-0.5 border-white">
                    <Image
                      src={dummyProfileImg}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full aspect-square w-[50px]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center flex-col">
                <div>
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Abstraction
                  </h5>
                </div>
                <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400">
                  ERC-192
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 slick-slide">
            <div className="max-w-sm mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="relative">
                <Image height={300} width={300} src={collimg2} alt="" />
                <div className="absolute z-20 -bottom-4 left-[40%] ">
                  <div className="rounded-full bg-white border-2 p-0.5 border-white">
                    <Image
                      src={dummyProfileImg}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full aspect-square w-[50px]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center flex-col">
                <div>
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Abstraction
                  </h5>
                </div>
                <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400">
                  ERC-61
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 slick-slide">
            <div className="max-w-sm mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="relative">
                <Image height={300} width={300} src={collimg4} alt="" />
                <div className="absolute z-20 -bottom-4 left-[40%] ">
                  <div className="rounded-full bg-white border-2 p-0.5 border-white">
                    <Image
                      src={dummyProfileImg}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full aspect-square w-[50px]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center flex-col">
                <div>
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Abstraction
                  </h5>
                </div>
                <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400">
                  ERC-126
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 slick-slide">
            <div className="max-w-sm mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="relative">
                <Image height={300} width={300} src={collimg5} alt="" />
                <div className="absolute z-20 -bottom-4 left-[40%] ">
                  <div className="rounded-full bg-white border-2 p-0.5 border-white">
                    <Image
                      src={dummyProfileImg}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full aspect-square w-[50px]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center flex-col">
                <div>
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Abstraction
                  </h5>
                </div>
                <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400">
                  ERC-85
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 slick-slide">
            <div className="max-w-sm mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="relative">
                <Image height={300} width={300} src={collimg3} alt="" />
                <div className="absolute z-20 -bottom-4 left-[40%] ">
                  <div className="rounded-full bg-white border-2 p-0.5 border-white">
                    <Image
                      src={dummyProfileImg}
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full aspect-square w-[50px]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-center flex-col">
                <div>
                  <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Abstraction
                  </h5>
                </div>
                <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400">
                  ERC-42
                </p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "black" }}
      onClick={onClick}
    >
      <Icon icon="bi:arrow-right-circle-fill" style={{ fontSize: "24px" }} />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "black" }}
      onClick={onClick}
    >
      <Icon icon="bi:arrow-left-circle-fill" style={{ fontSize: "24px" }} />
    </div>
  );
}

export default HotCollections;