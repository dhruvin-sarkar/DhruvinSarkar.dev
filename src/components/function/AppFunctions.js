import msDosIcon from '../../assets/Msdos-icon.svg'
import Resume from '../../assets/folder.png'
import Mail from '../../assets/mail.png'
import Project from '../../assets/regFolder.png'
import Winamp from '../../assets/winampIcon.png'
import resumefile from '../../assets/resume.png'
import MineSweeper from '../../assets/minesweepericon.png'
import MSN from '../../assets/msn.png'
import ie from '../../assets/ie.png'
import settings from '../../assets/setting.png'
import file from '../../assets/file4download.png'
import disk from '../../assets/c.png'
import rom from '../../assets/rom.png'
import btc from '../../assets/btc_icon.webp'
import jpeg from '../../assets/jpeg.png'
import firstPic from '../../assets/001.jpg'
import secondPic from '../../assets/002.jpg'
import thirdPic from '../../assets/003.jpg'
import fourthPic from '../../assets/004.jpg'
import fifthPic from '../../assets/005.jpg'
import sixthPic from '../../assets/006.jpg'
import seventhPic from '../../assets/007.jpg'
import eighthPic from '../../assets/008.jpg'
import ninthPic from '../../assets/009.jpg'
import tenthPic from '../../assets/010.jpg'
import eleventhPic from '../../assets/011.jpg'
import binEmp from '../../assets/bin2.png'
import reset from '../../assets/reset.png'
import github from '../../assets/github.png'
import paint from '../../assets/paint.png'
import aiagent from '../../assets/ai_robot.png'
import cat from '../../assets/catpic.png'
import patch from '../../assets/patch.png'
import ThreedObject from '../../assets/3dObject.png'
import Fortune from '../../assets/fortune.png'
import run from '../../assets/run.png'
import backarrow from '../../assets/backarrow.png'
import tile from '../../assets/tile.png'
import taskmanager from '../../assets/taskmanager.png'
import notepad from '../../assets/notepad.png'
import store from '../../assets/store.png'
import layer from '../../assets/layer.png'
import game from '../../assets/doom.png'
import About from '../../assets/ipng.png'
import MyComputer from '../../assets/pc.png'
import VSCode from '../../assets/vscode.png'
import N64Icon from '../../assets/N64.png'
import PS1Icon from '../../assets/PS1.png'
import GBAIcon from '../../assets/GBA.png'
import NESIcon from '../../assets/NES.png'
import Quake1Icon from '../../assets/Quake 1.png'
import SkiFreeIcon from '../../assets/Skifree.png'
import Quake3Icon from '../../assets/quake3.png'
import ChromeDinoIcon from '../../assets/dino.png'
import DXBallIcon from '../../assets/dxball.png'
import Windows95Icon from '../../assets/image-removebg-preview.png'

const withBase = (relativePath) =>
  `${import.meta.env.BASE_URL}${String(relativePath).replace(/^\/+/, '')}`;



// style function for bg tap
export function StyleHide(index, tap, ObjectState) {
  const boxshadowstyleTrue = 'inset 1px 1px #000, 1px 1px #ffffffdd';
  const bgStyleTrue = '#dddcdc';

  const boxshadowstyleFalse = 'inset 1px 1px #ffffffdd, 1.5px 1.5px #000';
  const bgStyleFalse = '#b3b2b2';

  const setState = ObjectState();

  const namePassed = tap[index].toLowerCase().trim().replace(/\s/g, '');

  const foundItem = setState.find(item => {
    const itemName = item.name.toLowerCase().trim().replace(/\s/g, '');

    return itemName === namePassed
  })

  if (foundItem) {
    return foundItem.usestate.focusItem
      ? { boxShadow: boxshadowstyleTrue, background: bgStyleTrue }
      : { boxShadow: boxshadowstyleFalse, background: bgStyleFalse };
  }

  return {};

}


