import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import { createVideoSlice, VideoSlice } from "./createVideoSlice";
import {
  createSelectedVideoSlice,
  SelectedVideoSlice,
} from "./createSelectedVideoSlice";

export type AppState = VideoSlice & SelectedVideoSlice;

export const useBoundStore = create<AppState>()(
  devtools(
    persist(
      (...args) => ({
        ...createVideoSlice(...args),
        ...createSelectedVideoSlice(...args),
      }),
      {
        name: "video-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => {
          const {
            selectedVideo,
            setSelectedVideo,
            cleanSelectedVideo,
            setCropStartTime,
            ...persistedState
          } = state;
          return persistedState;
        },
      }
    )
  )
);
