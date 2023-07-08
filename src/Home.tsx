import { DateTime } from 'luxon'
import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { RelativeTime } from './shared/RelativeTime'

interface Props {}

declare function DeviceSelector(): NullstackNode
declare function Recordings(): NullstackNode

export class Home extends Nullstack<Props> {
  _devices: MediaDeviceInfo[] = []
  _mediaRecorder: MediaRecorder
  _dataChunks: Blob[] = []
  _recordings: Array<{ date: DateTime; url: string }> = []

  mic: string
  webcam: string

  recordingState = false

  prepare({ page }: NullstackClientContext) {
    page.title = `Get Short Video`
    page.description = `Get a short video`
  }

  async hydrate() {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

    this._devices = await navigator.mediaDevices.enumerateDevices()
    this.mic = this._devices.find((device) => device.kind === 'audioinput')?.deviceId
    this.webcam = this._devices.find((device) => device.kind === 'videoinput')?.deviceId

    this.changeDevice()
  }

  terminate() {
    this._mediaRecorder.removeEventListener('dataavailable', this._onDataAvailableAddChunk)
    this._mediaRecorder.removeEventListener('stop', this._onStopSave)

    this._mediaRecorder = undefined
  }

  async startRecording() {
    this.recordingState = true
    this._dataChunks = []

    this._mediaRecorder.start()
  }

  async stopRecording() {
    if (this._mediaRecorder?.state === 'inactive') {
      return
    }

    this._mediaRecorder?.stop()
    this.recordingState = false
  }

  async changeDevice() {
    if (this.mic === 'false' && this.webcam === 'false') {
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio:
        this.mic !== 'false'
          ? this.mic
            ? {
                deviceId: this.mic,
              }
            : true
          : false,
      video:
        this.webcam !== 'false'
          ? this.webcam
            ? {
                deviceId: this.webcam,
              }
            : true
          : false,
    })

    const videoElement = document.querySelector<HTMLVideoElement>('#video')
    videoElement.srcObject = stream

    this.stopRecording()
    this._mediaRecorder = new MediaRecorder(stream)

    this._mediaRecorder.addEventListener('dataavailable', this._onDataAvailableAddChunk)
    this._mediaRecorder.addEventListener('stop', this._onStopSave)
  }

  _onDataAvailableAddChunk(event) {
    this._dataChunks.push(event.data)
  }
  _onStopSave() {
    const dataBlob = new Blob(this._dataChunks, { type: 'video/webm' })
    const dataUrl = URL.createObjectURL(dataBlob)

    this._recordings.unshift({
      date: DateTime.now(),
      url: dataUrl,
    })
  }

  _selectDevice({ event, data }) {
    this[data.prop] = event.target.value

    this.changeDevice()
  }

  renderDeviceSelector({ id, type }) {
    return (
      <div class="my-2">
        <select
          class="dark:text-gray-200 dark:bg-gray-900 w-full p-2"
          onchange={this._selectDevice}
          data-prop={`${id}`}
          value={this[`${id}`]}
        >
          <option value={'false'}>No device</option>
          {this._devices
            ?.filter((device) => device.kind === type)
            .map((device) => (
              <option value={device.deviceId}>{device.label}</option>
            ))}
        </select>
      </div>
    )
  }

  renderRecordings() {
    if (!this._recordings?.length) {
      return false
    }

    return (
      <div class="flex flex-col gap-2 mt-12 sm:mt-4">
        <h2>Past recordings</h2>

        <div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
          {this._recordings?.map((rec) => (
            <div class="flex flex-col gap-2 items-center w-full">
              <video src={rec.url} controls />
              <RelativeTime date={rec.date} />
              <a href={rec.url} download>
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  }

  render({ project }: NullstackClientContext) {
    return (
      <section class="Home">
        <article class="flex flex-col py-8">
          <h1 class="text-4xl mb-2">{project.name}</h1>

          <div class="flex-1">
            <div class="flex gap-4 flex-col md:flex-row items-start">
              <div class="md:w-1/5">
                <DeviceSelector id="mic" type="audioinput" />
                <DeviceSelector id="webcam" type="videoinput" />

                <div class="flex justify-center pt-4">
                  {!this.recordingState && (
                    <button
                      class="rounded-md dark:bg-blue-500 dark:text-white py-2 px-4"
                      onclick={this.startRecording}
                      disabled={this.mic === 'false' && this.webcam === 'false'}
                    >
                      Start recording
                    </button>
                  )}
                  {this.recordingState && (
                    <div class="flex flex-col justify-center gap-4">
                      <button class="py-2 px-4 rounded-md dark:bg-red-400 dark:text-white" onclick={this.stopRecording}>
                        Stop recording 🔴
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div class="flex flex-col flex-1">
                <div id="video-container">
                  <video id="video" class={`w-full ${this.webcam !== 'false' ? '' : 'h-16'}`} controls autoplay muted />
                </div>
              </div>
            </div>

            <Recordings />
          </div>
        </article>
      </section>
    )
  }
}
