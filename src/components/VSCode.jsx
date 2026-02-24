import { useContext } from 'react';
import UseContext from '../Context';
import Draggable from './system/WindowDraggable';
import { motion } from 'framer-motion';
import { useSounds } from '../hooks/useSounds';
import '../css/VSCode.css';
import '../css/ResumeFolder.css'; 
import vscIcon from '../assets/vscode.png';

export default function VSCode() {
    const {
        VSCodeExpand, setVSCodeExpand,
        VSCodeRef,
        themeDragBar,
        deleteTap,
        inlineStyleExpand,
        inlineStyle,
        handleSetFocusItemTrue,
        lastTapTime, setLastTapTime,
        StyleHide,
    } = useContext(UseContext);

    const { playWindowMaximize: playMax, playWindowMinimize: playMin } = useSounds();

    function handleExpandStateToggle() {
        setVSCodeExpand(prevState => {
            const willExpand = !prevState.expand;
            if (willExpand) playMax(); else playMin();
            return { ...prevState, expand: willExpand };
        });
    }

    function handleExpandStateToggleMobile() {
        const now = Date.now();
        if (now - lastTapTime < 300) handleExpandStateToggle();
        setLastTapTime(now);
    }

    if (!VSCodeExpand.show) {
        return null;
    }

    return (
        <Draggable
            nodeRef={VSCodeRef}
            axis="both"
            handle=".vscode_drag_bar"
            grid={[1, 1]}
            scale={1}
            disabled={VSCodeExpand.expand}
            bounds={{ top: 0 }}
            defaultPosition={{ 
                x: window.innerWidth <= 500 ? 10 : 100,
                y: window.innerWidth <= 500 ? 40 : 100,
            }}
            onStart={() => handleSetFocusItemTrue('VS Code')}
            onStop={(e, data) => {
                setVSCodeExpand(prev => ({ ...prev, x: data.x, y: data.y }));
            }}
        >
            <motion.div
                ref={VSCodeRef}
                className="vscode_window"
                style={{
                    ...(VSCodeExpand.expand ? inlineStyleExpand('VS Code') : inlineStyle('VS Code')),
                    zIndex: VSCodeExpand.hide ? '-1' : (VSCodeExpand.focusItem ? '999' : VSCodeExpand.zIndex),
                    display: VSCodeExpand.hide ? 'none' : 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSetFocusItemTrue('VS Code');
                }}
            >
                <div className="vscode_drag_bar"
                    onDoubleClick={handleExpandStateToggle}
                    onTouchStart={handleExpandStateToggleMobile}
                    style={{ background: VSCodeExpand.focusItem ? themeDragBar : '#757579' }}
                >
                    <div className="folder_barname">
                        <img src={vscIcon} alt="VS Code" style={{ width: '16px', height: '16px' }} />
                        <span>Visual Studio Code</span>
                    </div>
                    <div className="folder_barbtn">
                        <div onClick={(e) => {
                            e.stopPropagation();
                            playMin();
                            setVSCodeExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                        }}>
                            <p className='dash'></p>
                        </div>
                        <div onClick={handleExpandStateToggle}>
                            <motion.div className={`expand ${VSCodeExpand.expand ? 'full' : ''}`} />
                            {VSCodeExpand.expand ? <div className="expand_2"></div> : null}
                        </div>
                        <div onClick={() => deleteTap('VS Code')}>
                            <p className='x'>×</p>
                        </div>
                    </div>
                </div>

                <div className="vscode_menu_bar">
                    <span>File</span>
                    <span>Edit</span>
                    <span>Selection</span>
                    <span>View</span>
                    <span>Go</span>
                    <span>Run</span>
                    <span>Terminal</span>
                    <span>Help</span>
                </div>

                <div className="vscode_main_content">
                    <iframe 
                        src="https://github1s.com/dhruvin-sarkar/Win95P-DevPortfolio" 
                        title="VS Code Editor"
                        className="vscode_iframe"
                        frameBorder="0"
                    />
                </div>
            </motion.div>
        </Draggable>
    );
}