// Mapping image function
export function imageMapping (name, type) { 
  switch(name) {

    case 'About':
    case 'about':
      return About;

    case 'MS-DOS Prompt':
    case 'ms-dos prompt':
      return msDosIcon;

    case 'MyComputer':
    case 'My Computer':
      return MyComputer;

    case 'VS Code':
    case 'vscode':
      return VSCode;

    case 'Resume':
      return Resume;

    case 'Mail':
      return Mail;

    case 'Project':
    case 'Picture':
    case 'Utility':
      return Project;

      case 'Nft':
      case 'Note':
        return file;
      
    case 'Winamp':
      return Winamp;

    case 'ResumeFile':
      return resumefile;

    case 'MineSweeper':
    case 'Mine Sweeper':
      return MineSweeper;

    case 'MSN':
      return MSN;

    case 'Internet Explorer':
    case 'Internet-Explorer':
    case 'ie':
      return ie

    case 'Nintendo 64':
      return N64Icon;

    case 'PlayStation 1':
      return PS1Icon;

    case 'Game Boy Advance':
      return GBAIcon;

    case 'NES Emulator':
      return NESIcon;

    case 'Windows 95':
      return Windows95Icon;

    case 'Commander Keen 4':
      return withBase('icons/commanderkeen.svg');

    case 'Space Cadet Pinball':
      return withBase('icons/spacecadet.svg');

    case 'Quake III Arena':
      return Quake3Icon;

    case 'Quake I':
    case 'Quake':
      return Quake1Icon;

    case 'Chrome Dino':
      return ChromeDinoIcon;

    case 'DX-Ball':
      return DXBallIcon;

    case 'SkiFree':
      return SkiFreeIcon;

    case 'Settings':
      return settings;

    case 'Hard Disk (C:)':
    case 'Hard Disk (D:)':
      return disk;

    case 'CD-ROM':
    case 'cd-rom':
      return rom;

    case 'Bitcoin':
    case 'bitcoin':
      return btc

    case name[0] === '0':
    case 'Photo':
    case 'Jpeg':
      return jpeg;
    
    case 'bin':
    case 'RecycleBin':
    case 'recyclebin':
      return binEmp;

    case 'ResetStorage':
      return reset;

    case 'Github':
      return github;

    case "paint":
    case "Paint":
      return paint;

    case "AiAgent":
      return aiagent;

    case "Cat":
    case "cat":
      return cat;

    case "patch":
    case "Patch":
      return patch;

    case "3dObject":
      return ThreedObject;

    case "Fortune":
    case "fortune":
      return Fortune;

    case "Run":
      return run;
    case "Terminal":
      return msDosIcon;

    case "Exit":
      return backarrow;

    case "tile":
    case "Tile":
      return tile;

    case "TaskManager":
    case "taskmanager":
      return taskmanager;

    case "NewFolder":
    case "newfolder":
      return Project;

    case "NotePad":
    case "notepad":
      return notepad

    case "Store":
    case "store":
      return store

    case "PixelPic":
    case "pixelpic":
      return layer

    case "DOOM":
    case "doom":
      return game

    default:
      if(type === 'folder') {
        return Project;
      }
      if(type === 'notepad') {
        return notepad;
      }
      return null;
  }
}

// set photo to the current photo
const photoMap = {
  '1': firstPic,
  '2': secondPic,
  '3': thirdPic,
  '4': fourthPic,
  '5': fifthPic,
  '6': sixthPic,
  '7': seventhPic,
  '8': eighthPic,
  '9': ninthPic,
  '10': tenthPic,
  '11': eleventhPic,
};

export function handleDoubleClickPhotoOpen(name, setCurrentPhoto) {
  
  const normalized = String(parseInt(name, 10));

  const pic = photoMap[normalized];
  if (!pic) return;

  setCurrentPhoto({ name: normalized, pic });
}


export function handleDoubleClickPhotoOpenMobile(name, setCurrentPhoto, lastTapTime, setLastTapTime) {
  const now = Date.now();
  if (now - lastTapTime < 300) {
    
    const normalized = String(parseInt(name, 10));

  const pic = photoMap[normalized];
  if (!pic) return;

  setCurrentPhoto({ name: normalized, pic });
  }
  setLastTapTime(now);
  }

// click to open links
export function handleDoubleClickiframe(name) {
  // Projects removed - replace with your own projects
}

export function handleDoubleTapiframeMobile(name, lastTapTime, setLastTapTime) {
  const now = Date.now();
  if (now - lastTapTime < 300) {
    // Projects removed - replace with your own projects
  }
  setLastTapTime(now);
  }

export function handleDoubleClickEnterLink(name, handleshow) {

  // Projects removed - replace with your own projects
  if (name === 'Github') {
    handleshow('Github'); 
  }
}


export function handleDoubleTapEnterMobile(name, lastTapTime, setLastTapTime) {
  const now = Date.now();
  if (now - lastTapTime < 300) {
    // Projects removed - replace with your own projects
    if (name === 'Github') {
      window.open('https://github.com/dhruvin-sarkar', '_blank');
    }
  }
  setLastTapTime(now);
}

export function iconContainerSize(size) {
  switch(size) {
    case 1:
      return {width: '85px', height: '90px'};
    case 2:
      return {width: '80px', height: '85px'};
    case 3:
      return {width: '75px', height: '80px'};
    case 4:
      return {width: '70px', height: '75px'};
    case 5:
      return {width: '65px', height: '70px'};
    default:
      return {width: '85px', height: '90px'};
  }
}
export function iconImgSize(size) {
  switch(size) {
    case 1:
      return {width: '55px'};
    case 2:
      return {width: '50px'};
    case 3:
      return {width: '45px'};
    case 4:
      return {width: '40px'};
    case 5:
      return {width: '35px'};
    default:
      return {width: '55px'};
  }
}
export function iconTextSize(size) {
  switch(size) {
    case 1:
      return {fontSize: '16px', lineHeight: '13px', number: 1};
    case 2:
      return {fontSize: '15px', lineHeight: '12px', number: 2};
    case 3:
      return {fontSize: '14px', lineHeight: '12px', number: 3};
    case 4:
      return {fontSize: '13px', number: 4};
    case 5:
      return {fontSize: '12px', number: 5};
    default:
      return {fontSize: '16px', lineHeight: '13px', number: 1};
  }
}
