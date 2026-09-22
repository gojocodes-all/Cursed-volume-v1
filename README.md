# Cursed Volume v1

A zero-dependency browser experiment that turns a volume control into a catapult. Pull the knob below zero, release it, and a small physics simulation decides where the volume lands.

The intentionally awkward interaction is the point: this is the first entry in the repository's “Cursed JavaScript Projects” series, not a recommended pattern for production audio controls.

## Run locally

No installation or build step is required.

1. Clone or download the repository.
2. Open `index.html` in a modern browser.
3. Press **Play test sound** if you want to hear the selected volume.

The interface and simulation run entirely from the checked-in HTML, CSS, and JavaScript. The optional test track is loaded from SoundHelix, so audio playback requires an internet connection and a user click that satisfies the browser's media-playback policy.

## Use the catapult

1. Drag the green knob downward into the pull zone.
2. Release it to launch the knob up the track.
3. Wait for the simulated bounce to settle on a volume from 0% to 100%.
4. Use **Reset** to return the control to 0%.

Dragging uses Pointer Events, so the interaction works with a mouse, stylus, or touch input. The catapult itself does not currently provide keyboard adjustment; the audio and reset buttons remain ordinary keyboard-accessible buttons.

## How it works

- `pointerdown`, `pointermove`, and `pointerup` measure the pull distance.
- Pull distance determines the initial launch velocity.
- `requestAnimationFrame` applies gravity, a small randomized drift, and damped bounces.
- The knob's final position is converted to a value between 0 and 100.
- That value updates both the displayed percentage and the `<audio>` element's volume.

The “Fake prediction” is intentionally random and does not determine the final result.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, labels, controls, and the remote test-audio source |
| `style.css` | Responsive layout, track/knob presentation, and shake animation |
| `script.js` | Pointer handling, launch simulation, volume state, audio controls, and reset behavior |

## Development and verification

Keep the project dependency-free unless its purpose changes. After editing:

```bash
node --check script.js
```

Then open `index.html` and verify the following in both a narrow and wide viewport:

- short pulls reset to 0%;
- stronger pulls launch and eventually settle;
- the displayed percentage stays between 0% and 100%;
- **Play test sound**, pause, and **Reset** respond correctly;
- mouse/touch dragging does not scroll the track while the knob is held.

There is currently no automated browser-test suite or package manifest.

## Contributing

Keep changes focused on the catapult-volume experiment, preserve its plain HTML/CSS/JavaScript architecture, and document any new runtime or setup requirement. Run the syntax check and manually exercise the interaction before opening a pull request.
