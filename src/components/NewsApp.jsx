import UseContext from '../Context';
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import "../css/NewsApp.css";
import { MdGpsFixed } from "react-icons/md";
import { NEWS_BACKEND_URL } from '../config/backend';

const NEWS_CACHE_KEY = 'cachedNews';
const NEWS_CACHE_TIME_KEY = 'cachedNewsTime';
const NEWS_CACHE_MAX_AGE_MS = 300000;

function NewsApp() {
    const newsContainerRef = useRef();
    const [error, setError] = useState('');
    const [allNews, setAllNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newsError, setNewsError] = useState(false);

    const { 
        tileScreen,
        city, setCity,
        Cel, setCel,
        weather, setWeather,
        newsPopup, setNewsPopup }
         = useContext(UseContext);

    function getArticleUrl(item = {}) {
        return item.url || item.link || '';
    }

    function getArticleImage(item = {}) {
        return item.urlToImage || item.image || item.imageUrl || '';
    }

    function getArticleTitle(item = {}) {
        return item.originalNews || item.title || item.headline || item.description || 'Untitled article';
    }

    const hasSeen = new Set();
    const filteredNews = allNews
        .filter(item => {
            const articleUrl = getArticleUrl(item);
            if (!articleUrl || hasSeen.has(articleUrl)) return false;
            hasSeen.add(articleUrl);
            return true;
        })
        .reverse()
        .slice(0, 20);

    const time = new Date()
    const hours = time.getHours();
    const isNight = hours > 17 || hours < 6;


    const weatherIcons = {
        0: isNight ? '🌙' : '☀️',
        1: isNight ? '🌙' : '🌤️',
        2: isNight ? '🌙' : '⛅',
        3: '☁️',
        45: '🌫️',
        61: '🌧️',
        71: '❄️',
        95: '⛈️',
    };

    function restoreCachedNews() {
        const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
        const cachedTime = localStorage.getItem(NEWS_CACHE_TIME_KEY);

        if (!cachedNews || !cachedTime) {
            return false;
        }

        const timeDiff = Date.now() - Number.parseInt(cachedTime, 10);

        if (timeDiff >= NEWS_CACHE_MAX_AGE_MS) {
            return false;
        }

        try {
            setAllNews(JSON.parse(cachedNews));
            setNewsError(false);
            setIsLoading(false);
            return true;
        } catch (cacheError) {
            console.error("Error reading cached news:", cacheError);
            return false;
        }
    }

    async function fetchNews() {
        setIsLoading(true);
        setNewsError(false);

        try {
            const response = await axios.get(NEWS_BACKEND_URL);
            const latestNews = Array.isArray(response.data?.articles)
                ? response.data.articles
                : Array.isArray(response.data?.news)
                    ? response.data.news
                    : [];

            setAllNews(latestNews);
            localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(latestNews));
            localStorage.setItem(NEWS_CACHE_TIME_KEY, Date.now().toString());
        } catch (fetchError) {
            console.error("Error fetching news:", fetchError);
            setNewsError(true);

            if (!restoreCachedNews()) {
                setAllNews([]);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                newsContainerRef.current &&
                !newsContainerRef.current.contains(event.target) &&
                !event.target.closest('.time')
            ) {
                setNewsPopup(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [newsContainerRef]);

    function openNews(url) {
        window.open(url);
    }

    useEffect(() => {
        if(newsPopup){
            if (!restoreCachedNews()) {
                fetchNews();
            }
            getUserLocation();   
        }
    }, [newsPopup]);

    useEffect(() => { // update weather and location since tile screen is active
        getUserLocation();   
    }, [tileScreen]);

    function getUserLocation() {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                fetchWeatherAndCity(lat, lon); // force fetch
            },
            () => setError('Location permission denied')
        );
    }

    function fetchWeatherAndCity(lat, lon) {
        if(!lat || !lon) return;
        // Weather API
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`;
        fetch(weatherUrl)
            .then((res) => res.json())
            .then((data) => {
                const current = data.current;
                const tempF = ((current.temperature_2m * 9 / 5) + 32).toFixed(0);
                const code = current.weathercode;
                setWeather({ temp: tempF, code: code });
                localStorage.setItem('tempF', JSON.stringify(tempF));
                localStorage.setItem('iconCode', JSON.stringify(code));
            })
            .catch(() => setError('Failed to fetch weather'));

        // City API
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        fetch(geoUrl, {
            headers: {
                'User-Agent': 'NewsApp/1.0 (you@example.com)'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const address = data.address;
                const cityName = address.city || address.town || address.village || address.state || 'Unknown';
                setCity(cityName);
                localStorage.setItem('city', JSON.stringify(cityName));
            })
            .catch(() => setCity('Unknown'));
    }

    return (
        <>
            <AnimatePresence>
                {newsPopup && (
                    <motion.div
                        className="news_container"
                        ref={newsContainerRef}
                        initial={{ opacity: 0, x: '-500px' }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        exit={{ opacity: 0, x: '-500px' }}
                    >
                        {weather && (
                            <div className="weather_container">
                                <span className='location'
                                    onClick={() => {
                                        getUserLocation();
                                    }}
                                >
                                    <MdGpsFixed />
                                </span>
                                <h1>{city}</h1>
                                <h1>{weatherIcons[weather.code] || ''}
                                    <span className="temp"
                                        onClick={() => setCel(!Cel)}
                                    >
                                        {Cel ? weather.temp : ((weather.temp - 32) * 5 / 9).toFixed(0)}
                                        {Cel ? '°F' : '°C'}
                                    </span>
                                </h1>
                            </div>
                        )}
                        {error && <p className="error">{error}</p>}

                        <h1>Latest News</h1>
                        {isLoading ? (
                            <p className="news-loading">Loading news...</p>
                        ) : newsError && allNews.length === 0 ? (
                            <p className="news-error">News unavailable</p>
                        ) : allNews.length > 0 ? (
                            filteredNews.map((item, index) => (
                                <div className="news" key={index} onClick={() => openNews(getArticleUrl(item))}>
                                    <img src={getArticleImage(item)} alt="" />
                                    <h5>{getArticleTitle(item)}</h5>
                                </div>
                            ))
                        ) : (
                            <p>No news available</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default NewsApp;
