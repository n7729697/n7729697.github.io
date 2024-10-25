---
title: connect airpods in Ubuntu 22.04 LTS
tags: [bluetooth, airpods, ubuntu]
style: fill
color: info
description: Fix the error happened when qqmusic new installed, probably because of high resolution of screen
---
source: [How to connect Apple AirPods to Linux (Debian/Ubuntu/Mint)](https://gist.github.com/aidos-dev/b49078c1d8c6bb1621e4ac199d18213b)
```
Distributor ID: Ubuntu
Description: Ubuntu 22.04.4 LTS
Release: 22.04
Codename: jammy
```
When connecting AirPods (or any Bluetooth audio device) to Ubuntu, the ControllerMode setting in the Bluetooth configuration file (`/etc/bluetooth/main.conf`) determines how your Bluetooth adapter operates. Here’s a quick overview of what each mode does and why you might choose one over the other:

`ControllerMode = bredr`: This mode restricts the Bluetooth adapter to use only the BR/EDR (Bluetooth Classic) mode, which is typically more stable for audio devices like headphones and speakers. Many audio devices, especially those using the A2DP profile for high-quality audio, work more consistently with this mode since BR/EDR is optimized for continuous data streaming.

`ControllerMode = le`: This mode restricts the adapter to Low Energy (LE) mode, which is used for devices that require lower power consumption and transfer small amounts of data, like fitness trackers or IoT devices. LE mode does not support high-quality audio profiles well, so it may cause issues with audio quality or connectivity with devices like AirPods.

`ControllerMode = dual`: This allows the Bluetooth adapter to use both BR/EDR and LE modes simultaneously, supporting a broader range of devices. However, on some systems and with some Bluetooth adapters, the dual mode can cause instability or unreliable connections for audio devices.

In the [post](https://gist.github.com/aidos-dev/b49078c1d8c6bb1621e4ac199d18213b), it is instructed to use `ControllerMode = bredr`, but for a wider connection possiblities, I set `ControllerMode = dual`, it should work fine either way.

1. `Ctrl + Alt + T` to open a new terminal:
```bash
sudo vim /etc/bluetooth/main.conf
```
The terminal will ask you to input your password. Please type it :)

2. Find the line and uncomment it:
```bash
ControllerMode = dual
```
Hint: you could use `/` to search for the word (similar usage as Ctrl + F)

3. Exit vim with `Esc` and `:wq`. Then run the following to restart the service:
```bash
sudo /etc/init.d/bluetooth restart
```
4. Connect your PC to audio device by bluetooth. 

Finally, after all these steps you should find your AirPods on Bluetooth settings section and connect it ;)