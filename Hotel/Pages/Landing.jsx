import React, { useState, useEffect, useRef } from 'react';
import HotelBG from '../src/assets/Video/HotelBG.mp4';
import './Style/Landing.css';
import Room from '../src/assets/Video/Room.jpg'
import Lobby from '../src/assets/Video/Lobby.jpg'
import Lounge from '../src/assets/Video/Lounge.jpg'
import Dine from '../src/assets/Video/Dine.jpg'
import Pool from '../src/assets/Video/Pool.jpg'
import Bulb from '../src/assets/Video/Bulb.png'
import Cherry from '../src/assets/Video/Cherry.png'
import Gift from '../src/assets/Video/Gift.png'
import Santa from '../src/assets/Video/Santa.png'
import Lamp from '../src/assets/Video/Lamp.png'
import FB from '../src/assets/facebook.svg'
import IG from '../src/assets/Instagram.svg'
import SNP from '../src/assets/snapchat.svg'
import SKY from '../src/assets/Skype.svg'
import Lottie from 'react-lottie';
import Arrow from '../src/assets/Swipe Down Arrow.json';
import { Player } from '@lottiefiles/react-lottie-player'

export function Landing() {
    useEffect(() => {

        let slide_data = [
            {
                src: Lobby,
                title: 'Lobby',
                copy: "Step into comfort and elegance at our hotel lobby, where every detail is designed to make you feel happy. Whether you're starting your day or meeting with friends, our lobby offers a warm, inviting atmosphere complemented by top-notch facilities and attentive staff. It's the perfect place to relax, unwind, and begin your journey with us. Experience hospitality at its finest!",
            },
            {
                src: Dine,
                title: 'Dine',
                copy: "Treat yourself to an unforgettable dining experience at our hotel restaurant, where every meal is a delight. Our expert chefs create mouthwatering dishes using the finest ingredients, ensuring every bite is a taste of perfection. Whether you're craving local flavors or international cuisine, we’ve got something to satisfy every palate.",
            },
            {
                src: Room,
                title: 'Room',
                copy: "Experience ultimate comfort in our beautifully designed rooms, where every detail is crafted for your relaxation. With modern amenities, cozy beds, and a serene atmosphere, our rooms offer a peaceful retreat after a busy day. Whether you’re here for business or leisure, you’ll feel right at home in our spacious accommodations.",
            },
            {
                src: Lounge,
                title: 'Lounge',
                copy: "Take a moment to unwind at our exclusive lounge, a perfect spot to relax with a drink, catch up with friends, or simply enjoy the serene ambiance. Whether you prefer a quiet moment or socializing with fellow guests, our lounge provides the ideal setting for both.",
            },
            {
                src: Pool,
                title: 'Pool',
                copy: "Escape the heat and dive into relaxation at our luxurious hotel pool. Whether you're soaking up the sun or swimming laps, our pool offers the perfect setting for rejuvenation. Surrounded by lush greenery and top-notch amenities, it’s the ideal place to unwind and enjoy a refreshing dip. Treat yourself to moments of pure serenity in the heart of our hotel.",
            },
        ];
        let slides = [],
            captions = [];
        let autoplay = setInterval(function () {
            nextSlide();
        }, 10000);
        let container = document.getElementById('container');
        let leftSlider = document.getElementById('left-col');
        let down_button = document.getElementById('down_button');

        down_button.addEventListener('click', function (e) {
            e.preventDefault();
            clearInterval(autoplay);
            nextSlide();
            autoplay;
        });

        for (let i = 0; i < slide_data.length; i++) {
            let slide = document.createElement('div'),
                caption = document.createElement('div'),
                slide_title = document.createElement('div');

            slide.classList.add('slide');
            slide.setAttribute('style', 'background:url(' + slide_data[i].src + ')');
            caption.classList.add('caption');
            slide_title.classList.add('caption-heading');
            slide_title.innerHTML = '<h1>' + slide_data[i].title + '</h1>';

            switch (i) {
                case 0:
                    slide.classList.add('current');
                    caption.classList.add('current-caption');
                    break;
                case 1:
                    slide.classList.add('next');
                    caption.classList.add('next-caption');
                    break;
                case slide_data.length - 1:
                    slide.classList.add('previous');
                    caption.classList.add('previous-caption');
                    break;
                default:
                    break;
            }
            caption.appendChild(slide_title);
            caption.insertAdjacentHTML(
                'beforeend',
                '<div class="caption-subhead"><span>' + slide_data[i].copy + ' </span></div>'
            );
            slides.push(slide);
            captions.push(caption);
            leftSlider.appendChild(slide);
            container.appendChild(caption);
        }

        function nextSlide() {
            slides[0].classList.remove('current');
            slides[0].classList.add('previous', 'change');
            slides[1].classList.remove('next');
            slides[1].classList.add('current');
            slides[2].classList.add('next');
            let last = slides.length - 1;
            slides[last].classList.remove('previous');

            captions[0].classList.remove('current-caption');
            captions[0].classList.add('previous-caption', 'change');
            captions[1].classList.remove('next-caption');
            captions[1].classList.add('current-caption');
            captions[2].classList.add('next-caption');
            let last_caption = captions.length - 1;

            captions[last_caption].classList.remove('previous-caption');

            let placeholder = slides.shift();
            let captions_placeholder = captions.shift();
            slides.push(placeholder);
            captions.push(captions_placeholder);
        }

        function whichTransitionEvent() {
            var t,
                el = document.createElement('fakeelement');

            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        var transitionEvent = whichTransitionEvent();
        var caption = document.querySelector('.current-caption');
        if (caption) {
            caption.addEventListener(transitionEvent, customFunction);
        }

        function customFunction(event) {
            caption.removeEventListener(transitionEvent, customFunction);
            console.log('animation ended');
        }

    }, []);

    const downButtonRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false); // Status animasi (apakah sedang animasi atau tidak)
    const lottieRef = useRef(null); // Menggunakan ref untuk mengontrol animasi secara langsung

    useEffect(() => {
        if (isAnimating) {
            lottieRef.current.play();
        }
    }, [isAnimating]); // Efek dijalankan setiap kali `isAnimating` berubah

    const handleClick = () => {
        if (!isAnimating) { // Jika animasi tidak sedang berjalan
            setIsAnimating(true); // Aktifkan status animasi
        }
    };



    return (
        <div className='fullcounter'>
            <div className="container" id="container">
                <div className="caption" id="slider-caption">
                    <div className="caption-heading">
                        <h1>Lorem Ipsum</h1>
                    </div>
                    <div className="caption-subhead">
                        <span>dolor sit amet, consectetur adipiscing elit.</span>
                    </div>
                    <a className="btn" href="#">
                        Sit Amet
                    </a>
                </div>
                <div className="rit-col">

                </div>
                <div className='gambarLanding'>
                    <img src={Santa} alt="" className="santa" />
                </div>
                <div className='gambarLanding'>
                    <img src={Cherry} alt="" className="chr" />
                </div>
                <div className='gambarLanding'>
                    <img src={Gift} alt="" className="gift" />
                </div>
                <div className='gambarLanding'>
                    <img src={FB} alt="" className="Facebook" />
                </div>
                <div className='gambarLanding'>
                    <img src={FB} alt="" className="Facebook" />
                </div>
                <div className='gambarLanding'>
                    <img src={IG} alt="" className="Instagram" />
                </div>
                <div className='gambarLanding'>
                    <img src={IG} alt="" className="Instagram" />
                </div>
                <div className='gambarLanding'>
                    <img src={SNP} alt="" className="Snapchat" />
                </div>
                <div className='gambarLanding'>
                    <img src={SNP} alt="" className="Snapchat" />
                </div>
                <div className='gambarLanding'>
                    <img src={SKY} alt="" className="Skype" />
                </div>
                <div className='gambarLanding'>
                    <img src={SKY} alt="" className="Skype" />
                </div>
                <div className="left-col" id="left-col">
                    <div id="left-slider"></div>
                </div>


                <ul className="nav">
                    <li className="slide-up">
                        <Player
                            ref={lottieRef}
                            autoplay={false} // Jangan autoplay saat pertama kali dimuat
                            loop={false}     // Tidak loop
                            src={Arrow}  // Path ke file animasi Lottie
                            style={{ height: '300px', width: 'auto' }}
                            onClick={handleClick}
                            play={isAnimating}
                            onEvent={(event) => {
                                if (event === 'complete') {
                                    setIsAnimating(false); // Reset status setelah selesai
                                }
                            }}
                            id='arrow'
                        />
                        <button onClick={handleClick} id='down_button' style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%", // Sesuai ukuran Player
                            height: "100%", // Sesuai ukuran Player
                            background: "transparent", // Buat tombol transparan agar Player terlihat
                            border: "none",
                            cursor: isAnimating ? "not-allowed" : "pointer",
                            pointerEvents: isAnimating ? "none" : "auto",
                        }}>
                            {isAnimating ? '' : ''}

                        </button>
                    </li>
                    <li className="slide-down">
                        <a href="#"> </a>
                    </li>
                </ul>
            </div>

        </div>
    );
}
