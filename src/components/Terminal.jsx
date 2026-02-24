import { useState, useEffect, useRef, useContext } from 'react';
import Draggable from './system/WindowDraggable';
import UseContext from '../Context';
import '../css/Terminal.css';
import { useSounds } from '../hooks/useSounds';
import terminalIcon from '../assets/Msdos-icon.svg';

// Mock File System
const fileSystem = {
    'C:': {
        type: 'dir',
        children: {
            'Users': {
                type: 'dir',
                children: {
                    'Dhruvin': {
                        type: 'dir',
                        children: {
                            'Projects': {
                                type: 'dir',
                                children: {
                                    'portfolio.txt': { type: 'file', content: 'This amazing Windows 95 portfolio! Built with React.' },
                                    'ai-agent.txt': { type: 'file', content: 'An advanced AI agent project.' },
                                    'readme.txt': { type: 'file', content: 'Check out my GitHub for more details: github.com/dhruvin-sarkar' }
                                }
                            },
                            'bio.txt': { type: 'file', content: 'Dhruvin Sarkar\nFull Stack Developer | AI Enthusiast\nLoves: React, Node.js, and Retro UIs.' },
                            'skills.txt': { type: 'file', content: '- JavaScript/TypeScript\n- React, Vue.js\n- Node.js, Python\n- C++\n- System Design' },
                            'contact.txt': { type: 'file', content: 'Email: dhruvinsarkar@outlook.com\nLinkedIn: linkedin.com/in/dhruvin-sarkar' }
                        }
                    }
                }
            },
            'Windows': {
                type: 'dir',
                children: {
                  'System32': {
                    type: 'dir',
                    children: {}
                  }
                }
            }
        }
    }
};

