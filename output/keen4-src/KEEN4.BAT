@echo off
REM DOS Games Archive DOSBox launch script
REM 
REM Game: Commander Keen: Goodbye, Galaxy! Shareware 1.3
REM Configuration: standard
REM 
config -set cpu "cycles=auto 6075 98%% limit 23880"
config -set render aspect=true
cd KEEN4
loadfix -25
KEEN4E.EXE
PAUSE >NUL
loadfix -f
cd..
cls
echo Thank you for playing Commander Keen: Goodbye, Galaxy! Shareware!
echo.
echo To play again, type KEEN4 and press Enter
echo.
echo Your DOS Games Archive http://www.dosgamesarchive.com/
@echo on