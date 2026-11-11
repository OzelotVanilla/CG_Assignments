
const audio_context = new AudioContext()
const dyn_cmp__final = audio_context.createDynamicsCompressor()
dyn_cmp__final.connect(audio_context.destination)

/** In seconds. */
const offset_for_resuming = 0.1

interface Note
{
    /** MIDI index for the note. */
    midi: number
    /** Offset. Unit is beat. */
    start: number
    /** Length of note. Unit is beat. */
    duration: number
}

interface HarmonicsAndAmp
{
    /** n times of base freq. */
    multiple: number
    /** Amplitude of the partial. */
    amplitude: number
}

interface Track
{
    notes: Note[]
    timbre: HarmonicsAndAmp[]
    /** 0~1. Use this for lower amp. */
    balance: number
}

interface Sheet
{
    tracks: Track[]
    bpm: number
}

class InstrumentPartial
{
    osc: OscillatorNode
    gain: GainNode
    multiple: number

    constructor(harm_and_amp: HarmonicsAndAmp)
    {
        let osc = audio_context.createOscillator()
        let gain = audio_context.createGain()
        gain.gain.value = harm_and_amp.amplitude

        this.osc = osc
        this.gain = gain
        this.osc.connect(this.gain)
        this.multiple = harm_and_amp.multiple
    }

    schedule(frequency: number, start_time: number, duration: number)
    {
        this.osc.frequency.setValueAtTime(frequency * this.multiple, start_time)
        this.osc.start(start_time)
        this.osc.stop(start_time + duration)
    }
}

class Instrument
{
    gain: GainNode = audio_context.createGain()
    timbre: HarmonicsAndAmp[]

    constructor(timbre: HarmonicsAndAmp[], balance: number = 1)
    {
        this.timbre = timbre
        this.gain.gain.value = 0.15 * balance
        this.gain.connect(dyn_cmp__final)
    }

    schedule(frequency: number, start_time: number, duration: number)
    {
        for (const harm_and_amp of this.timbre)
        {
            const partial = new InstrumentPartial(harm_and_amp)
            partial.gain.connect(this.gain)
            partial.schedule(frequency, start_time, duration)
        }
    }
}

const tracks: Track[] = [
    {
        balance: 1, timbre: [
            { multiple: 1, amplitude: 0.9 }, { multiple: 2, amplitude: 1.0 }, { multiple: 3, amplitude: 0.8 },
            { multiple: 4, amplitude: 0.6 }, { multiple: 5, amplitude: 0.3 }, { multiple: 6, amplitude: 0.1 },
        ],
        notes: [
            { midi: 60, start: 0, duration: 1 }, { midi: 63, start: 1, duration: 1 },
            { midi: 65, start: 2, duration: 0.75 }, { midi: 63, start: 2.75, duration: 0.75 }, { midi: 65, start: 3.5, duration: 0.5 },

            { midi: 65, start: 4, duration: 0.5 }, { midi: 65, start: 4.5, duration: 0.5 },
            { midi: 70, start: 5, duration: 0.5 }, { midi: 68, start: 5.5, duration: 0.5 },
            { midi: 67, start: 6, duration: 0.25 }, { midi: 65, start: 6.25, duration: 0.5 }, { midi: 67, start: 6.75, duration: 0.75 },

            { midi: 67, start: 8, duration: 1 }, { midi: 70, start: 9, duration: 1 },
            { midi: 72, start: 10, duration: 0.75 }, { midi: 65, start: 10.75, duration: 0.75 }, { midi: 63, start: 11.5, duration: 0.5 },

            { midi: 70, start: 12, duration: 0.5 }, { midi: 70, start: 12.5, duration: 0.5 },
            { midi: 67, start: 13, duration: 0.5 }, { midi: 70, start: 13.5, duration: 0.5 },
            { midi: 70, start: 14, duration: 0.75 }, { midi: 72, start: 14.75, duration: 1 }, 
        ]
    },

    {
        balance: 0.5, timbre: [
            { multiple: 1, amplitude: 0.8 }, { multiple: 2, amplitude: 0.5 }, { multiple: 3, amplitude: 0.6 },
            { multiple: 4, amplitude: 0.3 }, { multiple: 5, amplitude: 0.1 }, { multiple: 6, amplitude: 0.2 },
        ],
        notes: [
            { midi: 36, start: 0, duration: 0.5 }, { midi: 36, start: 0.5, duration: 0.5 },
            { midi: 36, start: 1, duration: 0.5 }, { midi: 39, start: 1.5, duration: 0.5 },
            { midi: 41, start: 2, duration: 0.25 }, { midi: 41, start: 2.25, duration: 0.25 },
            /** rest note, */ { midi: 41, start: 2.75, duration: 0.25 },
            { midi: 41, start: 3.25, duration: 0.25 }, { midi: 36, start: 3.5, duration: 0.5 },

            { midi: 34, start: 4, duration: 0.5 }, { midi: 34, start: 4.5, duration: 0.5 },
            { midi: 34, start: 5, duration: 0.5 }, { midi: 38, start: 5.5, duration: 0.5 },
            { midi: 39, start: 6, duration: 0.25 }, { midi: 39, start: 6.25, duration: 0.25 },
            /** rest note, */ { midi: 39, start: 6.75, duration: 0.25 },
            { midi: 39, start: 7, duration: 0.5 }, { midi: 38, start: 7.5, duration: 0.5 },

            { midi: 36, start: 8, duration: 0.5 }, { midi: 36, start: 8.5, duration: 0.5 },
            { midi: 36, start: 9, duration: 0.5 }, { midi: 39, start: 9.5, duration: 0.5 },
            { midi: 41, start: 10, duration: 0.25 }, { midi: 41, start: 10.25, duration: 0.25 },
            /** rest note, */ { midi: 41, start: 10.75, duration: 0.25 },
            { midi: 41, start: 11.25, duration: 0.25 }, { midi: 36, start: 11.5, duration: 0.5 },

            { midi: 34, start: 12, duration: 0.5 }, { midi: 34, start: 12.5, duration: 0.5 },
            { midi: 34, start: 13, duration: 0.5 }, { midi: 35, start: 13.5, duration: 0.5 },
            { midi: 36, start: 14, duration: 0.25 }, { midi: 36, start: 14.25, duration: 0.25 },
            /** rest note, */ { midi: 36, start: 14.75, duration: 0.25 },
            { midi: 34, start: 15, duration: 0.5 }, { midi: 36, start: 15.5, duration: 0.5 },
        ]
    }
]