const Terminal = () => {
    const { 
        TerminalExpand, setTerminalExpand, 
        handleSetFocusItemTrue, 
        themeDragBar, 
        deleteTap,
        isTouchDevice,
        inlineStyle, inlineStyleExpand
    } = useContext(UseContext);

    const { playWindowMaximize, playWindowMinimize } = useSounds();

    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { output: 'Microsoft(R) Windows 95' },
        { output: '   (C)Copyright Dhruvin Sarkar 2009-2026.' },
        { output: '' }
    ]);
    const [cwd, setCwd] = useState(['C:', 'Users', 'Dhruvin']); // Current Working Directory path array
    const [matrixMode, setMatrixMode] = useState(false);
    const [textColor, setTextColor] = useState('#c0c0c0'); // Default styling color

    
    // Commands implementation helpers
    const getFormattedDate = () => {
        const date = new Date();
        return `Current date is ${date.toLocaleDateString()}`;
    };

    const getFormattedTime = () => {
        const date = new Date();
        return `Current time is ${date.toLocaleTimeString()}`;
    };

    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Sync initial position for correct maximization
    useEffect(() => {
        const initX = window.innerWidth <= 500 ? 5 : 150;
        const initY = window.innerWidth <= 500 ? 50 : 150;
        setTerminalExpand(prev => ({ ...prev, x: initX, y: initY }));
    }, [setTerminalExpand]);


    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input when clicking anywhere in terminal
    const handleTerminalClick = () => {
        if (!isTouchDevice) {
             inputRef.current?.focus();
        }
    };

    const getPrompt = () => {
        return `${cwd.join('\\')}>`;
    };

    const getDirFromPath = (pathArray) => {
        let node = fileSystem;
        for (const part of pathArray) {
             if (node[part]) {
                 node = node[part].children;
             } else {
                 return null;
             }
        }
        return node;
    };


    const handleCommand = (cmd) => {
        const args = cmd.trim().split(' ');
        const command = args[0].toLowerCase();
        const param = args[1];
        const restParams = args.slice(1).join(' ');

        const newHistory = [...history, { command: getPrompt(), input: cmd }];

        switch (command) {
            case 'help':
                newHistory.push({ output: 'Supported commands:\n  DIR    List files in current directory.\n  CD     Change directory.\n  MKDIR  Create a directory.\n  TYPE   View file content.\n  ECHO   Display messages.\n  CLS    Clear screen.\n  DATE   Display current date.\n  TIME   Display current time.\n  VER    Display Windows version.\n  WHOAMI Display user info.\n  EXIT   Close terminal.\n  MATRIX Toggle Matrix mode.' });
                break;
            case 'cls':
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'whoami':
                newHistory.push({ output: 'Dhruvin Sarkar\nFull Stack Developer & AI Enthusiast' });
                break;
            case 'ver':
                newHistory.push({ output: 'Microsoft Windows 95 [Version 4.00.950]\n(C) Copyright Dhruvin Sarkar 2009-2026' });
                break;
            case 'date':
                newHistory.push({ output: getFormattedDate() });
                break;
            case 'time':
                newHistory.push({ output: getFormattedTime() });
                break;
            case 'echo':
                newHistory.push({ output: restParams });
                break;
            case 'exit':
                setTerminalExpand(prev => ({ ...prev, hide: true, show: false }));
                deleteTap('Terminal');
                return;
            case 'dir':
            case 'ls': {
                const dir = getDirFromPath(cwd);
                if (dir) {
                    const lines = Object.keys(dir).map(name => {
                        const isDir = dir[name].type === 'dir';
                        // Formatting like DOS: DATE TIME <DIR> NAME (Simplified)
                        return `${isDir ? '       ' : '       '} ${isDir ? '<DIR>    ' : '         '} ${name}`;
                    });
                    newHistory.push({ output: lines.join('\n') });
                    newHistory.push({ output: `       ${Object.keys(dir).length} file(s)` });
                } else {
                   newHistory.push({ output: 'Error reading directory.' }); 
                }
                break;
            }
            case 'cd':
                if (!param) {
                    newHistory.push({ output: getPrompt() }); 
                } else if (param === '..') {
                    if (cwd.length > 1) {
                         setCwd(prev => prev.slice(0, -1));
                    }
                } else {
                    const currentDir = getDirFromPath(cwd);
                    if (currentDir && currentDir[param] && currentDir[param].type === 'dir') {
                        setCwd(prev => [...prev, param]);
                    } else {
                        newHistory.push({ output: 'The system cannot find the path specified.' });
                    }
                }
                break;
            case 'mkdir':
            case 'md':
                if (!param) {
                    newHistory.push({ output: 'The syntax of the command is incorrect.' });
                } else {
                    const currentDir = getDirFromPath(cwd);
                    if (currentDir) {
                        if (currentDir[param]) {
                            newHistory.push({ output: 'A subdirectory or file already exists.' });
                        } else {
                            currentDir[param] = { type: 'dir', children: {} };
                            newHistory.push({ output: '' }); // Success, check with dir
                        }
                    } else {
                         newHistory.push({ output: 'Error creating directory.' });
                    }
                }
                break;
            case 'type':
            case 'cat':
                 if (!param) {
                    newHistory.push({ output: 'The syntax of the command is incorrect.' });
                 } else {
                    const currentDir = getDirFromPath(cwd);
                    if (currentDir && currentDir[param] && currentDir[param].type === 'file') {
                        newHistory.push({ output: currentDir[param].content });
                    } else {
                        newHistory.push({ output: 'File not found.' });
                    }
                 }
                 break;
            case 'matrix':
                setMatrixMode(prev => !prev);
                newHistory.push({ output: matrixMode ? 'Matrix mode deactivated.' : 'Wake up, Neo...' });
                break;
            case 'color':
                if (args[0]) {
                    const colorMap = {
                        '0': 'black', '1': 'blue', '2': 'green', '3': 'aqua',
                        '4': 'red', '5': 'purple', '6': 'yellow', '7': 'white', 
                        '8': 'gray', '9': 'lightblue', 'a': '#00ff00', 'b': 'lightaqua',
                        'c': 'lightred', 'd': 'lightpurple', 'e': 'lightyellow', 'f': 'brightwhite'
                    };
                    const selectedColor = colorMap[args[0].toLowerCase()];
                    if (selectedColor) {
                        setTextColor(selectedColor);
                        setMatrixMode(false); // Disable matrix mode if color is manually set
                        newHistory.push({ output: '' });
                    } else {
                        newHistory.push({ output: 'Invalid color attribute.' });
                    }
                } else {
                    setTextColor('#c0c0c0'); // Reset to default
                    setMatrixMode(false);
                     newHistory.push({ output: '' });
                }
                break;
            case '':
                break;
            default:
                newHistory.push({ output: `'${command}' is not recognized as an internal or external command, operable program or batch file.` });
        }

        setHistory(newHistory);
        setInput('');
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        }
    };
    
    function handleExpandStateToggle() {
        setTerminalExpand(prevState => {
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

    return (
        <Draggable
            handle=".folder_dragbar_terminal"
            bounds={{ top: 0 }}
             defaultPosition={{ 
                x: window.innerWidth <= 500 ? 5 : 150,
                y: window.innerWidth <= 500 ? 50 : 150,
            }}
            disabled={TerminalExpand.expand}
            onStart={() => handleSetFocusItemTrue('Terminal')}
            onStop={(e, data) => {
                setTerminalExpand(prev => ({ ...prev, x: data.x, y: data.y }));
            }}
        >
            <div 
                className={`folder_folder_terminal ${matrixMode ? 'matrix-mode' : ''}`}
                style={{
                  ...(TerminalExpand.expand ? inlineStyleExpand('Terminal') : inlineStyle('Terminal')),
                  color: matrixMode ? '#00ff00' : textColor
                }}
                onClick={() => {
                   handleSetFocusItemTrue('Terminal');
                   handleTerminalClick();
                }}
            >
                <div 
                    className="folder_dragbar_terminal" 
                    style={{ background: TerminalExpand.focusItem ? themeDragBar : '#757579' }}
                    onDoubleClick={handleExpandStateToggle}
                >
                    <div className="folder_barname_terminal">
                        <img src={terminalIcon} alt="cmd" style={{ width: '16px', height: '16px' }}/>
                        <span>MS-DOS Prompt</span>
                    </div>
                    <div className="terminal_barbtn">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                setTerminalExpand(prev => ({ ...prev, hide: true, startActive: false }));
                                playWindowMinimize();
                            }}
                        >
                            <span className="dash"></span>
                        </div>
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpandStateToggle();
                            }}
                        >
                            <div className={`expand ${TerminalExpand.expand ? 'full' : ''}`} />
                        </div>
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                setTerminalExpand(prev => ({ ...prev, hide: true, show: false }));
                                deleteTap('Terminal');
                            }}
                        >
                            <span className="x">×</span>
                        </div>
                    </div>
                </div>

                {/* MS-DOS Toolbar */}
                <div className="terminal_toolbar" style={{ 
                    display: 'flex', 
                    background: '#c0c0c0', 
                    padding: '2px', 
                    borderBottom: '1px solid #000',
                    gap: '4px',
                    alignItems: 'center'
                }}>
                    <select style={{ fontSize: '11px', height: '20px', width: '60px' }}>
                        <option>Auto</option>
                        <option>7 x 12</option>
                        <option>8 x 12</option>
                        <option>10 x 18</option>
                    </select>
                    
                    {/* Toolbar Icons (Mocked with simple styles for now) */}
                    {['Mark', 'Copy', 'Paste', 'FullScreen', 'Properties', 'Background', 'Font'].map((item, idx) => (
                        <div key={idx} style={{ 
                            width: '20px', height: '20px', 
                            border: '1px solid white', 
                            borderRightColor: '#808080', 
                            borderBottomColor: '#808080',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }} title={item}>
                           {/* Simple SVGs or chars for icons */}
                           <div style={{ width: '12px', height: '12px', background: '#808080' }}></div>
                        </div>
                    ))}
                     <div style={{ 
                            width: '20px', height: '20px', 
                            border: '1px solid white', 
                            borderRightColor: '#808080', 
                            borderBottomColor: '#808080',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontWeight: 'bold', fontFamily: 'serif'
                        }} title="Font">
                           A
                    </div>
                </div>

                <div className="terminal_content" style={{ color: matrixMode ? '#00ff00' : '#c0c0c0' }}>
                    {history.map((line, i) => (
                        <div key={i} className="terminal_line">
                            {line.command && <span className="terminal_prompt">{line.command}</span>}
                            {line.input && <span className="terminal_input_text">{line.input}</span>}
                            {line.output && <div style={{ whiteSpace: 'pre-wrap', width: '100%' }}>{line.output}</div>}
                        </div>
                    ))}
                    <div className="terminal_input_line">
                        <span className="terminal_prompt">{getPrompt()}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="terminal_input"
                            style={{ color: matrixMode ? '#00ff00' : '#c0c0c0' }}
                            autoFocus={!isTouchDevice}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </Draggable>
    );
};

export default Terminal;
