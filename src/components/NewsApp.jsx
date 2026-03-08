import UseContext from '../Context';
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import "../css/NewsApp.css";
import { MdGpsFixed } from "react-icons/md";

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

    const hasSeen = new Set();
    const filteredNews = allNews
        .filter(item => {
            if (hasSeen.has(item.url)) return false;
            hasSeen.add(item.url);
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

    // useEffect(() => { // call fetchNews when user open news
    //     const cachedNews = localStorage.getItem('cachedNews');
    //     const cachedTime = localStorage.getItem('cachedNewsTime');
        
    //     if (cachedNews && cachedTime) {
    //         const timeDiff = Date.now() - Number.parseInt(cachedTime);
    //         // Use cached news if less than 5 minutes old
    //         if (timeDiff < 300000) {
    //             setAllNews(JSON.parse(cachedNews));
    //             setIsLoading(false);
    //             return;
    //         }
    //     }
        
    //     fetchNews();
    // }, []);

    // async function fetchNews() {
    //     setIsLoading(true);
    //     setNewsError(false);
    //     try {
    //         const response = await axios.get("https://ai-tweet-bot-mp70.onrender.com/news/getNews");
    //         setAllNews(response.data.news);
    //         // Cache the news and timestamp
    //         localStorage.setItem('cachedNews', JSON.stringify(response.data.news));
    //         localStorage.setItem('cachedNewsTime', Date.now().toString());
    //     } catch (error) {
    //         console.error("Error fetching news:", error);
    //         setNewsError(true);
    //         // Don't clear cached news on error - let user see last successful fetch
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

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


    return null; // Temporarily disable news widget
}

export default NewsApp;
