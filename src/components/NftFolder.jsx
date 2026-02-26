import UseContext from '../Context'
import React, { useContext } from 'react';
import Draggable from './system/WindowDraggable';
import file4 from '../assets/file4.png'
import folder from '../assets/regFolder.png'
import '../css/ResumeFolder.css'
import { useSounds } from '../hooks/useSounds';


function NftFolder() {

  const { playWindowMaximize, playWindowMinimize } = useSounds();

  const { 
    themeDragBar,
    handleShow, handleShowMobile,
    handleDoubleClickiframe, handleDoubleTapiframeMobile,
    setOpenProjectExpand,
    setProjectUrl,
    NftExpand, setNftExpand,
    lastTapTime, setLastTapTime,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    iconFocusIcon,
    deleteTap,

   } = useContext(UseContext);

      function handleDragStop(event, data) {
        const positionX = data.x 
        const positionY = data.y
        setNftExpand(prev => ({
          ...prev,
          x: positionX,
          y: positionY
        }))

      }

   function handleExpandStateToggle() {
    setNftExpand(prevState => {
      const willExpand = !prevState.expand;
      if (willExpand) {
        playWindowMaximize();
      } else {
        playWindowMinimize();
      }
      return {
        ...prevState,
        expand: willExpand,
      };
    });
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setNftExpand(prevState => {
        const willExpand = !prevState.expand;
        if (willExpand) {
          playWindowMaximize();
        } else {
          playWindowMinimize();
        }
        return {
          ...prevState,
          expand: willExpand,
        };
      });
    }
    setLastTapTime(now);
  }


  return (
    <>
      <Draggable
        axis="both" 
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={NftExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 5 : 80,
          y: window.innerWidth <= 500 ? 100 : 90,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('Nft')}
      >
        <div className='folder_folder' 
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('Nft');
            }}
            style={ NftExpand.expand ? inlineStyleExpand('Nft') : inlineStyle('Nft')}>
          <div className="folder_dragbar"
              onDoubleClick={handleExpandStateToggle}
              onTouchStart={handleExpandStateToggleMobile}
             style={{ background: NftExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="folder_barname">
              <img src={folder} alt="folder" />
              <span>Nft</span>
            </div>
            <div className="folder_barbtn">
              <div onClick={ !isTouchDevice? (e) => {
                e.stopPropagation()
                playWindowMinimize();
                setNftExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Nft') 
              } : undefined
            }
                   onTouchEnd={(e) => {
                    e.stopPropagation()
                    playWindowMinimize();
                    setNftExpand(prev => ({...prev, hide: true, focusItem: false}))
                    StyleHide('Nft')
                  }}
              >
                <span className='dash'></span>
              </div>
              <div
                onClick={ !isTouchDevice ? () => handleExpandStateToggle() : undefined}
                onTouchEnd={handleExpandStateToggle}
              >
                <div className={`expand ${NftExpand.expand ? 'full' : ''}`} />
              </div>
              <div
                 onClick={!isTouchDevice ? () => {
                  deleteTap('Nft')
                 }: undefined
                }
                onTouchEnd={() => {
                  deleteTap('Nft')
              }}
              >
                <span className='x'>×</span>
              </div>
            </div>
          </div>

          <div className="file_edit_container">
              <p>File<span style={{left: '-23px'}}>_</span></p>
              <p>Edit<span style={{left: '-24px'}}>_</span></p>
              <p>View<span style={{left: '-32px'}}>_</span></p>
              <p>Help<span style={{left: '-30px'}}>_</span></p>
          </div>
          <div className="folder_content"
            onClick={() => setNftExpand(prev => ({...prev, item_1Focus: false}))}
            style={NftExpand.expand ? 
              { height: 'calc(100svh - 122px)'} 
              : 
              {}
            }
          >
            <div className="item_container">
              <div className='item_1'
                onDoubleClick={!isTouchDevice ? () => {
                  handleDoubleClickiframe('Nft', setOpenProjectExpand, setProjectUrl);
                  handleShow('Internet');
                } : undefined}
                
                onTouchEnd={() => {
                  handleDoubleTapiframeMobile('Nft', lastTapTime, setLastTapTime, setOpenProjectExpand, setProjectUrl);
                  handleShowMobile('Internet');
                }}

                onClick={(e) => {
                  e.stopPropagation();
                  iconFocusIcon('Nftfolder');
                }}
              >
                <img src={file4} alt="file4" 
                  className={NftExpand.item_1Focus? 'item_1_img_focus' : ''}
                />
                <p className={NftExpand.item_1Focus? 'item_1_p_focus' : ''}>
                  OpenNFT
                </p>
              </div>
            </div>
          </div>
          <div className="btm_bar_container">
            <div className="object_bar"><p>1 object(s) {NftExpand.item_1Focus?'selected':''}</p></div>
            <div className="size_bar"><p>50.98 MB</p></div>
          </div>
        </div>
      </Draggable>
    </>
  )
}          

export default NftFolder
