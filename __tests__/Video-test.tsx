import 'react-native'
import React from 'react'
import {fireEvent, getByTestId, render} from '@testing-library/react-native'
import {expect, it} from '@jest/globals'
import Video from '../src/components/Video'
import {StatusBar} from 'react-native'


const navigationMock = {
  setOptions: jest.fn()
}

// jest.mock(
//   'react-native-video',
//   () => {
//     const { View } = require('react-native')
//     const MockTouchable = (props: JSX.IntrinsicAttributes) => {
//       return <View {...props} />
//     }
//     MockTouchable.displayName = 'Video'
//
//     return MockTouchable
//   }
// )

jest.mock('react-native-video', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return mockComponent('react-native-video')
});

it('renders/navigats throughout app screens', async () => {
  const {getByLabelText, getByTestId} = render(<Video navigation={navigationMock}/>)
  const video = getByLabelText(/video component/i)
  const enterFullScreenButton = getByTestId(/enter-full-screen/i)
  const pauseStartButton = getByTestId(/pause-start/i)

  //video is initially playing and presented not on full screen
  expect(video.props.paused).toBeFalsy()
  expect(video.props.fullscreen).toBeFalsy()
  expect(video.props.style).toEqual({
    "width": 100,
    "height": 100
  })

  //pause video and enter full screen mode
  fireEvent.press(enterFullScreenButton)
  fireEvent.press(pauseStartButton)

  expect(video.props.paused).toBeTruthy()
  expect(video.props.fullscreen).toBeTruthy()
  expect(video.props.style).toEqual({
    width: "100%",
    height: 200,
    zIndex: 5
  })
  expect(StatusBar._propsStack[0].hidden.value).toBeTruthy()

  //play video and exit full screen mode
  const pauseStartFSButton = getByTestId(/pause-start-fs/i)
  fireEvent.press(pauseStartFSButton)
  expect(video.props.paused).toBeFalsy()

  const exitFullScreenButton = getByTestId(/exit-full-screen/i)
  fireEvent.press(exitFullScreenButton)
  expect(video.props.fullscreen).toBeFalsy()
})