---
title: Forwarding Graphics to SSH Client in WSL2 with VcXsrv Success!
tags: [SSH, WSL2]
style: 
color: 
description: Forward the graphical output from ssh server to wsl2 in windows 10
---

Source: [王旌羽](https://www.cnblogs.com/KylinBlog/p/16588037.html)

After encountering issues forwarding graphical applications from Linux server by X11 to **WSL2** in **Windows 10**, such as **Tkinter**, I finally achieved success by installing **VcXsrv** on Windows and setting up **xfce4** in WSL2. However, before that, it is quite smooth to have it work in Windows 11 dev without X server. Here's a quick recap of how I got everything working:

#### 1. Installed VcXsrv on Windows
I installed [VcXsrv](https://sourceforge.net/projects/vcxsrv/), a lightweight X server for Windows, which allowed me to display graphical applications from WSL2:
- During setup in Xlaunch (installed VcXsrv), I chose **Multiple Windows** mode and set the display num to 0 (you can also set it to 1 or some other number, but it is not possible to set it to -1 in vcxsrv-64.1.20.14.0 since the GUI only accept number input in Display number field)
![image](https://github.com/n7729697/n7729697.github.io/blob/master/files/Xlaunch1.png)

- Toggle **Start no client** then Next
![image](https://github.com/n7729697/n7729697.github.io/blob/master/files/Xlaunch1.png)

- Ensured **access control was disabled** for easier testing.
![image](https://github.com/n7729697/n7729697.github.io/blob/master/files/Xlaunch1.png)

P.S> If you set the Xlaunch to **One window** and **Display number** to 1 with correct `$DISPLAY=<your IP>:1`, you should be able to have wsl2 with GUI in windows and you have to keep the extra window alive.

#### 2. Installed xfce4 Desktop Environment in WSL2
To make it accessible to wsl2 in windows 10, I installed **xfce4**:
```bash
sudo apt update
sudo apt install xfce4
```
If it reports `Unable to locate package xfce4`, you should type `sudo apt update` to update the source.

#### 3. Configured the `DISPLAY` Variable
In WSL2, I set the `DISPLAY` environment variable to point to my Windows host’s IP address. This allowed graphical applications to be forwarded to the X server (VcXsrv):
```bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
```
But it does not work out for my IP with institutional router, so I just hard code the correct IP from `cmd.exe ipconfig` or `ip addr` in wsl2.

For convenience, you could set the `DISPLAY` in bash source file
```bash
echo 'export DISPLAY=<your IP>:0' >> ~/.bashrc
source ~/.bashrc
```

Once everything was set up, you could test the pipeline by ssh to your server typing `xclock`. Or you can directly test the X server in wsl2 by
```bash
xfce4-session
```

The main purpose of the `$DISPLAY` variable is to inform Linux graphical applications about the **X server's address** and **Display number**. Setting the address to the host machine's IP (where VcXsrv is running) should work fine. If `xfce4--session` fails to connect and shows an error like `xrdb: Connection timed out`, check if the IP can be pinged and ensure that the **Windows Firewall rules** are properly configured.

#### 4. Additional Configurations
To ensure smooth operation, I installed the necessary X11 fonts and Tkinter libraries in WSL2:
```bash
sudo apt install xfonts-base xfonts-scalable
sudo apt install python3-tk # please igore this if you do not use Tkinter
```

### Conclusion:
By combining **VcXsrv** on Windows with **xfce4** in WSL2, I was able to create a functional Linux GUI environment, making it possible to run Tkinter and other X11-based applications seamlessly on my Windows machine. This setup provides a great balance between the power of WSL2 and the flexibility of graphical Linux tools!

---

### Remarks

One important concept throughout this process is the **Display number** and the environment variable **`$DISPLAY`**. The Display number set in **VcXsrv** corresponds to the number after the colon in the **`$DISPLAY`** variable. If VcXsrv could use the default Display number (`-1`), it will automatically assign a number, but in my case, it is impossible.

When VcXsrv starts, it essentially creates a virtual display on Windows, and WSL applications need to connect to this virtual display to render correctly. **Linux uses the `$DISPLAY` environment variable to find the target display**. Many tutorials online suggest setting `$DISPLAY` to `:0.0`, which works on WSL1 but doesn’t on WSL2. This is because `:0.0` means `localhost:0.0`, where `0.0` represents Display 0 and Screen 0 (`D.S` format). You can check more details with `man X` in Linux and `q` to quit.

Another method often suggested is setting `$DISPLAY` to `$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0`, which pulls the nameserver's IP from `/etc/resolv.conf`. However, this method didn't work on my machine with institutional routering, possibly because the WSL2 nameserver IP is not the same as my Windows IP.

#### Why Disable Access Control?

In the last step of configuring VcXsrv, you’ll notice an option to check **"Disable access control"**. This allows any client program to connect to VcXsrv. Some tutorials recommend adding `-ac` in the **Additional parameters** of VcXsrv, which serves the same purpose. The `-ac` option disables access control restrictions, effectively letting all clients connect.

#### Why Add `export DISPLAY` to `.bashrc`?

If you only set the `$DISPLAY` variable in the terminal, it will work temporarily but might cause issues when running graphical programs in other terminals or graphical sessions. This is because the variable is only valid for the current terminal session. To avoid this, I added the `export DISPLAY` command to my `.bashrc` file, ensuring that the `$DISPLAY` variable is set automatically every time I open a new terminal. You can use other methods to permanently set the environment variable if preferred.