const instruments = tracks.map(track => new Instrument(track.timbre, track.balance))

const sheet: Sheet = {
    tracks,
    bpm: 128
}

export function onRockRamielConstructor(
    gl: WebGL2RenderingContext, program: WebGLProgram
)
{
    return async function (event: PointerEvent)
    {
        const button__ref = document.getElementById("rock_ramiel") as HTMLButtonElement
        const vsupos__rock_ramiel_started_time = gl.getUniformLocation(program, "rock_ramiel_started_time")
        const vsupos__is_rocking_ramiel = gl.getUniformLocation(program, "is_rocking_ramiel")

        // // Click start.
        button__ref.disabled = true

        // // Performance.
        await audio_context.resume()
        scheduleSheet(sheet)
        const start = performance.now() / 1000 + offset_for_resuming
        const one_beat_length = 60 / sheet.bpm / 4
        gl.uniform1f(vsupos__rock_ramiel_started_time, start)
        // Change sky colour for 8 times.
        for (let i = 0; i < 8; i++)
        {
            const [r, g, b] = [Math.random(), Math.random(), Math.random()]
            setTimeout(() => gl.clearColor(r, g, b, 1), 4 * i * one_beat_length * 1000)
        }
        // Red Sky
        setTimeout(() =>
        {
            gl.clearColor(0.718, 0.157, 0.180, 1.0)
            gl.uniform1i(vsupos__is_rocking_ramiel, 1)
        }, 4 * 8 * one_beat_length * 1000)

        // // Wait for end.
        await new Promise((resolve) => setTimeout(resolve, 8600))

        // // Clean up.
        button__ref.disabled = false
        gl.clearColor(0.627, 0.847, 0.937, 1.0) // #a0d8ef
        gl.uniform1i(vsupos__is_rocking_ramiel, 0)
    }
}

function scheduleSheet(sheet: Sheet)
{
    function convertBeatToSecond(beat: number)
    {
        return 60 / sheet.bpm * beat
    }

    const start_time = audio_context.currentTime + offset_for_resuming

    for (let i = 0; i < sheet.tracks.length; i++)
    {
        const track = sheet.tracks[i]
        const instrument = instruments[i]

        for (const note of track.notes)
        {
            const offset = start_time + convertBeatToSecond(note.start)
            const duration = convertBeatToSecond(note.duration)
            instrument.schedule(440 * Math.pow(2, (note.midi - 69) / 12), offset, duration)
        }
    }
}