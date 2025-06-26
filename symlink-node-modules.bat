@echo off
echo Creating symlink to shared node_modules...

REM Remove existing node_modules if it exists
if exist node_modules (
    rmdir /s /q node_modules
)

REM Create symbolic link to shared node_modules
mklink /D node_modules C:\MYCLAUDE_PROJECT\node_modules

echo Symlink created successfully!
echo You can now run npm commands normally.

pause