import { useEffect, useRef, useContext, useState } from 'react';
import UseContext from '../Context'
import { motion, AnimatePresence  } from 'framer-motion';
import startIcon from '../assets/95icon.png';
import run from '../assets/run.png';
import github from '../assets/github.png';
import tile from '../assets/tile.png';
import sidebar from '../assets/sidebar95.png';
import display from '../assets/display.png';
import project from '../assets/regFolder.png';
import resume from '../assets/folder.png';
import shutdownicon from '../assets/shutdownicon.png';
import settings from '../assets/setting.png';
import btc_icon from '../assets/btc_icon.webp'
import { clippyPhrase, clippySuggest } from './function/ClippyFunction';
import { BsCheck  } from "react-icons/bs";
import Calendar from 'react-calendar';
import { BsFillCaretRightFill } from "react-icons/bs";
import binEmp from '../assets/bin2.png'
import bin from '../assets/bin.png'
import news from '../assets/news.png'
import speaker from '../assets/speaker.png'
import vscIcon from '../assets/vscode.png';


export default function Footer() {

    const timeBarRef = useRef(null);
    const wheelTapContainer = useRef(null)
    const startRef = useRef(null);
    const iconSizeRef = useRef(null);
    const calenderRef = useRef(null);
    const volumeRef = useRef(null);
    const startPopUpRef = useRef(null)
    const projectRef = useRef(null)
    const resumeRef = useRef(null)
    const closeMenuTimeoutRef = useRef(null)
    const [calValue, calOnChange] = useState(new Date());
    const [width, setWidth] = useState(0);
    const [reRenderFooter, setRerenderFooter] = useState(0)
    const [volumePopup, setVolumePopup] = useState(false)

    const {
        deleteTap,
        tileScreen, setTileScreen,
        onlineUser,
        newsPopup, setNewsPopup,
        btcShow, setBtcShow,
        isTouchDevice,
        desktopIcon,
        projectStartBar, setProjectStartBar,
        resumeStartBar, setResumejectStartBar,
        calenderToggle, setCalenderToggle,
        iconTextSize,
        iconScreenSize, setIconScreenSize,
        iconSize, setIconSize,
        chatDown,
        remountRunPosition,
        startActive, setStartActive,
        time, setTime,
        tap,
        imageMapping,
        handleShow,
        StyleHide,
        setWinampExpand,
        showClippy, setShowClippy,
        clippyIndex, setClippyIndex,
        randomClippyPopup, setRandomClippyPopup,
        clippyTouched, setClippyTouched,
        clippyThanks,
        clippySendemail,
        firstTimoutShowclippy,
        RandomTimeoutShowClippy,
        SecondRandomTimeoutShowClippy,
        ClearTOclippySendemailfunction,
        ClearTOclippyThanksYouFunction,
        ClearTOSongfunction,
        clippySong,
        ClearTOdonttouch,
        ObjectState,
        setShutdownWindow,
        ClearTOclippyUsernameFunction,
        clippyUsername,
        sounds,
        maxZindexRef,
     } = useContext(UseContext);

     
     const footerItems = [
        {
            className: "sidebar_popup",
            imgSrc: sidebar,
            imgAlt: "sidebar",
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "ghithub",
            imgSrc: github,
            imgAlt: "github",
            style: { borderRadius: '5px' },
            spanText: "GitHub",
            onClick: () => {
                window.open('https://github.com/dhruvin-sarkar', '_blank');
                setStartActive(false)
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "linkedin",
            imgSrc: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
            imgAlt: "LinkedIn",
            style: { width: '16px', height: '16px', borderRadius: '2px' },
            spanText: "LinkedIn",
            onClick: () => {
                window.open('https://www.linkedin.com/in/dhruvin-sarkar/', '_blank');
                setStartActive(false)
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "linked",
            imgSrc: tile,
            imgAlt: "Tile",
            style: { borderRadius: '5px' },
            spanText: "Tile Screen",
            onClick: () => {
                setTileScreen(true),
                setStartActive(false)
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "shutdownicon",
            imgSrc: settings,
            imgAlt: "shutdownicon",
            spanText: "Settings",
            onClick: () => handleShow('Settings'),
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "run",
            imgSrc: run,
            imgAlt: "run",
            spanText: "Run...",
            onClick: () => {
                handleShow('Run')
                remountRunPosition()
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "msdos",
            imgSrc: imageMapping('MS-DOS Prompt'),
            imgAlt: "msdos",
            spanText: "MS-DOS Prompt",
            onClick: () => {
                handleShow('Terminal');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "vscode",
            imgSrc: vscIcon,
            imgAlt: "vscode",
            spanText: "VS Code",
            onClick: () => {
                handleShow('VS Code');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "minesweeper",
            imgSrc: imageMapping('MineSweeper'),
            imgAlt: "minesweeper",
            spanText: "MineSweeper",
            onClick: () => {
                handleShow('MineSweeper');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "windows95",
            imgSrc: '/icons/win95.svg',
            imgAlt: "Windows 95",
            spanText: "Windows 95",
            onClick: () => {
                handleShow('Windows 95');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "n64",
            imgSrc: '/icons/n64.svg',
            imgAlt: "Nintendo 64",
            spanText: "Nintendo 64",
            onClick: () => {
                handleShow('Nintendo 64');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "ps1",
            imgSrc: '/icons/ps1.svg',
            imgAlt: "PlayStation 1",
            spanText: "PlayStation 1",
            onClick: () => {
                handleShow('PlayStation 1');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "gba",
            imgSrc: '/icons/gba.svg',
            imgAlt: "Game Boy Advance",
            spanText: "Game Boy Advance",
            onClick: () => {
                handleShow('Game Boy Advance');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "nes",
            imgSrc: '/icons/nes.svg',
            imgAlt: "NES Emulator",
            spanText: "NES Emulator",
            onClick: () => {
                handleShow('NES Emulator');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "keen4",
            imgSrc: '/icons/commanderkeen.svg',
            imgAlt: "Commander Keen 4",
            spanText: "Commander Keen 4",
            onClick: () => {
                handleShow('Commander Keen 4');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "spacecadet",
            imgSrc: '/icons/spacecadet.svg',
            imgAlt: "Space Cadet Pinball",
            spanText: "Space Cadet Pinball",
            onClick: () => {
                handleShow('Space Cadet Pinball');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "quake3",
            imgSrc: '/icons/quake3.svg',
            imgAlt: "Quake III Arena",
            spanText: "Quake III Arena",
            onClick: () => {
                handleShow('Quake III Arena');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "quake1",
            imgSrc: '/icons/quake1.svg',
            imgAlt: "Quake",
            spanText: "Quake",
            onClick: () => {
                handleShow('Quake');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "dino",
            imgSrc: '/icons/chromedino.svg',
            imgAlt: "Chrome Dino",
            spanText: "Chrome Dino",
            onClick: () => {
                handleShow('Chrome Dino');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "dxball",
            imgSrc: '/icons/dxball.svg',
            imgAlt: "DX-Ball",
            spanText: "DX-Ball",
            onClick: () => {
                handleShow('DX-Ball');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "skifree",
            imgSrc: '/icons/skifree.svg',
            imgAlt: "SkiFree",
            spanText: "SkiFree",
            onClick: () => {
                handleShow('SkiFree');
                setStartActive(false);
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        },
        {
            className: "groove"
        },
        {
            className: "shutdownicon",
            imgSrc: shutdownicon,
            imgAlt: "shutdownicon",
            spanText: "Shut down...",
            onClick: () => {
                setShutdownWindow(true)
                setStartActive(false)
            },
            onmouseenter: () => {
                setResumejectStartBar(false);
                setProjectStartBar(false);
            },
        }
    ];

    // need to put these in useeffect Array
    const isBitcoinInstalled = desktopIcon.find(item => item.name === 'Bitcoin')


    useEffect(() => { // put add or remove icon in dependency array
        if (timeBarRef.current) {
        setWidth(timeBarRef.current.offsetWidth);
        }
    }, [isBitcoinInstalled, timeBarRef, width]);

     const handleWheelScroll = (e) => { // wheel from x to Y on tap
        const container = wheelTapContainer.current;
        container.scrollLeft += e.deltaY;
      };

      useEffect(() => {
        const handleMouseMove = (event) => {
          const startPopupContainer = startPopUpRef.current;
          const projectContainer = projectRef.current;
          const resumeContainer = resumeRef.current;

          if (startPopupContainer) {
            const startRect = startPopupContainer.getBoundingClientRect();

            let projectRect = null;
            let resumeRect = null;

            if (projectContainer) {
              projectRect = projectContainer.getBoundingClientRect();
            }
            if (resumeContainer) {
              resumeRect = resumeContainer.getBoundingClientRect();
            }

            const isMouseOutsideStart =
              event.clientX < startRect.left ||
              event.clientX > startRect.right ||
              event.clientY < startRect.top ||
              event.clientY > startRect.bottom;

            const isMouseOutsideProject = projectRect
              ? event.clientX < projectRect.left ||
                event.clientX > projectRect.right ||
                event.clientY < projectRect.top ||
                event.clientY > projectRect.bottom
              : true;

            const isMouseOutsideResume = resumeRect
              ? event.clientX < resumeRect.left ||
                event.clientX > resumeRect.right ||
                event.clientY < resumeRect.top ||
                event.clientY > resumeRect.bottom
              : true;

            if (isMouseOutsideStart && isMouseOutsideProject && isMouseOutsideResume) {
              // Clear any existing timeout
              if (closeMenuTimeoutRef.current) {
                clearTimeout(closeMenuTimeoutRef.current);
              }
              // Set a new timeout to close the menu after a short delay
              closeMenuTimeoutRef.current = setTimeout(() => {
                setProjectStartBar(false);
                setResumejectStartBar(false);
              }, 200);
            } else {
              // Mouse is over menu, clear any pending timeout
              if (closeMenuTimeoutRef.current) {
                clearTimeout(closeMenuTimeoutRef.current);
              }
            }
          }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          if (closeMenuTimeoutRef.current) {
            clearTimeout(closeMenuTimeoutRef.current);
          }
        };
      }, []);



    useEffect(() => { // set local time
        getCurrentLocalTime12Hour();
        const intervalId = setInterval(getCurrentLocalTime12Hour, 1000); // update every 1 second
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if(!startActive){
            setProjectStartBar(false)
            setResumejectStartBar(false)
        }
    },[startActive])

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the start button
            if (startRef.current && !startRef.current.contains(event.target)) {
                setStartActive(false);
            }

            // Check if the click is outside the icon size element
            if (iconSizeRef.current && !iconSizeRef.current.contains(event.target)) {
                setIconSize(false);
            }

            if (calenderRef.current && !calenderRef.current.contains(event.target)) {
                setCalenderToggle(false);
            }

            if (volumeRef.current && !volumeRef.current.contains(event.target)) {
                setVolumePopup(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const getCurrentLocalTime12Hour = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let meridiem = hours < 12 ? 'AM' : 'PM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = (hours < 10 ? '0' : '') + hours;
        minutes = (minutes < 10 ? '0' : '') + minutes;
        let currentTime12Hour = hours + ':' + minutes + ' ' + meridiem;
        setTime(currentTime12Hour);
    };

    function handleHideFolder(index) { // unhide icon from tap

        const lowerCaseName = tap[index].toLowerCase().trim().replace(/\s/g, '');
        const allSetItems = ObjectState(); 


        allSetItems.forEach((item) => {

          const itemName = item.name.toLowerCase().trim().replace(/\s/g, '');
          if(item.type === 'userCreatedFolder') { // for user created folder
          item.setter({
            focusItem: tap[index] === item.name,
            hide: tap[index] === item.name ? false : item.usestate.hide,
          });
        }
          if(itemName === lowerCaseName) {
            if(item.usestate.hide) {
                // Restore from taskbar
                maxZindexRef.current += 1;
                item.setter(prev => ({...prev, hide: false, focusItem: true, zIndex: maxZindexRef.current}));
                sounds?.playWindowMaximize();
                
                if(lowerCaseName === 'winamp') {
                    const webampElement = document.querySelector('#webamp');
                    if (webampElement) {
                        webampElement.style.opacity = 1;
                        webampElement.style.pointerEvents = 'auto';
                        webampElement.style.touchAction = 'auto';
                        setWinampExpand(prev => ({...prev, hide: false}));
                    }
                }
            } else if (item.usestate.focusItem) {
                // Already focused and visible - Minimize to taskbar
                item.setter(prev => ({...prev, hide: true, focusItem: false}));
                sounds?.playWindowMinimize();
            } else {
                // Visible but not focused - Focus it
                maxZindexRef.current += 1;
                item.setter(prev => ({...prev, focusItem: true, zIndex: maxZindexRef.current}));
            }
          }

          if(itemName !== lowerCaseName) {
            item.setter(prev => ({...prev, focusItem: false}));
          }
        });
      }


    useEffect(() => { // display clippy when windows start
        clearTimeout(firstTimoutShowclippy.current)
        clearTimeout(ClearTOclippySendemailfunction.current)
        clearTimeout(ClearTOclippyThanksYouFunction.curremt)
        clearTimeout(ClearTOSongfunction.current)
        clearTimeout(ClearTOclippyUsernameFunction.current)

        setShowClippy(true)
        firstTimoutShowclippy.current = setTimeout(() => {
            setShowClippy(false)
        }, 10000);

        return () => {
            clearTimeout(firstTimoutShowclippy.current);
        };
    },[])


    useEffect(() => { //random clippy time
        clearTimeout(SecondRandomTimeoutShowClippy.current)
        const randomTime = Math.floor(Math.random() * (50000 - 30000 + 1)) + 30000;

        clearTimeout(ClearTOclippySendemailfunction.current)
        clearTimeout(ClearTOclippyThanksYouFunction.curremt)
        clearTimeout(ClearTOSongfunction.current)

        RandomTimeoutShowClippy.current = setTimeout(() => { // random clippy index from length
        const randomIndex = Math.floor(Math.random() * clippyPhrase.inspiration.length)
                setClippyIndex(randomIndex);
                setShowClippy(true);
        SecondRandomTimeoutShowClippy.current = setTimeout(() => {
                setShowClippy(false);
                setRandomClippyPopup(prev => !prev);
            }, 10000);
        }, randomTime);

        return () => {
            clearTimeout(RandomTimeoutShowClippy.current);
            clearTimeout(SecondRandomTimeoutShowClippy.current);
        };
    }, [randomClippyPopup]);


    function dontTouch() { // click on clippy while speaking, will active angry clippy
        clearTimeout(ClearTOdonttouch.current)
        ClearTOdonttouch.current = setClippyTouched(true)
        setTimeout(() => {
            setClippyTouched(false)
        }, 3500);

        return () => {
            clearTimeout(ClearTOdonttouch.current)
        }
    }

    function handleClipperTalk() {
        if(clippyThanks) return clippySuggest[1];
        if(clippyTouched) return clippyPhrase.interruption[0].phrase;
        if(clippySendemail) return clippySuggest[0]
        if(clippySong) return clippySuggest[2]
        if(clippyUsername) return chatDown? clippySuggest[4] : onlineUser < 2 ? clippySuggest[5] : clippySuggest[3]

        return clippyPhrase.inspiration[clippyIndex].phrase // return default from phrase
    }

    useEffect(() => { /// need useeffect to update state before it returns on handleClipperTalk()
        if (clippySendemail) {
            setClippyIndex(1);
            return;
        }
        if (clippySong) {
            setClippyIndex(7);
            return;
        }
        if (clippyUsername) {
            setClippyIndex(2);
            return;
        }
    }, [clippySendemail, clippySong, clippyUsername]);

    const iconSizeSelection = [
        { label: '360x640', value: 1 },
        { label: '640x720', value: 2 },
        { label: '1920x1080', value: 3 },
        { label: '2560x1440', value: 4 },
        { label: '3480x2160', value: 5 }
    ];

    const projectFolderItem = desktopIcon.filter(icon => icon.folderId === 'Project').length
    const resumeFolderItem = desktopIcon.filter(icon => icon.folderId === 'Resume').length

    const recycleBin = desktopIcon.filter(icon => icon.folderId === 'RecycleBin');
    const recycleBinLength = recycleBin.length;

    return (
        <>
            <div className="footer">
                <div
                    ref={startRef}
                    className={`btn_start ${startActive ? 'active' : ''}`}
                    onClick={(e) => {
                        setStartActive(!startActive);
                        setIconSize(false)
                        setCalenderToggle(false)
                        e.stopPropagation(); // prevent to click on body from this element
                    }}
                >
                    <img src={startIcon} alt="startIcon" />
                    <h4>Start</h4>
                </div>
                {/* -------- CREATE TAP ON FOOTER -------- */}
                <div className="tap_container" ref={wheelTapContainer}
                    style={{
                        maxWidth: `calc(100% - ${80 + width}px)`
                        }}

                    onWheel={handleWheelScroll}
                >
                    {tap.map((item, index) => (
                        <div className="start_tap" key={index}
                            onClick={(e) => {
                                setStartActive(false)
                                handleHideFolder(index);
                                e.stopPropagation()
                            }}
                            style={StyleHide(index, tap, ObjectState)}
                            >
                            {
                            <img src={
                                item === 'RecycleBin' && recycleBinLength === 0 ? binEmp
                                : item === 'RecycleBin' && recycleBinLength > 0 ? bin
                                : imageMapping(item)} alt={''} />
                            }
                            <p>{item === 'Terminal' ? 'MS-DOS Prompt' : item}</p>
                        </div>
                    ))}
                </div>

                <div className="time"
                    ref={timeBarRef}
                >
                    <div className="icon_time_container">
                        <img src={news} alt="news"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setNewsPopup(!newsPopup)
                                }}
                        />
                        {isBitcoinInstalled && (
                            <img src={btc_icon} alt="btc_icon"
    
                                onClick={() => btcShow.show ? deleteTap('Bitcoin') : handleShow('Bitcoin')}
                            />
                        )}
                        <img 
                            src={speaker} 
                            alt="speaker"
                            style={{
                                width: '16px',
                                opacity: sounds?.muted ? 0.5 : 1,
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setVolumePopup(!volumePopup)
                                setIconSize(false)
                                setStartActive(false)
                                setCalenderToggle(false)
                            }}
                        />
                        <img src={display} alt="display"
                            style={{width: '20px'}}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIconSize(!iconSize)
                                setStartActive(false)
                                setCalenderToggle(false)
                                setVolumePopup(false)
                            }}
                        />
                    </div>
                    <div className='p_time_div'
                        style={{background: calenderToggle? '#8c8888c2':''}}>
                        <p
                            onClick={(e) => {
                                e.stopPropagation()
                                setCalenderToggle(!calenderToggle)
                                setIconSize(false)
                                setStartActive(false)
                                setVolumePopup(false)
                            }}
                        >
                            {time}
                        </p>
                    </div>
                </div>
                {startActive && (
                    <div className="start_popup"
                        ref={startPopUpRef}
                        style={{display: startActive? '' : 'none'}}
                    >
                        {footerItems.map((item, index) => (
                            <motion.div
                            key={index}
                            className={item.className}
                            onClick={(e) => {
                                e.stopPropagation()
                                item.onClick()
                            }}
                            onMouseEnter={!isTouchDevice && item.onmouseenter}
                        >
                            {item.imgSrc && (
                                <img
                                    src={item.imgSrc}
                                    alt={item.imgAlt}
                                    style={item.style || {}}
                                />
                            )}
                            {item.spanText && <span>{item.spanText}</span>}
                            {item.arrow && (<span><BsFillCaretRightFill/></span>)}
                        </motion.div>
                        ))}

                    </div>
                    )}

                <AnimatePresence>
                {showClippy && (
                    <motion.div
                        className="clippy_container"
                        onClick={dontTouch}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ rotate: '360deg', opacity: 1, scale: 1 }}
                        transition={{ ease: 'easeInOut', duration: 0.8, delay: 0.5 }}
                        exit={{ rotate: '-360deg', scale: 0, opacity: 0, transition: { ease: 'easeInOut', duration: 0.8 } }}
                    >
                    <img src={ clippyTouched? clippyPhrase.interruption[0].animation : clippyPhrase.inspiration[clippyIndex].animation} alt="clippy" />
                        <motion.div className="bubble_chat"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ ease: "easeIn", duration: .8, delay: 1.5 }}
                            exit={{ opacity: 0, transition: { ease: 'easeOut', duration: 0.1 } }}
                        >
                    <p>{handleClipperTalk()}</p>
                    </motion.div>
                </motion.div>
                )}
                </AnimatePresence>
            </div>
            {iconSize && (
              <div className="icon_size_container"
                ref={iconSizeRef}
            >
            {iconSizeSelection.map(item => (
                <div key={item.value}
                    onClick={() => {
                        const newVal = item.value
                        setIconScreenSize(newVal)
                        setIconSize(false)
                        localStorage.setItem('iconSize', newVal)
                    }}
                >
                {item.value === iconTextSize(iconScreenSize).number && (
                 <BsCheck
                    style={{
                        position: 'absolute',
                        fontSize: '15px',
                    }}
                 />
                ) }

                    <p>
                        {item.label}
                    </p>
                </div>
            ))}
            </div>
            )}
            {calenderToggle && (
                <div className="calender_container"
                    ref={calenderRef}
                >
                    <Calendar onChange={calOnChange} value={calValue}

                    />
                </div>
            )}
            {volumePopup && (
                <div className="volume_container"
                    ref={volumeRef}
                    style={{
                        position: 'fixed',
                        bottom: '40px',
                        right: '16px',
                        background: '#c0c0c0',
                        border: '2px solid',
                        borderColor: '#ffffff #000000 #000000 #ffffff',
                        padding: '10px',
                        zIndex: 9999,
                        minWidth: '180px',
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px'
                    }}>
                        <span style={{
                            fontSize: '11px', 
                            fontWeight: 'bold',
                            fontFamily: 'MS Sans Serif, sans-serif'
                        }}>Volume Control</span>
                    </div>
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid',
                        borderColor: '#808080 #ffffff #ffffff #808080',
                        padding: '8px',
                        marginBottom: '8px'
                    }}>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={sounds?.volume || 50}
                            onChange={(e) => sounds?.setVolume(Number(e.target.value))}
                            style={{
                                width: '100%',
                                height: '20px',
                                WebkitAppearance: 'none',
                                appearance: 'none',
                                background: 'transparent',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                        <style>{`
                            .volume_container input[type="range"]::-webkit-slider-track {
                                width: 100%;
                                height: 4px;
                                background: #c0c0c0;
                                border: 1px solid;
                                border-color: #808080 #ffffff #ffffff #808080;
                            }
                            .volume_container input[type="range"]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                width: 12px;
                                height: 18px;
                                background: #c0c0c0;
                                border: 2px solid;
                                border-color: #ffffff #000000 #000000 #ffffff;
                                cursor: pointer;
                                box-shadow: 1px 1px 0px rgba(0,0,0,0.3);
                            }
                            .volume_container input[type="range"]::-moz-range-track {
                                width: 100%;
                                height: 4px;
                                background: #c0c0c0;
                                border: 1px solid;
                                border-color: #808080 #ffffff #ffffff #808080;
                            }
                            .volume_container input[type="range"]::-moz-range-thumb {
                                width: 12px;
                                height: 18px;
                                background: #c0c0c0;
                                border: 2px solid;
                                border-color: #ffffff #000000 #000000 #ffffff;
                                cursor: pointer;
                                box-shadow: 1px 1px 0px rgba(0,0,0,0.3);
                            }
                        `}</style>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        marginBottom: '8px',
                        fontFamily: 'MS Sans Serif, sans-serif',
                        color: '#000000'
                    }}>
                        <span>Low</span>
                        <span style={{fontWeight: 'bold'}}>{sounds?.volume || 50}%</span>
                        <span>High</span>
                    </div>
                    <button
                        onClick={() => sounds?.toggleMute()}
                        style={{
                            width: '100%',
                            padding: '6px',
                            background: '#c0c0c0',
                            border: '2px solid',
                            borderColor: '#ffffff #000000 #000000 #ffffff',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontFamily: 'MS Sans Serif, sans-serif',
                            fontWeight: 'bold',
                            boxShadow: '1px 1px 0px rgba(0,0,0,0.2)'
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.borderColor = '#000000 #ffffff #ffffff #000000';
                            e.currentTarget.style.padding = '7px 5px 5px 7px';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.borderColor = '#ffffff #000000 #000000 #ffffff';
                            e.currentTarget.style.padding = '6px';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#ffffff #000000 #000000 #ffffff';
                            e.currentTarget.style.padding = '6px';
                        }}
                    >
                        {sounds?.muted ? '🔇 Unmute' : '🔊 Mute'}
                    </button>
                </div>
            )}

        </>
    );
}
