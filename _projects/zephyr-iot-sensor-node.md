---
name: IoT Sensor Node and Base Station with Zephyr RTOS (Uppsala University PES, Teaching Project)
tools: [Zephyr RTOS, C, Devicetree, Kconfig, West, CMake, Zephyr Sensor API, UART, I2C, ADC, Raspberry Pi Pico 2 (RP2350)]
image: /files/zephyr-pes/cover-placeholder.png
description: A teaching project for the PES course at Uppsala University. Two Raspberry Pi Pico 2 boards run Zephyr; one produces synthetic sensor readings and the other receives them over UART through a custom Zephyr Sensor API driver. The project teaches devicetree, Kconfig, the driver model, interrupt-to-thread design, and protocol engineering, and records the cautions found while building it.
---

# **IoT Sensor Node and Base Station with Zephyr RTOS**

<i class="fas fa-university"></i> Uppsala University, PES course, teaching project &nbsp;·&nbsp; Zephyr RTOS, two Raspberry Pi Pico 2 boards, no physical sensors required

![Zephyr RTOS logo](https://commons.wikimedia.org/wiki/Special:FilePath/Zephyr_RTOS_logo_2015.svg?width=240)
Figure 1. The Zephyr RTOS logo. Source: [File:Zephyr RTOS logo 2015.svg](https://commons.wikimedia.org/wiki/File:Zephyr_RTOS_logo_2015.svg). License: Apache License 2.0.

## 1. Why this project

Most embedded-systems courses stop at "blink an LED" or "read a register". A modern product has a different shape: a **real-time operating system**, a **hardware description separate from the code**, **drivers behind standard APIs**, **communication between nodes**, and a **build system** that ties them together. Zephyr is a good vehicle for this, but its concepts (devicetree, Kconfig, west, the device model) are the hard part for a newcomer, and they are hard to see when a project is wired to real sensors that may or may not work.

So this project removes the sensors. **One Pico 2 generates synthetic measurements; a second Pico 2 receives them over UART and exposes them through the standard Zephyr Sensor API.** Everything that matters for learning is real: the devicetree, the custom driver, the interrupt-driven receive path, the application protocol, and the way an application is expected to use a sensor. The physical sensors (BME680, VEML7700, VL53L5CX, a force gauge) are only what the dummy values stand in for, and the project shows exactly where to swap them in.

**Status, stated plainly.** The firmware has been written and reviewed, and the protocol code has been tested on a host computer (section 6). It has **not yet been built or run on the boards**: no Zephyr workspace was available when it was written. Everything below that describes hardware behaviour is therefore a design intent to be verified, and the verification checklist in section 8 is part of the project.

> **Figure placeholder 2 (needed from you).** A photo of the two boards on a breadboard, wired as in section 3, with TX/RX crossed, a common ground, and the three buttons. Please take it from above with both USB cables visible. Suggested filename: `/files/zephyr-pes/two-boards.jpg`.

## 2. What the student learns

After the project a student can:

1. describe how a Zephyr application is assembled from **devicetree, Kconfig, CMake, and source code**, and say which layer decides what;
2. use the **Sensor API correctly** (`fetch` then `get`, check every return value, convert `struct sensor_value`);
3. write a **driver** as an adapter to an existing API, including a devicetree binding;
4. move work from an **interrupt to a thread** safely;
5. design a small **binary protocol** with framing, versioning, and an integrity check, and test it off-target;
6. recognise the **common traps** (section 7) before they cost a lab session.

## 3. System architecture

```
 Sensor Pico 2 (producer)                                Base Pico 2 (consumer)
 -------------------------                               -------------------------
  read_*_into_sample()  (synthetic)                       sensor_sample_fetch(dev)
  read_all_sensors()                                       sensor_channel_get(dev, chan, &v)
          |                                                        ^   ^
  send_packet()  ---- UART0, 115200 8N1 ----------------->  dummy_env_sensors driver
  GP0 TX  -----------------------------------------------> GP1 RX    (RX ISR -> ring buffer
  GP1 RX  <----------------------------------------------- GP0 TX     -> parser + CRC -> cache)
          ^                                                        ^
   request frames (button)                       GP20/21/22 buttons -> GPIO ISR -> atomic mask + semaphore
```

The base application never sees a byte. It sees six sensor channels, and one private request attribute.

| Measurement | Stand-in device and interface (design) | Where the base reads it |
| --- | --- | --- |
| Temperature, pressure, humidity | BME680, I2C address 0x77 | `SENSOR_CHAN_AMBIENT_TEMP`, `SENSOR_CHAN_PRESS`, `SENSOR_CHAN_HUMIDITY` |
| Illuminance | VEML7700, I2C 0x10 | `SENSOR_CHAN_LIGHT` |
| Distance | VL53L5CX, I2C 0x29 (the datasheet's 0x52 is the shifted 8-bit form of the same address) | `SENSOR_CHAN_DISTANCE` |
| Force | analog gauge on ADC channel 0 | a private channel (`SENSOR_CHAN_PRIV_START`) |
| Board to board | UART0, GP0 TX and GP1 RX | the driver |
| Logs | USB CDC ACM to the host | `printk` |

![An I2C bus with one master and several slave devices](https://commons.wikimedia.org/wiki/Special:FilePath/I2C.svg?width=500)
Figure 2. I2C: one bus, two shared lines (SDA, SCL), devices selected by address. The three I2C sensors of the real design would share GP4 and GP5; the dummy firmware does not touch them. Source: [File:I2C.svg](https://commons.wikimedia.org/wiki/File:I2C.svg). License: CC BY-SA 3.0.

## 4. The Zephyr concepts, one by one

### 4.1 Four layers decide what you build

A Zephyr application is the sum of four independent descriptions, and most beginner confusion is about which one to edit:

| Layer | Question it answers | File here | Common mistake |
| --- | --- | --- | --- |
| **Devicetree** | What hardware exists and how is it connected? | `*.overlay`, bindings YAML | Naming `uart0` and assuming it selects pins; the pins come from the board's pinctrl |
| **Kconfig** | Which software features are compiled in, and with what values? | driver `Kconfig`, `prj.conf` | Setting `CONFIG_FOO=y` for an option that no Kconfig file defines (read the Kconfig output of the build: an undefined symbol is reported, and a typo in `prj.conf` otherwise leaves the feature off) |
| **CMake** | Which source files go into the image? | `CMakeLists.txt` | Putting a driver in `drivers/sensor/` and expecting Zephyr to build it: the folder is only a convention |
| **Source** | What does the code do? | `src/main.c`, the driver | Forgetting that a devicetree node must exist **and** be `status = "okay"` for an instance to be created |

The generated files `build/<role>/zephyr/zephyr.dts` and `.config` are the ground truth. Read them, and change the sources, never the generated files.

### 4.2 Devicetree in this project

The base overlay adds one node that represents the remote sensor and gives the application a name for it:

```dts
remote_env0: remote-env {
    compatible = "dummy,env-sensors";
    uart = <&uart0>;
    fetch-timeout-ms = <1500>;
    stale-timeout-ms = <0>;
    status = "okay";
};
```

- The **binding** (`dummy,env-sensors.yaml`) is a schema: the property types, defaults, and which are required. It is not executable code. For the build to find it, the application's directory is appended to `DTS_ROOT` **before** `find_package(Zephyr)` in `CMakeLists.txt`.
- The **driver** starts with `#define DT_DRV_COMPAT dummy_env_sensors`, which is the compatible string with punctuation turned into underscores, and ends with `DT_INST_FOREACH_STATUS_OKAY(...)`, which stamps out one device per enabled matching node. If the compatible in the overlay, the YAML, and the macro do not agree, **nothing is instantiated and nothing warns you**.
- `uart = <&uart0>` is a phandle; the driver turns it into a `const struct device *` with `DEVICE_DT_GET(DT_INST_PHANDLE(inst, uart))`.
- `aliases { envnode = &remote_env0; }` gives the application a stable name that survives a node being renamed, and `chosen { zephyr,console = &cdc_acm_uart0; }` sends `printk` to USB so that the physical UART stays free for binary packets.
- The three buttons are `gpio-keys` children with `GPIO_ACTIVE_LOW | GPIO_PULL_UP`, and the code retrieves controller, pin and flags in one object with `GPIO_DT_SPEC_GET`.

### 4.3 The driver is an adapter

A driver in Zephyr is whatever implements an API for a device. This one implements `sample_fetch`, `channel_get`, and `attr_set`, and its hardware is a UART. It is registered with `SENSOR_DEVICE_DT_INST_DEFINE(..., POST_KERNEL, CONFIG_SENSOR_INIT_PRIORITY, &api)`, so it initialises after the kernel and the UART it depends on. The init function checks `device_is_ready(uart)` and fails with `-ENODEV` otherwise: **a driver must never assume its dependencies are up**.

### 4.4 The Sensor API contract

The contract that the base application follows is:

1. `sensor_sample_fetch(dev)`: acquire new data into the driver's cache; **check the return value**.
2. `sensor_channel_get(dev, channel, &value)` for each channel, again checking the result.
3. Values are `struct sensor_value`: `val1` is the integer part and `val2` is the fractional part in **millionths**, with the sign carried consistently.

`get` never talks to the hardware; it converts what `fetch` cached. Calling `get` alone does not request a new measurement. A request in this project is a custom extension (`sensor_attr_set` with a private attribute selecting one of three groups), which is legal but **not** something other sensor drivers understand, and the header says so.

Unit conversion deserves a test, because C integer division truncates toward zero. For a value in milli-units $m$, the driver sets `val1 = m / 1000` and `val2 = (m % 1000) * 1000`, which gives the right result for negative numbers as well (for example, $-1500$ milli gives $(-1,\,-500000)$, that is $-1.5$). Pressure is received in pascals but the Sensor API pressure channel is in **kilopascals**, so $101325$ Pa becomes $(101,\,325000)$.

### 4.5 Interrupt to thread: where the work belongs

Two interrupt sources exist on the base, and both follow the rule that **an interrupt does the least possible and a thread does the rest**.

- **UART RX.** The ISR drains the FIFO into a bounded `ring_buf` (256 bytes) and counts dropped bytes on overflow. Parsing, CRC and the cache update happen later, inside `sensor_sample_fetch()`, in the caller's context. The ring buffer is accessed from the thread with `irq_lock()` around each get, so the producer (ISR) and consumer (thread) never touch it at once.
- **Buttons.** The GPIO callback sets a bit in an `atomic_t` mask and gives a semaphore that was created with a limit of one (`K_SEM_DEFINE(sem, 0, 1)`). Several presses in a short time collapse to one wake-up carrying a combined mask; the main loop sleeps 20 ms to **debounce**, atomically clears the mask, and then runs the UART transaction in thread context, where blocking is allowed.

The **TX path** uses a mutex so two callers cannot interleave bytes of different frames.

### 4.6 A protocol is an interface specification

UART carries bytes; the project adds meaning with a frame:

```
 A5 5A | version | type | sequence | payload length | payload (0..28 B) | CRC-16 (little-endian)
```

- **Start markers** let a receiver resynchronise after noise; a parser that sees a lone `A5` followed by something other than `5A` restarts cleanly, and counts the event for diagnostics.
- **Version and length** are validated before the payload is touched, and the length is bounded by a constant, so a corrupted length byte cannot cause an overrun.
- **Explicit little-endian packing** with shift-and-mask helpers is used instead of casting a struct to bytes, which avoids alignment, padding, and endianness assumptions.
- **CRC-16/CCITT** (initial value 0xFFFF, polynomial 0x1021) detects corruption. It is not an acknowledgement, a retransmission scheme, or a security mechanism, and the documentation says so.
- A **status word** travels with the data, with a `SIMULATED` bit and per-sensor `MISSING` bits, so the consumer can tell dummy data from real data and a failed sensor from a good reading.

Two real frames from the host test (periodic telemetry for a 60-second counter value of 7, and a request for the environmental group):

```
 A5 5A 03 80 05 1C | 36 56 00 00  D4 8B 01 00  54 B0 00 00  38 AF 04 00  17 02 00 00  2E 04 00 00  01 00 00 00 | F2 D5
 start ver type seq len   temp       pressure     humidity     light         distance     force        status       CRC

 A5 5A 03 10 00 00 | 1A 27          request BME680, zero payload (8 bytes)
```

At 115200 baud with 8N1 framing (10 bits per byte), the 36-byte periodic frame takes 3.1 ms on the wire and the 8-byte request 0.7 ms.

> **Figure placeholder 3 (needed from you).** A logic-analyser or oscilloscope capture of one UART frame on GP0, with the decoded bytes, or a screenshot of the two serial terminals side by side. Suggested filename: `/files/zephyr-pes/uart-frame.png`.

### 4.7 The base application loop

The main thread alternates between a wake-up from the button semaphore (waited with a 100 ms timeout) and a periodic fetch. After a button press it sends the request through the Sensor API, waits for the typed response, and prints only the requested channels. The fetch for ordinary telemetry waits only 25 ms, so between the one-second packets it returns `-EAGAIN`, which the application treats as "no new data", not as a failure.

## 5. Engineering practice shown in the project

- **Separate the contract from the implementation.** The application depends only on the Sensor API; swapping the UART adapter for real I2C drivers should not change its call sequence. The producer's `read_*` functions are the only place that has to change when real sensors are added.
- **Honest data labels.** Dummy values are flagged `SIMULATED` on the wire. The documentation says what is not implemented (no real I2C or ADC access) instead of leaving a reader to find out.
- **Bounded everything.** Ring size, payload length, retry windows, and timeouts are constants, and every external input is validated before it is used.
- **Every function returns, and every return is checked.** Errors use standard `errno` values, and a diagnostic snapshot (counters for bytes, framing errors, and dropped bytes, plus the last 32 raw bytes) is printed on a failed request, so wiring faults show up as data.
- **Comments say why.** Each configuration line in `prj.conf` is preceded by its purpose, and the headers state the caller's obligations (for example, "the caller supplies at least four readable bytes").
- **Provenance and reproducibility.** The README names the project it was adapted from and points to a `REFERENCE.md` for the exact source commit; **that file is not in the repository yet and should be added**. Build outputs are ignored, and the other missing piece is a **pinned Zephyr release** and a west manifest.
- **Test what can be tested off-target.** The protocol header is plain C with no Zephyr dependency, so it can be unit-tested on a laptop.

## 6. Verification so far: the protocol on the host

I compiled the protocol header with a host compiler (`gcc -Wall -Wextra`, no warnings) and tested it:

| Check | Result |
| --- | --- |
| CRC-16/CCITT of the ASCII string `123456789` | `0x29B1`, the standard check value |
| Full-telemetry frame length | 36 bytes (6 header + 28 payload + 2 CRC) |
| Encode, decode, compare for a full sample | identical, type `0x80`, sequence 5, length 28 |
| Request frame length | 8 bytes |
| Every single-bit error in a 36-byte frame (288 cases) | all rejected, none accepted |
| Milli-unit conversion for $22070$, $-500$, $-1500$, $0$, $999$ | $22.07$, $-0.5$, $-1.5$, $0$, $0.999$ |

These checks show the framing and the integrity check are correct. They say nothing about the timing behaviour or the Zephyr integration, which need the boards.

## 7. Cautions: what to watch for

Items marked **(documented)** are in the project's README; items marked **(review)** were found by reading the code and need a test on hardware to confirm.

1. **GPIO numbers are not header pin numbers.** `GP20` is a GPIO number; use the board pinout before wiring. **(documented)**
2. **`uart0` in an overlay does not choose pins.** The overlays inherit pinctrl, baud rate, and enabled state from the board definition. Inspect the generated `zephyr.dts` and override pinctrl and `current-speed` in both overlays if the board defaults differ. **(documented)**
3. **Board name syntax changed across releases.** This project uses `rpi_pico2/rp2350a/m33`, and the pinctrl macro name for the alternate UART function differs between versions, so the overlay carries a compatibility `#define`. Check the symbols against the release you install. **(documented)**
4. **TX and RX must cross, and grounds must be shared**, with 3.3 V logic only. A UART at RS-232 levels would damage the pins. **(documented)**
5. **USB identity.** The VID/PID in `prj.conf` are inherited from the reference; use an authorised pair for anything distributed. **(documented)**
6. **The base blocks until a terminal asserts DTR.** This is convenient for catching the boot logs but means the base does nothing when it is powered without a host. The sensor node bounds the same wait to two seconds, which is the better pattern for a device that must run headless. **(documented behaviour; the asymmetry is deliberate but worth discussing)**
7. **A timed-out request leaves the driver waiting for a reply type that never came.** After `-EIO`, `expected_response_type` is not cleared, so later periodic frames are discarded as "unexpected type" and every ordinary fetch waits the full 1500 ms, until a matching response arrives. A fix is to clear the expected type on timeout. **(review)**
8. **Two consumers on one UART.** `sample_fetch` drains the ring buffer and then also calls `uart_poll_in()` on a UART that has interrupt-driven RX enabled. Mixing polled and interrupt-driven access to one port is fragile: choose one path (here, the ring buffer) and remove the other. **(review)**
9. **The sensor node polls the UART every 2 ms.** At 115200 baud a byte arrives every 87 µs, so 2 ms is about 23 bytes. If the hardware FIFO is 32 bytes deep (check the datasheet), the margin is about 0.8 ms; a blocking `printk` over USB can eat it. Request frames are only 8 bytes, so it works, but an interrupt or a thread with a semaphore would remove the risk. **(review)**
10. **Periodic timing drifts.** The producer schedules the next send as `now + 1000 ms`, so each period gains the jitter of the loop. Scheduling `next += period` keeps the average rate exact. **(review)**
11. **Requests are matched by response type, not sequence number**, so a late reply to an old request can be mistaken for the current one; the sequence byte is transmitted but unused. **(documented)**
12. **Fetch and get are not thread-safe against each other.** Call them from one context unless you add synchronisation. **(documented)**
13. **`channel_get` is only valid after a successful fetch**; the driver returns `-ENODATA` if nothing valid has arrived since a request, which is the correct behaviour to rely on. **(documented in the driver)**
14. **A dummy is not a driver for the real chip.** Replacing the formulas with sensor reads also means identity checks, calibration, supply limits, and clearing the `SIMULATED` flag. **(documented)**
15. **No pinned Zephyr release yet.** Until the project fixes a release and a west manifest, a fresh checkout may not build. **(documented)**
16. **A dangling reference.** The README links to `REFERENCE.md` for provenance, and the file does not exist in the repository. **(review)**

## 8. Verification checklist for the boards

1. Build both applications and inspect `build/*/zephyr/zephyr.dts` for the UART pins, baud rate, console, and enabled nodes, and `.config` for the selected options.
2. Flash both boards, connect UART and ground, and open both USB terminals; confirm the telemetry values advance and repeat every 60 seconds.
3. Press each button and confirm the matching group in the response log.
4. Disconnect the UART and confirm the base reports a timeout, then reconnect and confirm that periodic data **resumes** (this tests caution 7).
5. Corrupt a byte on purpose (for example with a jumper glitch or a test build) and confirm that the bad-frame counter increases and no value is cached.
6. Measure the producer's period with a logic analyser to check caution 10.

> **Figure placeholder 4 (needed from you).** The serial log of the base station during step 2 and step 4 (screenshot). Suggested filename: `/files/zephyr-pes/base-log.png`.

## 9. Going further

- Replace the producer's `read_*` functions with real I2C and ADC code, using the in-tree Zephyr drivers where your release provides them, and keep the wire units and the status word.
- Move periodic scheduling to a `k_timer` or a dedicated thread, and use a message queue or `k_poll` instead of the 5 ms polling inside `sample_fetch`.
- Replace `printk` with the logging subsystem and add a shell on the USB console.
- Add a test harness on `native_sim` or with `twister` so the driver parser can run in CI, and add the protocol tests of section 6 to it.
- Add authentication or encryption if the link ever leaves the bench; the CRC does not protect against tampering.

*The project is adapted from the NewSensor reference design (see the README); the exact source commit still needs to be recorded in the missing `REFERENCE.md`.*
