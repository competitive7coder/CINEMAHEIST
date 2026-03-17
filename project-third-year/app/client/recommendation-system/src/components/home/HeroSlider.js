import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = ({
  movies,
  watchlist = [],
  onWatchTrailerClick,
  onAddToWatchlist
}) => {

  const sliderMovies = movies.slice(0, 10);

 const componentStyles = `
.hero-slider{
height:88vh;
width:100%;
color:white;
margin-bottom:3rem;
position:relative;
font-family:'Inter','Poppins',sans-serif;
}

.swiper-slide-container{
height:100%;
width:100%;
position:relative;
background-size:cover;
background-position:center;
display:flex;
align-items:flex-end;
padding-bottom:40px;
}

/* CINEMATIC GRADIENT OVERLAY */
.hero-overlay{
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
background:
linear-gradient(to top,
rgba(0,0,0,0.96) 5%,
rgba(0,0,0,0.75) 35%,
rgba(0,0,0,0.35) 60%,
rgba(0,0,0,0.1) 80%);
}

/* CONTENT AREA */
.hero-content{
position:relative;
z-index:10;
padding:3rem 5rem;
max-width:600px;
animation:fadeUp 0.9s ease;
}

/* TITLE */
.hero-title{
font-size:4.5rem;
font-weight:900;
letter-spacing:1px;
line-height:1.05;
text-shadow:
0 4px 25px rgba(0,0,0,0.9),
0 0 25px rgba(0,0,0,0.6);
}

/* DESCRIPTION */
.hero-overview{
font-size:1.15rem;
margin-top:1.2rem;
max-width:580px;
line-height:1.6;
color:#d0d0d0;
display:-webkit-box;
-webkit-line-clamp:3;
-webkit-box-orient:vertical;
overflow:hidden;
}

/* BUTTONS */
.hero-buttons{
margin-top:2rem;
display:flex;
gap:15px;
flex-wrap:wrap;
}

/* BASE BUTTON */
.hero-buttons .btn{
padding:12px 26px;
font-size:1rem;
font-weight:600;
border-radius:8px;
border:none;
display:flex;
align-items:center;
gap:6px;
transition:all .25s ease;
}

/* TRAILER BUTTON */
.hero-buttons .btn-light{
background:white;
color:black;
box-shadow:0 6px 20px rgba(0,0,0,0.4);
}

.hero-buttons .btn-light:hover{
transform:translateY(-2px);
box-shadow:0 12px 30px rgba(0,0,0,0.5);
}

/* WATCHLIST BUTTON */
.hero-buttons .btn-secondary{
background:rgba(255,255,255,0.15);
backdrop-filter:blur(12px);
color:white;
border:1px solid rgba(255,255,255,0.25);
}

.hero-buttons .btn-secondary:hover{
background:rgba(255,255,255,0.25);
transform:translateY(-2px);
}

/* SWIPER ARROWS */
.hero-slider .swiper-button-next,
.hero-slider .swiper-button-prev{
color:white!important;
background:rgba(0,0,0,0.35);
width:45px;
height:45px;
border-radius:50%;
backdrop-filter:blur(8px);
transition:all .25s ease;
}

.hero-slider .swiper-button-next:hover,
.hero-slider .swiper-button-prev:hover{
background:rgba(255,255,255,0.25);
}

/* PAGINATION DOTS */
.hero-slider .swiper-pagination-bullet{
width:10px;
height:10px;
background:rgba(255,255,255,0.35)!important;
opacity:1;
transition:all .25s ease;
}

.hero-slider .swiper-pagination-bullet-active{
background:white!important;
width:28px;
border-radius:10px;
}

/* ENTRY ANIMATION */
@keyframes fadeUp{
from{
opacity:0;
transform:translateY(40px);
}
to{
opacity:1;
transform:translateY(0);
}
}

.swiper-slide-container::after{
content:"";
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
background:
radial-gradient(circle at center,
rgba(0,0,0,0) 40%,
rgba(0,0,0,0.6) 100%);
pointer-events:none;
}

.swiper-slide-container{
animation:heroZoom 18s ease infinite alternate;
}

@keyframes heroZoom{
from{
background-size:100%;
}
to{
background-size:110%;
}
}

`;

  return (
    <div className="hero-slider pt-2">

      <style>{componentStyles}</style>

      <Swiper
        style={{ height: "110%" }}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
      >

        {sliderMovies.map((movie) => {

          const isInWatchlist = watchlist.includes(movie.id);

          return (
            <SwiperSlide key={movie.id}>

              <div
                className="swiper-slide-container"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}
              >

                <div className="hero-overlay"></div>

                <div className="hero-content">

                  <h1 className="hero-title">{movie.title}</h1>

                  <p className="hero-overview">{movie.overview}</p>

                  <div className="hero-buttons">

                    {/* WATCH TRAILER */}

                    <button
                      className="btn btn-light"
                      onClick={() => onWatchTrailerClick(movie)}
                    >
                      <i className="bi bi-play-fill me-2"></i>
                      Watch Trailer
                    </button>

                    {/* WATCHLIST BUTTON */}

                    <button
                      className={`btn ${isInWatchlist ? "btn-success" : "btn-secondary"}`}
                      onClick={() => onAddToWatchlist(movie)}
                    >
                      {isInWatchlist ? (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          In Watchlist
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-lg me-2"></i>
                          Add to Watchlist
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </div>

            </SwiperSlide>
          );

        })}

      </Swiper>

    </div>
  );
};

export default HeroSlider;